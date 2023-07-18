
import React, { useState, useMemo } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import MyTableBazargah from '../../../Common/Shared/Form/MyTableBazargah';
import { FadeLoader } from 'react-spinners';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import { formatter } from '../../../Utils/Formatter';
import QueryString from 'qs';
import { GetOngoingOrders, GetOrderSummary } from '../../../services/reportService';
import { PaymentStructureEnums } from '../../../Common/Enums/PaymentStructureEnums';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import MyReportTable from '../../../Common/Shared/Form/MyReportTable';

const GetOngoingOrder = () => {
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState<any>([]);
    const [clicked, SetClicked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [CottageCode, SetCottageCode] = useState('')
    const [ExternalOrders, SetExternalOrders] = useState<any>(null)
    const [CustomerName, SetCustomerName] = useState('')
    const [ProductName, SetProductName] = useState('')
    const [MaxPrice, SetMaxPrice] = useState<any>(0)
    const [MinPrice, SetMinPrice] = useState<any>(0)
    const [show, SetShow] = useState(false);
    const [disable, setDisable] = useState(false);
    const [CompanyId, SetCompanyId] = useState<any>(null)

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

        SetCompanyId(null)
        SetMinPrice(0)
        SetMaxPrice(0)


    }
    const columns = useMemo(() => [
        { Header: ' #', accessor: 'orderId' },
        { Header: ' نام شرکت', accessor: 'companyName' },
        {
            Header: 'تاریخ', accessor: 'createDate', Cell: (rows: any) => {

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
            }
        },
        { Header: 'نام مشتری', accessor: 'customerName' },
        {
            Header: 'محصول', accessor: 'productName'
        },
        { Header: ' مبلغ', accessor: 'price' },


        {
            Header: 'وزن سفارش', accessor: 'requestedQuantity', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.requestedQuantity))
            }
        }, {
            Header: 'وزن حواله', accessor: 'plannedQuantity', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.plannedQuantity))
            }
        }, {
            Header: 'وزن ارسال شده', accessor: 'shippedQuantity', Cell: (rows: any) => {
                return (formatter.format(rows.row.original.shippedQuantity))
            }
        },
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


                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
            const { data, status } = await GetOngoingOrders(config);
            if (status === 200) {

                SetResponse(data.result.ongoingOrdersReports);
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
                'نام شرکت': item.companyName,
                'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })),
                'نام مشتری': item.customerName,
                'محصول': item.productName,
                'مبلغ': item.price,
                'وزن سفارش': item.requestedQuantity,
                'وزن حواله': item.plannedQuantity,
                'وزن ارسال شده': item.shippedQuantity,




            }))




            return (
                <div className='user-progress' >

                    <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                        <h6 className='m-2 text-center' >گزارش سفارشات در جریان </h6>



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
                                <label> نام کالا</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={ProductName} onChange={(e: any) => SetProductName(e.target.value)}
                                    placeholder="نام کالا"
                                />
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
                        <h6 className='m-2 text-center' >گزارش سفارشات در جریان </h6>



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
                                <label> نام کالا</label>


                                <input className="form-control opacityForInput  mb-4" type="text" value={ProductName} onChange={(e: any) => SetProductName(e.target.value)}
                                    placeholder="نام کالا"
                                />
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

export default GetOngoingOrder