import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { SyncShippingReports } from "../../../services/outScopeService";
import { useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import Select from 'react-select'
import { GetAllShippingCompanies } from '../../../services/ShippingService';
import { toast } from 'react-toastify';
import InputMask from "../../../Utils/InputMask";
import MyTableBazargah from '../../../Common/Shared/Form/MyTableBazargah';
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { RadioButton } from "../../../Utils/RadioButton";
import QueryString from "qs";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { formatter } from "../../../Utils/Formatter";
import { ShippingCompanySource } from "../../../Common/Enums/ShippingCompanySourceId";
import { BsTextRight } from "react-icons/bs";




const UpdateShippingReports: React.FC = () => {

    const [startDate, SetStartDate] = useState('')
    const [endDate, SetEndDate] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [companies, setCompanies] = useState([])
    const [shippingCompanyId, setshippingCompanyId] = useState(null)
    const [disable, setDisable] = useState(false)
    let [loading, setLoading] = useState(false);
    let [clicked, setClicked] = useState(false);
    const [report, setReport] = useState([])
    const [extraData, setExtraData] = useState([])

    const [useExistingData, SetuseExistingData] = useState(true)
    const [reportMethod, SetReportMethod] = useState('3days')
    let color = "#0c4088"

    const navigator = useNavigate();
    const getBulkJob = (selected: any) => {
        if (selected === 2) {
            enableSelectedItem()
        }
        if (selected === 3) {
            copySelectedItem()
        } if (selected === 4) {
            DeleteSelectedItem()
        }
        if (selected === 5) {
            disableSelectedItem()
        }
    }

    const DeleteSelectedItem = async () => {

    }
    const copySelectedItem = async () => {



    }
    const enableSelectedItem = async () => {


    }
    const disableSelectedItem = async () => {


    }



    const getShippingCompany = async () => {
        try {
            const { data, status } = await GetAllShippingCompanies();

            setCompanies(data.result.shippingCompanies.values)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        getShippingCompany()

    }, [])



    const handelStartDate = (value: any) => {
        if (value === null) {
            SetStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetStartDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }
    }
    const handelEndDate = (value: any) => {
        if (value === null) {
            SetEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetEndDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }
    }

    const handelSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        let config: any;
        if (reportMethod === '3days') {
            config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    startDate: null, endDate: null, shippingCompanyId: null, useExistingData


                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };


        }
        else {
            config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    startDate, endDate, shippingCompanyId, useExistingData


                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
        }
        try {

            const { data, status } = await SyncShippingReports(config)

            if (status === 200) {
                toast.success("اطلاعات با موفقیت بروز رسانی شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

                setReport(data.result.reports)
                setExtraData(data.result.reports.map((item: any) => ({ Id: item.id, data: JSON.parse(item.extraData) })))
                setDisable(true)
                setLoading(false)
                setClicked(true)


            }

        } catch (error) {
            setLoading(false)
        }
        setDisable(false)


    }
    console.log(extraData);

    const RadioChanger = (e: any) => {

        SetReportMethod(e.target.value)
        setDisable(false)
    }

    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'شناسه حواله', accessor: 'shippingId' },
        {
            Header: 'تاریخ', accessor: 'createDate', Cell: (rows: any) => {


                return (rows.row.original.createDate ? new Date(rows.row.original.createDate).toLocaleDateString('fa-IR') : '')
            }
        },
        {
            Header: 'واحد', accessor: 'measureUnitId', Cell: rows => {

                return (MeasureUnitSample.filter((q: any) => q.id === rows.row.original.measureUnitId).map((x: any) => x.name)[0])


            }
        },
        {
            Header: 'وزن', accessor: 'quantity', Cell: rows => {

                return (formatter.format(rows.row.original.quantity))
            }
        },
        { Header: 'شماره بارنامه', accessor: 'shippingNumber' },
        { Header: "سریال بارنامه", accessor: 'shippingSerial' },
        { Header: "نام راننده", accessor: 'delivererName' },
        { Header: "شماره راننده", accessor: 'delivererNumber' },
        { Header: "پلاک", accessor: 'delivererPlaque' },
        {
            Header: 'وضعیت', accessor: 'voided', Cell: rows => {
                return (rows.row.original.voided ? 'باطل شده' : 'فعال')
            }
        },
        {
            Header: 'سامانه باربری', accessor: 'shippingCompanySourceId', Cell: rows => {

                return (rows.row.original.shippingCompanySourceId ? ShippingCompanySource.filter((i: any) => i.id === rows.row.original.shippingCompanySourceId).map((i: any) => i.name)[0] : 'همه')
            }
        },
        { Header: 'نام شرکت', accessor: 'companyName' },






    ], [extraData]);

    const shippingCompanySelect = () => {

        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const data = report
    const handelFrom = () => {
        setClicked(false)
        setDisable(false)
    }

    if (!clicked) {




        if (loading === false) {

            return (<div className='user-progress col-12 ' >
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                        <h5 >درخواست اطلاعات </h5>
                        <p>در این بخش می توانید اطلاعات ارسال  را از باربری دریافت کنید.</p>
                    </div>
                </div>
                <div className='  '>
                    <div className='  col-8 '>
                        <div className=" ">
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
                    <div className="row">

                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 ">


                        </div >
                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-2 ">

                            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 ">
                                <form className="form form-group ml-4" >
                                    <div className="row  ">
                                        <div className="col-lg-6 col-md-4 col-sm-11  form-input mb-4 textOnInput">
                                            <label > نام باربری </label>

                                            <Select
                                                menuShouldScrollIntoView={false}
                                                isDisabled={reportMethod === 'byDate' ? false : true}
                                                value={shippingCompanySelect().filter((i: any) => i.value === shippingCompanyId).map((i: any) => i)}
                                                placeholder="شرکت باربری"
                                                options={shippingCompanySelect()}
                                                maxMenuHeight={150}
                                                onChange={(e: any) => {
                                                    setshippingCompanyId(e.value)
                                                    setDisable(false)

                                                }}
                                            />

                                        </div>
                                        <div className="col-lg-5 col-md-6 col-sm-12  mb-4 mr-2 form-group">


                                            <label className="form-check-label">

                                                <input type="checkbox" checked={useExistingData} className="form-check-input" onChange={(e: any) => SetuseExistingData(e.target.checked)} />
                                                استفاده از دیتای موجود
                                            </label>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 mb-4 textOnInput">
                                            <label >از تاریخ </label>
                                            <div className='form-group '>
                                                <DatePicker
                                                    calendar={persian}
                                                    disabled={reportMethod === 'byDate' ? false : true}

                                                    locale={persian_fa}
                                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                    value={startDate}
                                                    onChange={handelStartDate}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-lg-6  col-md-6 col-sm-6 mb-4  textOnInput" >
                                            <label> تا تاریخ</label>
                                            <div className='form-group '>
                                                <DatePicker
                                                    disabled={reportMethod === 'byDate' ? false : true}
                                                    calendar={persian}

                                                    locale={persian_fa}
                                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                    value={endDate}
                                                    onChange={handelEndDate}
                                                />

                                            </div>


                                        </div>
                                    </div>

                                </form>




                            </div>

                        </div>

                    </div>
                    <div className='row justify-content-center mt-4 mb-1'>

                        <div className='mr-2'>
                            <NavLink to='/admin' className="btn btn-danger float-left">بازگشت</NavLink>
                        </div>
                        <div className=' ml-4'>
                            <button type="submit" disabled={disable} className="btn btn-success float-right " onClick={handelSubmit}>تایید</button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>

                    </div>
                </div>
            </div>

            )
        }
        else {
            return (
                <div >
                    <div style={{ position: 'fixed', top: '40%', left: '40%' }}>
                        <p>دریافت اطلاعات ...</p>
                        <FadeLoader loading={loading} color={color} />
                    </div>
                </div>)
        }
    }
    else {
        if (report.length > 0 && loading === false) {
            const dataForExcel = data.map((item: any) => ({
                "#": item.id,
                "شناسه حواله": item.shippingId,
                "تاریخ بارنامه": (new Date(item.createDate).toLocaleDateString('fa-IR')),
                "واحد": (MeasureUnitSample.filter((q: any) => q.id === item.measureUnitId).map((x: any) => x.name)[0]),
                "وزن": item.quantity,
                "شماره بارنامه": item.shippingNumber,
                "سریال بارنامه": item.shippingSerial,
                "نام راننده": item.delivererName,
                "شماره راننده": item.delivererNumber,
                'پلاک': item.delivererPlaque,
                'وضعیت': (item.voided === true ? 'باطل شده' : 'فعال'),
                "سامانه باربری": (item.shippingCompanySourceId ? ShippingCompanySource.filter((i: any) => i.id === item.shippingCompanySourceId).map((i: any) => i.name)[0] : 'همه'),
                'نام شرکت': item.companyName,
                'SenderAddress': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SenderAddress ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SenderAddress : ''),
                'SenderName': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SenderName ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SenderName : ''),
                'GoodName': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].GoodName ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].GoodName : ''),
                'ReqID': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].ReqID ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].ReqID : ''),
                'SealedNo': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SealedNo ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].SealedNo : ''),
                'CompanyCode': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].CompanyCode ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].CompanyCode : ''),
                'CompanyName': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].CompanyName ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].CompanyName : ''),
                "kaCode": (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].kaCode ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].kaCode : ''),
                'ReceiverAddress': (extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].ReceiverAddress ? extraData.filter((i: any) => i.Id === item.id).map((i: any) => i.data)[0].ReceiverAddress : '')
            }))

            return (
                <div className=" statbox widget-content widget-content-area ">
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>


                        <MyTableBazargah columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} rowProps={(row: any) => ({

                            style: {
                                backgroundColor: row.values.shippingId !== 0 ? 'lightgreen' : '#ff00003b',

                                cursor: ""
                            }
                        })} bulkJob={getBulkJob} />



                    </div>
                    <div className="d-flex justify-content-end">
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
export default UpdateShippingReports