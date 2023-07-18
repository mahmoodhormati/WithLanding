import { useMemo, useState } from "react";
import { GetOrdersReports, GetShippingReports } from "../../../services/reportService";
import { useEffect } from "react";
import { getExtraData } from "../../../services/extraService";
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import { NavLink } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader'
import MyTableBazargah from "../../../Common/Shared/Form/MyTableBazargah";
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import persian_fa from "react-date-object/locales/persian_fa";
import QueryString from 'qs';
import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";

const ReportShipping: React.FC = () => {

    const [shipped, setshipped] = useState<any>(false);
    const [HasShippingContract, setHasShippingContract] = useState<any>(true);
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [OrderId, SetOrderId] = useState<any>(null)
    const [OrderExtId, SetOrderExtId] = useState<any>(null)
    const [OrderDetailExtId, SetOrderDetailExtId] = useState<any>(null)
    const [Response, SetResponse] = useState<any>([]);
    const [clicked, SetClicked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])

    const [show, SetShow] = useState(false);
    const [disable, setDisable] = useState(false);

    const [open, SetOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#0c4088");
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {

        arrayOfSelectedData = data.map((item: any) => item.original);


        return (arrayOfSelectedData)

    }
    const getBulkJob = (selected: any) => {

    }



    const handelStartDate = (value: any) => {
        if (value === null) {
            setStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setStartDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }
    }
    const handelEndDate = (value: any) => {
        if (value === null) {
            setEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setEndDate(new Date(value.toDate().setHours(27, 29, 59, 0)).toJSON())
        }
    }
    const handelSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();

        try {
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    StartDate, EndDate,
                    shipped: shipped === false ? null : shipped,
                    HasShippingContract: HasShippingContract === false ? null : HasShippingContract
                    , OrderExtId:OrderExtId, OrderDetailExtId:OrderDetailExtId, OrderId


                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
            const { data, status } = await GetShippingReports(config);
            if (status === 200) {

                SetResponse(data.result.shippingReport);
                SetClicked(true);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)

        }

    }
    const handelFrom = () => {
        SetClicked(false)
        SetResponse(null)
    }
    let formatter = new Intl.NumberFormat('fa-IR', {

        maximumFractionDigits: 0,
        minimumFractionDigits: 0,


    });
    let formater = new Intl.NumberFormat('fa-IR', {


    });

    const columns = useMemo(() => [
        { Header: ' باربری', accessor: 'shippingCompanyName' },
        { Header: ' قرارداد ', accessor: 'shippingContractCode' },
        { Header: ' نام شرکت ', accessor: 'companyName' },
        { Header: ' نام مشتری ', accessor: 'customerName' },
        { Header: ' گروه مشتری ', accessor: 'groupName' },
        { Header: ' نام محصول ', accessor: 'productName' },
        {
            Header: 'تاریخ', accessor: 'createDate', Cell: (rows: any) => {

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
            }
        },
        { Header: 'حواله', accessor: 'shippingId' },
        { Header: ' سفارش', accessor: 'orderId' },
        { Header: 'ش.بازارگاه', accessor: 'orderExtId' },

        {
            Header: 'ش.ج.سفارش', accessor: 'orderDetailId'
        }, {
            Header: ' تخصیص', accessor: 'orderDetailExtId'
        },

        { Header: 'وزن', accessor: 'plannedQuantity' },
        {
            Header: 'محدودیت ارسال', accessor: 'deliveryMethodId', Cell: (row: any) =>
            (
                DeliveryMethods.filter((i: any) => i.id === row.row.original.deliveryMethodId).map((i: any) => i.name)[0]
            )
        },
        { Header: ' تحویل گیرنده', accessor: 'receiverName' },
        { Header: 'آدرس تحویل ', accessor: 'receiverAddress' },
        { Header: 'شناسه ملی/کد ملی تحویل گیرنده ', accessor: 'receiverNationalCode' },

        { Header: 'کدپستی', accessor: 'receiverPostalCode' },
        {
            Header: 'تلفن هماهنگی', accessor: 'receiverTel', Cell: (rows: any) => {

                return (<div>{`${rows.row.original.receiverTel ? rows.row.original.receiverTel : ''}  ${rows.row.original.receiverMobile ? rows.row.original.receiverMobile : ''} `}</div>)
            }
        },
        { Header: 'کدیکتای جهاد ', accessor: 'receiverUniqueId' },
    ], []);
    const data = useMemo(() => Response, [Response]);;

    if (!clicked) {
        if (!loading) {
            return (
                <div className='user-progress' >
                    <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                            <h5 > گزارش  تخصیص و ارسال کالا </h5>
                            <p>در این بخش می توانید  گزارش  تخصیص و ارسال کالا را دریافت کنید.</p>
                        </div>
                    </div>
                    <div className=''>
                        <div className=' '>


                            <form >
                                <div className=" col-12 ">
                                    <div className=" col-xl-12 col-md-12 mb-4  col-xs-12  ">

                                        <div className="col-xl-6 col-md-6  col-xs-12 ">

                                            <input type="checkbox" checked={shipped} onClick={(e: any) => setshipped(e.target.checked)} />
                                            <label className="ml-3">فقط  حمل شده  </label>

                                        </div>
                                        <div className=" col-xl-6 col-md-6  col-xs-12  ">

                                            <input type="checkbox" checked={HasShippingContract} onClick={(e: any) => setHasShippingContract(e.target.checked)} />
                                            <label className="ml-3">فقط دارای قرارداد باربری</label>

                                        </div>

                                    </div>
                                </div>
                                <div className='row d-flex justify-content-center '>
                                    <div className=" col-md-6 col-lg-6 col-sm-11 m-2 ">
                                        <div className='row  '>

                                            <div className="col-lg-6 col-sm-12  mb-4 " style={{ position: 'relative' }}>
                                                <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>از تاریخ </label>
                                                <div className='form-group '>
                                                    <DatePicker
                                                        calendar={persian}

                                                        locale={persian_fa}
                                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                        value={StartDate}
                                                        onChange={handelStartDate}
                                                    />

                                                </div>
                                            </div>
                                            {show ? <p style={{ color: 'red' }}> شروع تاریخ از 1401/4/1 است</p> : null}

                                            <div className=" col-lg-6 col-sm-12 ">
                                                <div className=" mb-4 " style={{ position: 'relative' }}>
                                                    <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تا تاریخ </label>
                                                    <div className='form-group '>
                                                        <DatePicker

                                                            calendar={persian}

                                                            locale={persian_fa}
                                                            style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                            value={EndDate}
                                                            onChange={handelEndDate}
                                                        />

                                                    </div>

                                                </div>

                                            </div>




                                            <div className="col-lg-4 col-sm-12  mb-4 textOnInput">

                                                <label>شماره سفارش سیستمی</label>
                                                <input type="number" className="opacityForInput form-control" placeholder="شماره سفارش" value={OrderId} onChange={e => SetOrderId(e.target.value)} />
                                            </div>
                                            <div className="col-lg-4 col-sm-12  mb-4 textOnInput">

                                                <label>شناسه جانبی سفارش</label>
                                                <input type="number" className="opacityForInput form-control" placeholder="شناسه خرید بازارگاه" value={OrderExtId} onChange={e => SetOrderExtId(e.target.value)} />
                                            </div>
                                            <div className="col-lg-4 col-sm-12  mb-4 textOnInput">

                                                <label>شناسه جانبی جزییات سفارش</label>
                                                <input type="number" className="opacityForInput form-control" placeholder="شناسه تخصیص بازارگاه" value={OrderDetailExtId} onChange={e => SetOrderDetailExtId(e.target.value)} />
                                            </div>


                                            <div className='col-6 '>
                                                <button type="submit" disabled={disable} className="btn btn-success float-right " onClick={handelSubmit} >تایید</button>
                                            </div>
                                            <div className='col-6 '>
                                                <NavLink to='/admin' className="btn btn-danger ">بازگشت</NavLink>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

            )
        }
        else {
            return (
                <div style={{ position: 'fixed', top: '40%', left: '40%' }}>
                    <p>دریافت اطلاعات ...</p>
                    <FadeLoader loading={loading} color={color} />
                </div>
            )

        }
    }

    else {
        if (Response && Response.length > 0) {
            const dataForExcel = Response.map((item: any) => ({
                ' قرارداد ': item.shippingContractCode,
                ' باربری': item.shippingCompanyName,
                'نام شرکت': item.companyName,
                'نام مشتری': item.customerName,
                'گروه مشتری': item.groupName,
                'نام محصول': item.productName,
                'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })),
                'سفارش': item.orderId,
                'حواله': item.shippingId,
                'ش.بازارگاه': item.orderExtId,
                'ش.ج.شفارش': item.orderDetailId,
                'تخصیص ': item.orderDetailExtId,
                'وزن': item.plannedQuantity,
                'تریلی': (item.deliveryMethodId === 5 ? 'بله' : 'خیر'),
                ' تحویل گیرنده': item.receiverName,
                'آدرس تحویل ': item.receiverAddress,
                ' شماره/شناسه ملی تحویل گیرنده': item.receiverNationalCode,
                'کد پستی': item.receiverPostalCode,
                'تلفن هماهنگی': `${item.receiverTel ? item.receiverTel : ''} ${item.receiverMobile ? item.receiverMobile : ''}`,
                'کد یکتای جهاد': item.receiverUniqueId,

            }))
            return (
                <div className=" statbox widget-content widget-content-area ">
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>

                        <MyTableBazargah columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                        {/*<ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />*/}
                    </div>
                    <div className="d-flex justify-content-end m-2">
                        <ExportToExcel apiData={dataForExcel} fileName='لیست گزارش' />
                    </div>
                </div>

            )
        } else {
            return (
                <div className=" statbox widget-content widget-content-area rounded">
                    <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>

                    <div className='text-center mt-5'>
                        <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                    </div>
                </div>
            )
        }


    }
}
export default ReportShipping