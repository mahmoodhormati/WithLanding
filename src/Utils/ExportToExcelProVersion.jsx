import React from 'react'
import http from '../services/httpService'
import { useState } from 'react';
import * as XLSX from "xlsx";
import { InvoceTypes } from '../Common/Enums/InvoiceTypeIdEnums';
import { EntityTypes } from '../Common/Enums/EntityTypesEnums';
import { PaymentStructureEnums } from '../Common/Enums/PaymentStructureEnums';
import { PriceUnitEnums } from '../Common/Enums/PriceUnit';
import { PaymentStatusEnums } from '../Common/Enums/PaymentStatus';
import { MeasureUnitSample } from '../Common/Enums/MeasureUnitSample';
import { GetAllOrganisation } from '../services/organisationService';
import { ShippingStatusEnums } from '../Common/Enums/ShippingStatusEnums';
import { OrderStatus } from '../Common/Enums/OrderStatusEnums';
import { GetProducts } from '../services/productService';
import { GetAllSuppliersExcel } from '../services/supplyService';
import { GetAllWareHousesExcel } from '../services/wareHouseService';
import { SupplyTypesEnums } from '../Common/Enums/SupplyTypesEnums';
import { GetCompanyChild } from '../services/companiesService';
import { useSelector } from 'react-redux';
import { GetGroupWithCompany } from '../services/GroupService';
import { ShippingCompanySource } from '../Common/Enums/ShippingCompanySourceId';
import { DeliveryMethods } from '../Common/Enums/DeliveryMethodsEnums';
const FileSaver = require("file-saver");






export const ExportToExcelProVersion = ({ url, fileName }) => {
   
    let configure = window.globalThis.site_url;
    const [apiData, setData] = useState([]);
    const companies = useSelector(state => state.companies)

    let newData;

    const getDataFromurl = async () => {

        newData = []
        try {
            const { data, status } = await http.get(`${configure}/${url}`)

            if (status === 200) {
                switch (url.split('/')[0]) {
                    case 'AuthenticatedUser':

                        const response = await GetAllOrganisation()




                        newData = data.result.users.values.map((item) => ({
                            'شناسه': item.id,
                            'نام کاربری': item.userName,
                            'نام': item.firstName,
                            'نام خانوادگی': item.lastName,
                            'کد ملی': item.nationalCode,
                            'سازمان': (item.organizationId ? response.data.result.organizationLists.values.filter(i => i.id === item.organizationId).map(i => i.name)[0] : ''),
                            'شناسه ملی': (item.organizationId ? response.data.result.organizationLists.values.filter(i => i.id === item.organizationId).map(i => i.nationalId)[0] : ''),
                        }))
                        break;
                    case 'Credit':

                        newData = data.result.credits.values.map(item=>({
                            
                            '#': item.id,
                            'نام ': item.name,
                            'واحد': (PriceUnitEnums.filter((i) => i.id === item.priceUnitId).map((i) => i.name)[0]),
                            'ارزش':item.value,
                            'توضیحات': item.comment



                        }))
                        break;
                    case 'Invoice':

                        newData = data.result.invoices.values.map((item) => ({

                            '#': item.id,
                            'نام مشتری': item.customerName,
                            'نام سازمان': item.organizationName,
                            'نوع صورتحساب': (InvoceTypes.filter(i => i === item.invoiceTypeId).map(i => i.name)[0]),
                            'شناسه': (item.entityTypeId === 10 ? ` سفارش # ${item.entityId}` : `جزییات سفارش # ${item.entityId}`),
                            'قیمت': item.price,
                            'واحد': (PriceUnitEnums.filter((i) => i.id === item.priceUnitId).map((i) => i.name)[0]),
                            'نوع پرداخت': (PaymentStructureEnums.filter(i => i.id === item.paymentMethodId).map(i => i.name)[0]),
                            'وضعیت پرداخت': (PaymentStatusEnums.filter((i) => i.id === item.paymentStatusId).map((i) => i.name)[0]),
                            'تاریخ ثبت': (item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''),
                            'تاریخ سررسید': (item.installmentStartDate ? new Date(item.installmentStartDate).toLocaleDateString('fa-IR') : ''),
                            'دوره اقساط': item.installmentPeriod,
                            'تعداد اقساط': item.installmentOccureCount,
                            'توضیحات': item.comment






                        }))
                        break;
                    case 'Order':

                        {
                            const response = await GetAllOrganisation()







                            newData = data.result.orderList.values.map(item => ({




                                'شماره سفارش': item.id,
                                'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })),
                                'خریدار': (`${item.customer.firstName? item.customer.firstName:''} ${item.customer.lastName?item.customer.lastName:''}`) ,
                                'شماره ملی': item.customer.nationalCode,
                                'سازمان': (item.customer.organizationId ? response.data.result.organizationLists.values.filter(i => i.id === item.customer.organizationId).map(i => i.name)[0] : ''),
                                'شناسه ملی': (item.customer.organizationId ? response.data.result.organizationLists.values.filter(i => i.id === item.customer.organizationId).map(i => i.nationalId)[0] : ''),
                                'شرکت': item.companyName,
                                'نحوه پرداخت': (PaymentStructureEnums.filter(i => i.id === item.paymentMethodId).map(i => i.name)[0]),
                                'وضعیت ارسال': (ShippingStatusEnums.filter(data => data.id === item.shippingStatusId).map(data => data.name)[0]),
                                'وضعیت سفارش': (OrderStatus.filter(data => data.id === item.orderStatusId).map(item => item.name)[0]),
                                'وضعیت پرداخت': (PaymentStatusEnums.filter(i => i.id === item.paymentStatusId).map((i) => i.name)[0]),

                                'مبلغ': item.orderTotal


                            }))


                        }
                        break;
                    case 'Organization':

                        newData = data.result.organizationLists.values.map((item) => ({
                            '#': item.id,
                            'نام سازمان': item.name,
                            'شناسه ملی شرکت': item.nationalId,
                            'شمار ثبت ': item.registrationNumber,
                        }))
                        break;
                    case 'Payment':

                        newData = data.result.payments.values.map(item => ({

                            '#': item.id,
                            'شناسه مشتری': item.customerId,
                            'نام مشتری': item.customerName,
                            'نام سازمان': item.organizationName,
                            'کد پیگیری': item.trackingCode,
                            'قیمت': item.price,
                            'واحد': (PriceUnitEnums.filter((i) => i.id === item.priceUnitId).map((i) => i.name)[0]),
                            'پرداخت': (PaymentStatusEnums.filter(i => i.id === item.paymentStatusId).map((i) => i.name)[0]),
                            'نوع پرداخت': (PaymentStructureEnums.filter(i => i.id === item.paymentMethodId).map(i => i.name)[0]),
                            'تاریخ ثبت': (item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''),
                            'تاریخ سررسید': (item.paymentDueDate ? new Date(item.paymentDueDate).toLocaleDateString('fa-IR') : ''),
                            'توضیحات': item.comment,
                            'پرداخت شده': (item.paid ? 'پرداخت شده' : 'پرداخت نشده'),
                            'تایید شده': (item.confirmed ? 'تایید شده' : 'تایید نشده'),


                        }))
                        break;
                    case 'Product':


                        if (url.split('/')[1] === 'GetProducts') {
                            newData = data.result.products.values.map((item) => ({
                                'شناسه': item.id,
                                'نام کالا': item.name,
                                'قیمت': item.price,
                                'نام انگلیسی': item.englishName,
                                'نام شرکت': item.companyName,
                                'وضعیت': (item.active === true ? 'فعال' : 'غیر فعال')
                            }))
                        }
                        else if (url.split('/')[1] === 'GetProductSupplies') {

                            newData = data.result.productSupplies.values.map(item => ({

                                '#': item.id,
                                ' شناسه عرضه': item.name,
                                'محصول': item.product.name,
                                'انبار': item.wareHouse.wareHouseName,
                                'قیمت': item.price,
                                'واحد ': (MeasureUnitSample.filter(item => item.id === item.measureUnitId).map(item => item.name)[0]),
                                'مفدار عرضه': item.quantity,
                                'مقدار خریداری شده': item.orderedQuantity,
                                'مقدار مانده': item.remainedQuantity,
                                'شماره کوتاژ': item.cottageCode,
                                'تاریخ اعتبار': new Date(item.endDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                                'شرکت': item.companyName,
                                'وضعیت': (item.avtive ? 'فعال' : 'غیر فعال'),
                                'توضیحات': item.comment,



                            }))
                        }
                        break;
                    case 'Shipping':

                        if (url.split('/')[1] === 'GetShippings') {

                            newData =  data.result.shippings.values.map(item=>( {
                                "شناسه حواله": item.id,
                                'شرکت': item.companyName,
                                "مقدار حواله": item.plannedQuantity,
                                "مقدار حمل شده": item.shippedQuantity,
                                "واحد": (MeasureUnitSample.filter((q) => q.id === item.measureUnitId).map((x) => x.name)[0]),
                                "تاریخ ": (new Date(item.createDate).toLocaleDateString('fa-IR')),
                                'وضعیت ارسال': (ShippingStatusEnums.filter(data => data.id === item.shippingStatusId).map(data => data.name)[0]),
                                "تاریخ ارسال ": (new Date(item.shippingDate).toLocaleDateString('fa-IR')),
                                'نحوه ارسال':(DeliveryMethods.filter((q) => q.id === item.deliveryMethodId).map((x) => x.name)[0]),
                                'شماره قرارداد':item.shippingContractCode,
                                'نام باربری':item.shippingCompanyName,

                                


                            }

                               
                            ))

                        }
                        else if (url.split('/')[1] === 'GetShippingReports') {

                            newData = data.result.shippingReports.values.map(item => ({
                              

                                    "#": item.id,
                                    "شناسه حواله": item.shippingId,
                                    "تاریخ بارنامه": (new Date(item.createDate).toLocaleDateString('fa-IR')),
                                    "واحد": (MeasureUnitSample.filter((q) => q.id === item.measureUnitId).map((x) => x.name)[0]),
                                    "وزن": item.quantity,
                                    "شماره بارنامه": item.shippingNumber,
                                    "سریال بارنامه": item.shippingSerial,
                                    'هزینه باربری':item.shippingCost,
                                    "نام راننده": item.delivererName,
                                    "شماره راننده": item.delivererNumber,
                                    'پلاک': item.delivererPlaque,
                                    "سامانه باربری": (item.shippingCompanySourceId ? ShippingCompanySource.filter((i) => i.id === item.shippingCompanySourceId).map((i) => i.name)[0] : 'همه'),
                                    'شناسه جانبی مبدا':item.baseExtId
                    
                                }))


                           


                        }
                        else if(url.split('/')[1] === 'GetShippingContracts'){

                        }
                        else {
                            newData = data.result.shippingCompanies.values.map(item => ({

                                '#': item.id,
                                'نام باربری': item.name,
                                'شماره کد': item.code,
                                'سامانه باربری': (item.shippingCompanySourceId?ShippingCompanySource.filter(i=>i.id===item.shippingCompanySourceId).map(i=>i.name)[0]:''),





                            }))

                        }
                        break;
                    case 'Supply':

                        if (url.split('/')[1] === 'GetSupplys') {

                            const responseProduct = await GetProducts()

                            const responseWareHouse = await GetAllWareHousesExcel()








                            newData = data.result.supplies.values.map(item => ({

                                '#': item.id,
                                'قراداد': item.contractNumber,
                                'نام کالا': (item.productId ? responseProduct.data.result.products.values.filter(i => i.id === item.productId).map(i => i.name)[0] : ''),
                                'مقدار': item.quantity,
                                'واحد': (PriceUnitEnums.filter((i) => i.id === item.priceUnitId).map((i) => i.name)[0]),
                                'انبار': (item.wareHouseId ? responseWareHouse.data.result.wareHouses.values.filter(i => i.id === item.wareHouseId).map(i => i.name)[0] : ''),
                                'تامین کننده': item.supplierName,
                                'نوع تامین': (SupplyTypesEnums.filter((i) => i.id === item.supplyTypeId).map((i) => i.name)[0]),
                                'کد  کوتاژ': item.cottageCode,
                                'توضیحات': item.comment







                            }))
                        }
                        else {
                            newData = data.result.suppliers.values.map(item => ({

                                '#': item.id,
                                'نام تامین کننده': item.name,
                                'شرکت': item.companyName,



                            }))

                        }
                        break;
                    case 'WareHouse':


                        let arr = []
                        let finalArr = []
                        for (let i = 0; i < companies.length; i++) {

                            const { data, status } = await GetGroupWithCompany(4, companies[i].id);

                            if (data.result.groups.length > 0) {
                                arr.push(data.result.groups)
                            }


                        }

                        finalArr = Array.prototype.concat.apply([], arr);

                        newData = data.result.wareHouses.values.map(item => ({

                            '#': item.id,
                            'نام': item.name,
                            'گروه انبار':(item.groupId?finalArr.filter(i=>i.id===item.groupId).map(i=>i.name)[0]:''),
                            'حجم-کیلوگرم':item.capacity,
                            'شرکت': item.companyName,
                            'آدرس':item.address


                        }))
                        break;

                    default:
                        break;






                }







            }



            exportToCSV(newData, fileName)


        } catch (error) {
            console.log(error);

        }


    }






    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.;charset=UTF-8";
    const contents = 'center'
    const fileExtension = ".xlsx";

    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"], Workbook: { Views: [{ RTL: true }, { RTL: true }] } };

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <button className='btn btn-success' onClick={

            getDataFromurl
        }>دریافت فایل اکسل</button>
    );
};