import React, { useState, useMemo } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import MyTableBazargah from '../../../Common/Shared/Form/MyTableBazargah';
import { FadeLoader } from 'react-spinners';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { formatter } from '../../../Utils/Formatter';
import QueryString from 'qs';
import { GetOrderSummary } from '../../../services/reportService';
import { PaymentStructureEnums } from '../../../Common/Enums/PaymentStructureEnums';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import MyReportTable from '../../../Common/Shared/Form/MyReportTable';


const OrderSummary = () => {
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState<any>([]);
    const [clicked, SetClicked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [CottageCode, SetCottageCode] = useState('')
    const [ExternalOrders, SetExternalOrders] = useState<any>(null)
    const [HasDeviationFromInvoice, SetHasDeviationFromInvoice] = useState(false)
    const [HasDeviationFromApproved, SetHasDeviationFromApproved] = useState(false)
    const [HasDeviationFromPaid, SetHasDeviationFromPaid] = useState(false)
    const [CustomerName, SetCustomerName] = useState('')
    const [ProductName, SetProductName] = useState('')
    const [MaxPrice, SetMaxPrice] = useState<any>(0)
    const [MinPrice, SetMinPrice] = useState<any>(0)
    const [GroupName, SetGroupName] = useState('')
    const [show, SetShow] = useState(false);
    const [disable, setDisable] = useState(false);
    const [CompanyId, SetCompanyId] = useState<any>(null)
const navigate=useNavigate()
    const [open, SetOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#0c4088");
    const companies = useSelector((state: RootState) => state.companies)
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
    const handelFromReset = () => {
        setLoading(false)
        SetResponse(null)
        setStartDate('')
        setEndDate('')
        SetExternalOrders(null)
        SetCottageCode('')
        SetProductName('')
        SetCustomerName('')
        SetHasDeviationFromPaid(false)
        SetHasDeviationFromApproved(false)
        SetHasDeviationFromInvoice(false)
        SetCompanyId(null)
        SetMinPrice(0)
        SetMaxPrice(0)
        SetGroupName('')

    }
    const columns = useMemo(() => [
        { Header: ' #', accessor: 'orderId' ,Cell:(rows:any)=>{

            return(
                <Link className='text-primary' to={`/admin/orderDetail/${rows.row.original.orderId}`} target='_blank'>{rows.row.original.orderId} </Link>
            )
        }},
        { Header: 'نام مشتری', accessor: 'customerName' },
        { Header: ' گروه مشتری', accessor: 'groupName' },
        {
            Header: 'تاریخ', accessor: 'createDate', Cell: (rows: any) => {

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
            }
        },
        { Header: ' نام شرکت', accessor: 'companyName' },
       
        { Header: ' کد کوتاژ ', accessor: 'cottageCode' },
        {
            Header: 'محصول', accessor: 'productName'
        },
       
        
        { Header: ' فی', accessor: 'basePrice' },
        

        {
            Header: ' وزن سفارش', accessor: 'quantity', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.quantity))
            }
        }, 
        {
            Header: ' وزن تخصیص', accessor: 'allocatedQuantity', Cell: (rows: any) => {
                return (rows.row.original.allocatedQuantity?formatter.format(rows.row.original.allocatedQuantity):0)
            }
        },{
            Header: ' نحوه پرداخت', accessor: 'paymentMethod',
        },

        { Header: 'بازه پرداخت', accessor: 'installmentPeriod' },
       
        
        {
            Header: 'مبلغ کل', accessor: 'totalPrice', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.totalPrice))
            }
        },
        
        {
            Header: 'مبلغ تخصیص', accessor: 'totalAllocated', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.totalAllocated))
            }
        },
        {
            Header: 'مبلغ صورتحساب', accessor: 'invoicePrice', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.invoicePrice))
            }
        },
        {
            Header: ' کل پرداختی', accessor: 'totalPaid', Cell: (rows: any) => {
                return (rows.row.original.totalPaid?formatter.format(rows.row.original.totalPaid):0)
            }
        },
        {
            Header: ' پرداخت تایید شده', accessor: 'paidPrice', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.confirmedPrice))
            }
        },

        {
            Header: 'پرداخت شده', accessor: 'confirmedPrice', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.paidPrice))
            }
        },
       
        // {
        //     Header: 'باقیمانده تا تایید شده', accessor: 'deviationFromConfirmed', Cell: (rows: any) => {
        //         return (formatter.format(rows.row.original.deviationFromConfirmed))
        //     }
        // },
        // {
        //     Header: 'باقیمانده تا پرداخت شده', accessor: 'deviationFromPaid', Cell: (rows: any) => {
        //         return (formatter.format(rows.row.original.deviationFromPaid))
        //     }
        // },
       
    ], []);

    const handelSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();

        try {
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    CompanyId,
                    CottageCode,
                    MinCreateDate: StartDate,
                    MaxCreateDate: EndDate,
                    ExternalOrders,
                    CustomerName,
                    ProductName,
                    MinPrice: MinPrice === 0 ? null : MinPrice,
                    MaxPrice: MaxPrice === 0 ? null : MaxPrice,
                    GroupName,
                    HasDeviationFromInvoice,
                    HasDeviationFromApproved,
                    HasDeviationFromPaid

                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
            const { data, status } = await GetOrderSummary(config);
            if (status === 200) {

                SetResponse(data.result.orderSummary);
                SetClicked(true);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            SetClicked(false);


        }

    }














    const data = useMemo(() => Response, [Response]);;



    const ExternalOrdersID = () => {

        return ([{ label: "همه", value: null }, { label: "سفارشات سیستمی", value: false }, { label: "سفارشات متفرقه ", value: true }])


    }
    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }

    if (loading === true) {


        return (


            <div className='user-progress' >



                <div style={{ position: 'fixed', top: '40%', left: '40%' }}>
                    <p>دریافت اطلاعات ...</p>
                    <FadeLoader loading={loading} color={color} />
                </div>

            </div>
        )


    }


    else {
        if (Response && Response.length > 0) {
            const dataForExcel = Response.map((item: any) => ({
                ' شناسه': item.orderId,
                'نام مشتری': item.customerName,
                'گروه مشتری': item.groupName,
                'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })),
                'نام شرکت': item.companyName,
                ' کد کوتاژ': item.cottageCode,
                'محصول': item.productName,
                'فی': item.basePrice,
                'وزن سفارش': item.quantity,
                'وزن تخصیص': (item.allocatedQuantity?item.allocatedQuantity:0),
                'نحوه پرداخت ': item.paymentMethod,
                'بازه پرداخت': item.installmentPeriod,
                'مبلغ کل': item.totalPrice,
                'مبلغ تخصیص': item.totalAllocated,
                ' مبلغ صورتحساب': item.invoicePrice,
                'کل پرداختی':(item.totalPaid?item.totalPaid:0),
                ' پرداخت تایید شده': item.confirmedPrice,
                ' پرداخت  شده': item.paidPrice,
                'باقیمانده تا پرداخت شده': item.deviationFromPaid,
                'باقیمانده تا تایید شده': item.deviationFromConfirmed,
                

            }))




            return (
                <div className='user-progress' >

                    <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                        <h6 className='m-2 text-center' >خلاصه گزارش سفارشات</h6>

                        <form className='form-row mt-4' >





                            {companies.length > 1 ?
                                <div className="col-lg-2 mb-4  form-group textOnInput">

                                    <label> شرکت</label>
                                    <Select
                                        value={CompaniesIDs().filter((i: any) => i.value === CompanyId).map((i: any) => i)}
                                        menuShouldScrollIntoView={false}
                                        placeholder=' لطفا نام شرکت را انتخاب کنید'
                                        options={CompaniesIDs()}



                                        onChange={(e: any) => {


                                            SetCompanyId(e.value)


                                        }

                                        }

                                    />


                                </div> : ''}
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>مبدا سفارش </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={ExternalOrdersID().filter((i: any) => i.value === ExternalOrders).map((i: any) => i)}
                                        placeholder='مبدا سفارش '
                                        options={ExternalOrdersID()}

                                        onChange={(e: any) => {
                                            SetExternalOrders(e.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-2 col-sm-12  mb-4 " style={{ position: 'relative' }}>
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


                            <div className=" col-lg-2 col-sm-12 ">
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

                                    </div></div>

                            </div>


                            <div className="col-lg-2 col-sm-12    mb-4 textOnInput">
                                <label> کد کوتاژ</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={CottageCode} onChange={(e: any) => SetCottageCode(e.target.value)}
                                    placeholder=" کد کوتاژ"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12   mb-4 textOnInput" >
                                <label> نام مشتری</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={CustomerName} onChange={(e: any) => SetCustomerName(e.target.value)}
                                    placeholder="نام مشتری"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label>  حداقل قیمت </label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={formatter.format(MinPrice)}
                                    onChange={(e: any) => {
                                        SetMinPrice(Number(e.target.value.replaceAll(",", "")))

                                    }}
                                    placeholder="حداقل قیمت"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label> حداکثر قیمت</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={formatter.format(MaxPrice)}
                                    onChange={(e: any) => {
                                        SetMaxPrice(Number(e.target.value.replaceAll(",", "")))

                                    }}
                                    placeholder="حداکثر قیمت"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label> نام کالا</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={ProductName} onChange={(e: any) => SetProductName(e.target.value)}
                                    placeholder="نام کالا"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label>نام گروه</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={GroupName} onChange={(e: any) => SetGroupName(e.target.value)}
                                    placeholder="نام گروه"
                                />
                            </div>


                            <div className=" col-xl-4 col-md-12 mb-4  col-xs-12  ">

                                <div className="col-xl-12 col-md-6  col-xs-12 ">

                                    <input type="checkbox" checked={HasDeviationFromInvoice} onClick={(e: any) => SetHasDeviationFromInvoice(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از صورتحساب</label>

                                </div>
                                <div className=" col-xl-12 col-md-6  col-xs-12  ">

                                    <input type="checkbox" checked={HasDeviationFromApproved} onClick={(e: any) => SetHasDeviationFromApproved(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از پرداختهای تایید شده</label>

                                </div>
                                <div className=" col-xl-12 col-md-6  col-xs-12  ">

                                    <input type="checkbox" checked={HasDeviationFromPaid} onClick={(e: any) => SetHasDeviationFromPaid(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از پرداخت شده ها</label>

                                </div>
                            </div>








                        </form>
                        <div className="d-flex justify-content-end ">
                            <div className=" row text-nowrap ">
                                <div className="col-6  ">
                                    <button
                                        className=" text-nowrap btn btn-danger " onClick={handelFromReset}>حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        className="  btn btn-primary" onClick={handelSubmit}>جستجو
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className=" statbox widget-content widget-content-area ">
                        <div>


                            <MyReportTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                            {/*<ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />*/}
                        </div>
                        <div className="d-flex justify-content-end m-2">
                            <ExportToExcel apiData={dataForExcel} fileName='لیست گزارش' />
                        </div>
                    </div>
                </div>

            )
        }
        else {
            return (
                <div className='user-progress' >

                    <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                        <h6 className='m-2 text-center' >خلاصه گزارش سفارشات</h6>

                        <form className='form-row mt-4' >





                            {companies.length > 1 ?
                                <div className="col-lg-2 mb-4  form-group textOnInput">

                                    <label> شرکت</label>
                                    <Select
                                        value={CompaniesIDs().filter((i: any) => i.value === CompanyId).map((i: any) => i)}
                                        menuShouldScrollIntoView={false}
                                        placeholder=' لطفا نام شرکت را انتخاب کنید'
                                        options={CompaniesIDs()}



                                        onChange={(e: any) => {


                                            SetCompanyId(e.value)


                                        }

                                        }

                                    />


                                </div> : ''}
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>مبدا سفارش </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={ExternalOrdersID().filter((i: any) => i.value === ExternalOrders).map((i: any) => i)}
                                        placeholder='مبدا سفارش '
                                        options={ExternalOrdersID()}

                                        onChange={(e: any) => {
                                            SetExternalOrders(e.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-2 col-sm-12  mb-4 " style={{ position: 'relative' }}>
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


                            <div className=" col-lg-2 col-sm-12 ">
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

                                    </div></div>

                            </div>


                            <div className="col-lg-2 col-sm-12    mb-4 textOnInput">
                                <label> کد کوتاژ</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={CottageCode} onChange={(e: any) => SetCottageCode(e.target.value)}
                                    placeholder=" کد کوتاژ"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12   mb-4 textOnInput" >
                                <label> نام مشتری</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={CustomerName} onChange={(e: any) => SetCustomerName(e.target.value)}
                                    placeholder="نام مشتری"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label>  حداقل قیمت </label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={formatter.format(MinPrice)}
                                    onChange={(e: any) => {
                                        SetMinPrice(Number(e.target.value.replaceAll(",", "")))

                                    }}
                                    placeholder="حداقل قیمت"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label> حداکثر قیمت</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={formatter.format(MaxPrice)}
                                    onChange={(e: any) => {
                                        SetMaxPrice(Number(e.target.value.replaceAll(",", "")))

                                    }}
                                    placeholder="حداکثر قیمت"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label> نام کالا</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={ProductName} onChange={(e: any) => SetProductName(e.target.value)}
                                    placeholder="نام کالا"
                                />
                            </div>
                            <div className="col-lg-2 col-sm-12  mb-4 textOnInput">
                                <label>نام گروه</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={GroupName} onChange={(e: any) => SetGroupName(e.target.value)}
                                    placeholder="نام گروه"
                                />
                            </div>


                            <div className=" col-xl-4 col-md-12 mb-4  col-xs-12  ">

                                <div className="col-xl-12 col-md-6  col-xs-12 ">

                                    <input type="checkbox" checked={HasDeviationFromInvoice} onClick={(e: any) => SetHasDeviationFromInvoice(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از صورتحساب</label>

                                </div>
                                <div className=" col-xl-12 col-md-6  col-xs-12  ">

                                    <input type="checkbox" checked={HasDeviationFromApproved} onClick={(e: any) => SetHasDeviationFromApproved(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از پرداختهای تایید شده</label>

                                </div>
                                <div className=" col-xl-12 col-md-6  col-xs-12  ">

                                    <input type="checkbox" checked={HasDeviationFromPaid} onClick={(e: any) => SetHasDeviationFromPaid(e.target.checked)} />
                                    <label className="m-1 ml-2">دارای اختلاف از پرداخت شده ها</label>

                                </div>
                            </div>








                        </form>
                        <div className="d-flex justify-content-end ">
                            <div className=" row text-nowrap ">
                                <div className="col-6  ">
                                    <button
                                        className=" text-nowrap btn btn-danger " onClick={handelFromReset}>حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        className="  btn btn-primary" onClick={handelSubmit}>جستجو
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className=" statbox widget-content widget-content-area">
                        <div>
                            <div className='text-center mt-5'>
                                <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                            </div>
                        </div>
                    </div>
                </div>

            )

        }



    }
}

export default OrderSummary