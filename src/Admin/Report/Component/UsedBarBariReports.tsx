import React, { useState, useMemo } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa";
import { NavLink, useNavigate } from 'react-router-dom';


import FadeLoader from 'react-spinners/FadeLoader'
import MyTableBazargah from "../../../Common/Shared/Form/MyTableBazargah";
import { GetFinancialCardex, GetShippingReportReports } from "../../../services/reportService";
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Select from 'react-select';
import { GetUsedBarBariReportsCompanies } from '../../../services/reportService';
import QueryString from 'qs';
import { RadioButton } from '../../../Utils/RadioButton';
import MyClickableReport from '../../../Common/Shared/Form/MyClickableReport';
import { FcShipped } from 'react-icons/fc';
import { toast } from 'react-toastify';
import './tooltip.css'


const UsedBarBariReport: React.FC = () => {

    const companies = useSelector((state: RootState) => state.companies)
    const [StartDate, setStartDate] = useState('');


    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState([]);
    const [clicked, SetClicked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [companyId, SetCompanyId] = useState<any>(null)
    const [show, SetShow] = useState(false);
    const [disable, setDisable] = useState(true);
    const [OnlyShipping, setOnlyShipping] = useState(true)
    const [open, SetOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#0c4088");
    const [reportMethod, SetReportMethod] = useState('yesterday')
    const [detail, SetDetail] = useState([])
    const navigate = useNavigate()


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

    const RadioChanger = (e: any) => {

        SetReportMethod(e.target.value)
        if (e.target.value === 'byDate') {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
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
            setEndDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())

        }
    }
    const CustomerKardex = async (id: any) => {

        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                CustomerId: id

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetFinancialCardex(config)
            if (status === 200 && data.result.cardices.length > 0) {

                navigate(`/admin/kartex/${id}`, { state: { 'User': data.result.cardices } })



            }
            else if (status === 200 && data.result.cardices.length === 0) {
                toast.warning('اطلاعاتی جهت نمایش یافت نشد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }

        } catch (error) {

        }







    }


    const handelSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();
        let yeseterDay = new Date(new Date().setDate(new Date().getDate() - 1));
        let today = new Date()
        let threeDayago = new Date(new Date().setDate(new Date().getDate() - 3));
        if (reportMethod === 'yesterday') {

            let config = {}
            if (companies.length === 1) {

                try {
                    config = {

                        headers: { 'Content-Type': 'application/json' },

                        params: {
                            StartDate: yeseterDay.toJSON(), EndDate: today.toJSON(), CompanyId: companies[0].id, OnlyShipping


                        },
                        paramsSerializer: (params: any) => {

                            return QueryString.stringify(params)
                        }


                    };


                    const { data, status } = await GetShippingReportReports(config);
                    if (status === 200) {

                        SetResponse(data.result.shippingReportReports);
                        SetClicked(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            else {

                if (companyId) {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate: yeseterDay.toJSON(), EndDate: today.toJSON(), CompanyId: companyId, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }

                }
                else {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate: yeseterDay.toJSON(), EndDate: today.toJSON(), CompanyId: null, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }
                }

            }
        }
        else if (reportMethod === '3days') {
            let config = {}
            if (companies.length === 1) {

                try {
                    config = {

                        headers: { 'Content-Type': 'application/json' },

                        params: {
                            StartDate: threeDayago.toJSON(), EndDate: today.toJSON(), CompanyId: companies[0].id, OnlyShipping


                        },
                        paramsSerializer: (params: any) => {

                            return QueryString.stringify(params)
                        }


                    };


                    const { data, status } = await GetShippingReportReports(config);
                    if (status === 200) {

                        SetResponse(data.result.shippingReportReports);
                        SetClicked(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            else {

                if (companyId) {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate: threeDayago.toJSON(), EndDate: today.toJSON(), CompanyId: companyId, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }

                }
                else {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate: threeDayago.toJSON(), EndDate: today.toJSON(), CompanyId: null, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }
                }

            }

        }
        else {
            let config = {}
            if (companies.length === 1) {

                try {
                    config = {

                        headers: { 'Content-Type': 'application/json' },

                        params: {
                            StartDate, EndDate, CompanyId: companies[0].id, OnlyShipping


                        },
                        paramsSerializer: (params: any) => {

                            return QueryString.stringify(params)
                        }


                    };


                    const { data, status } = await GetShippingReportReports(config);
                    if (status === 200) {

                        SetResponse(data.result.shippingReportReports);
                        SetClicked(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            else {

                if (companyId) {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate, EndDate, CompanyId: companyId, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }

                }
                else {
                    try {
                        config = {

                            headers: { 'Content-Type': 'application/json' },

                            params: {
                                StartDate, EndDate, CompanyId: null, OnlyShipping


                            },
                            paramsSerializer: (params: any) => {

                                return QueryString.stringify(params)
                            }


                        };
                        const { data, status } = await GetShippingReportReports(config);
                        if (status === 200) {

                            SetResponse(data.result.shippingReportReports);
                            SetClicked(true);
                            setLoading(false)
                        }
                    } catch (error) {
                        console.log(error);
                        setLoading(false)

                    }
                }

            }
        }
    }
    const handelFrom = () => {
        SetClicked(false)
    }
    let formatter = new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,


    });
    let formater = new Intl.NumberFormat('fa-IR', {


    });
    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const columns = useMemo(() => [

        // {
        //     // Header: 'نام مشتری', accessor: 'customerName', Cell: (row: any) => {

        //     //     return (
        //     //         <div className='text-primary' onClick={() => CustomerKardex(row.row.original.customerId)}>{row.row.original.customerName}</div>
        //     //     )
        //     // }
        // },
        {
            Header: 'نام مشتری', accessor: 'customerName'
        },


        {
            Header: 'جمع مقدار', accessor: 'totalShipping', Cell: (row: any) => {
                return (<div className="con-tooltip right" title='' >


                    <p> {formater.format(row.row.original.totalShipping)}</p>
                    {row.row.original.totalShippingDescription?
                    <div className='tooltipShipTop'>
                        <p></p>
                        {row.row.original.totalShippingDescription.split('|').map((item: any, index: any) => (

                            <p>{`${item}`}</p>


                        ))

                        }

                        {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                        <p></p>

                    </div>:''}

                </div>)
            }
        },
        {
            Header: 'جمع ارزش بار', accessor: 'totalShippingValue', Cell: (row: any) => {
                return (<div className="con-tooltip right" title='' >


                    <p> {formater.format(row.row.original.totalShippingValue)}</p>

                    {row.row.original.totalShippingValueDescription?  <div className='tooltipShipTop'>
                        <p></p>
                        {row.row.original.totalShippingValueDescription.split('|').map((item: any, index: any) => (

                            <p>{`${item}`}</p>


                        ))

                        }

                        {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                        <p></p>

                    </div>:''}

                </div>)
            }
        },
        {
            Header: 'جمع مبلغ بارنامه', accessor: 'totalShippingCost', Cell: (row: any) => {
                return (<div className="con-tooltip right" title='' >


                    <p> {formater.format(row.row.original.totalShippingCost)}</p>

                    {row.row.original.totalShippingCostDescription?
                     <div className='tooltipShipTop'>
                        <p></p>
                        {row.row.original.totalShippingCostDescription.split('|').map((item: any, index: any) => (

                            <p>{`${item}`}</p>


                        ))

                        }
                        {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                        <p></p>

                    </div>:''}

                </div>)
            }
        },
    ], [Response]);
    let defaultValue: any = CompaniesIDs()[0]
    const data: any = useMemo(() => Response, [Response]);;
    const formatTrProps = (state: any = {}) => {


        {
            return {
                onClick: async () => {

                    SetShow(!show)
                    await SetDetail(state)


                },
            }
        }

    }



    if (!clicked) {
        if (!loading) {
            return (
                <div className='user-progress' >
                    <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                            <h5 > گزارش بارنامه های صادر شده</h5>
                            <p>در این بخش می توانید  گزارش بارنامه های صادر شده را دریافت کنید.</p>
                        </div>


                        <div className='  col-8 '>
                            <div className=" ">
                                <div className="m-3">
                                    <RadioButton
                                        changed={RadioChanger}
                                        id='1'
                                        isSelected={reportMethod === 'yesterday'}
                                        label='روز اخیر'
                                        value='yesterday'
                                    />
                                </div>
                                <div className="m-3">
                                    <RadioButton
                                        changed={RadioChanger}
                                        id='1'
                                        isSelected={reportMethod === '3days'}
                                        label='سه روز اخیر'
                                        value='3days'
                                    />
                                </div>
                                <div className="m-3">
                                    <RadioButton
                                        changed={RadioChanger}
                                        id='2'
                                        isSelected={reportMethod === 'byDate'}
                                        label='انتخاب تاریخ'
                                        value='byDate'
                                    />
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className='row d-flex justify-content-center '>
                        <div className=' col-lg-6 col-sm-12 m-2'>


                            <form className='row'>


                                {companies.length > 1 ?
                                    <div className="col-lg-6 mb-4  form-group textOnInput">

                                        <label> شرکت</label>
                                        <Select
                                            value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder=' لطفا نام شرکت را انتخاب کنید'
                                            options={CompaniesIDs()}


                                            isClearable={true}
                                            onChange={(e: any) => {


                                                SetCompanyId(e.value)


                                            }

                                            }

                                        />


                                    </div> : ''}
                                <div className="col-lg-6 col-md-6 col-sm-12  mb-4 form-group">


                                    <label className="col-sm-12 form-check-label">

                                        <input type="checkbox" checked={OnlyShipping} className="form-check-input" onChange={(e: any) => setOnlyShipping(e.target.checked)} />
                                        فقط بارنامه هایی که بر مبنای حواله حمل صادر شده اند  را نمایش بده
                                    </label>
                                </div>
                                <div className=' col-12 form-row'>

                                    {disable === false ?
                                        <>
                                            <div className=" col ">
                                                <div className=" mb-4 " style={{ position: 'relative' }}>
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

                                            </div>
                                            <div className=" col ">
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

                                            </div></>:''}

                                        </div>
                                <div className='col-12'>
                                    <div className='row justify-content-between'>
                                        <div className='col-6 '>
                                            <button type="submit" className="btn btn-success float-right " onClick={handelSubmit} >تایید</button>
                                        </div>
                                        <div className='col-6 '>
                                            <NavLink to='/admin' className="btn btn-danger ">بازگشت</NavLink>
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

                'تاریخ بارنامه': item.barDate,
                'شماره بارنامه': item.bar_n,
                'شماره سریال بارنامه': item.bar_n_s,
                'شماره تلفن راننده': item.dTel,
                'وزن بارنامه': item.netT,
                'کد تخصیص بازارگاه': item.kaCode,
                'کرایه بار': item.kra2,
                'کد باربری': item.companyCode,
                'نام راننده': item.dName,
                'نام خانوادگی راننده': item.dFam,
                'پلاک': item.tplk,
                'ساعت بارنامه': item.barTime,
                'شناسه یا کد ملی تحویل گیرنده': item.ka_E_Code,
                'نام تحویل گیرنده': item.tarGetName,
                'شماه قرارداد': item.ghErtebat,
                'آدرس بارنامه': item.barAdd,


            }))
            return (
                <div className=" statbox widget-content widget-content-area ">
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>

                        <MyClickableReport show={detail} formatRowProps={(state: any) => formatTrProps(state)} columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
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

export default UsedBarBariReport