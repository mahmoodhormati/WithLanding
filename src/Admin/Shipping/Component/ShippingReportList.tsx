import QueryString from 'qs'
import React, { useMemo, useState } from 'react'
import { GetShippingReports, SetShippingReport } from '../../../services/ShippingService'
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch'
import { MeasureUnitSample } from '../../../Common/Enums/MeasureUnitSample'
import { ShippingCompanySource } from '../../../Common/Enums/ShippingCompanySourceId'
import MyTable from '../../../Common/Shared/Form/MyTable'
import { formatter } from '../../../Utils/Formatter'
import { VoidedTypeEnum } from '../../../Common/Enums/VoidedTypeEnum'
import { TbNotesOff } from 'react-icons/tb'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import AddShippingIdModal from './AddShippingIdModal'
import './TooltipForShippingReports.css'
import Select from 'react-select'
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion'

const ShippingReportList: React.FC = () => {
    const [shippingReports, SetshippingReports] = useState<any>([])
    const [ShippingNumber, SetShippingNumber] = useState<any>(getDefault().ShippingNumber ? getDefault().ShippingNumber : '')
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [ShippingSerial, SetShippingSerial] = useState<any>(getDefault().ShippingSerial ? getDefault().ShippingSerial : '')
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([])
    const [ShippingIds, SetShippingIds] = useState<any>(getDefault().ShippingIds ? getDefault().ShippingIds : [])
    const [Loading, setLoading] = useState<any>(false)
    const [IsOpen, SetIsOpen] = useState(false)
    const [Item, SetItem] = useState<any>()
    const[HasShippingId,SetHasShippingId]=useState<any>()







    const modalIsOpen = (item: any) => {
        SetItem(item)
        SetIsOpen(true)
    }
    const CloseModal = () => {
        SetItem(null)
        SetIsOpen(false)
    }
    const params = {
        ShippingNumber,
        ShippingSerial,
        ShippingIds,HasShippingId

    }

    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''

    }
    let SortColumn: any = null
    let SortingDirectionId: any = null
    const param = { PageSize, PageNumber }
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {

        arrayOfSelectedData = data.map((item: any) => item.original);


        return (arrayOfSelectedData)

    }
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


    const hasShippingIds = () => {

        return ([{ label: "همه", value: null }, { label: "خیر", value: false }, { label: "بله ", value: true }])


    }
    const copySelectedItem = async () => {
        // const arrayOfData = getSelectedData(selectedRows);
        // const copyData = arrayOfData.map((item: any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        // let successCount = 0;
        // let errorCount = 0;
        // for (let i = 0; i < copyData.length; i++) {


        //     try {


        //         const { data, status } = await SetShippingCompany(copyData[i])
        //         if (status === 200) {
        //             SetOpen(true)

        //             SetStateSuccess(successCount += 1)
        //         }


        //     } catch (error) {
        //         SetOpen(true)

        //         SetStateError(errorCount += 1)
        //     }


        // }


    }
    const enableSelectedItem = async () => {
        // const arrayOfData = getSelectedData(selectedRows);
        // const copyData = arrayOfData.map((item: any) => { return { ...item, active: true } })

        // let successCount = 0;
        // let errorCount = 0;
        // for (let i = 0; i < copyData.length; i++) {


        //     try {


        //         const { data, status } = await SetShippingCompany(copyData[i])
        //         if (status === 200) {
        //             SetOpen(true)

        //             SetStateSuccess(successCount += 1)
        //         }


        //     } catch (error) {
        //         SetOpen(true)

        //         SetStateError(errorCount += 1)
        //     }


        // }


    }
    const disableSelectedItem = async () => {
        // const arrayOfData = getSelectedData(selectedRows);
        // const copyData = arrayOfData.map((item: any) => { return { ...item, active: false } })

        // let successCount = 0;
        // let errorCount = 0;
        // for (let i = 0; i < copyData.length; i++) {


        //     try {

        //         let payload = {
        //             'shippingCompany': copyData[i]
        //         }

        //         const { data, status } = await SetShippingCompany(copyData[i])
        //         if (status === 200) {
        //             SetOpen(true)

        //             SetStateSuccess(successCount += 1)
        //         }



        //     } catch (error) {
        //         SetOpen(true)

        //         SetStateError(errorCount += 1)
        //     }


        // }


    }
    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const getShippingReport = async () => {

        try {

            setLoading(true)

            let configs = {

                headers: { 'Content-Type': 'application/json' },
                params: {

                    IsAdmin: true,
                    PageNumber: 0,
                    PageSize: 10,IncludeEData: true,
                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }
            };

            const { data, status } = await GetShippingReports(configs)
            if (status === 200) {

                setLoading(false)
                SetshippingReports(data.result.shippingReports.values);
                setTotalCount(data.result.shippingReports.totalCount)





            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }
    const GetDataBySearch = async () => {

        try {

            setLoading(true)

            let configs = {

                headers: { 'Content-Type': 'application/json' },
                params: {
                    ShippingIds: [ShippingIds],
                    ShippingSerial,
                    ShippingNumber,
                    IsAdmin: true,
                    PageNumber: 0,
                    PageSize, IncludeEData: true,HasShippingId
                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }
            };

            const { data, status } = await GetShippingReports(configs)
            if (status === 200) {

                setLoading(false)
                SetshippingReports(data.result.shippingReports.values);
                setTotalCount(data.result.shippingReports.totalCount)
                setPageNumber(0)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));


            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }
    const urlForExcel = () => {

        let parameter = {
            ShippingIds: [ShippingIds],
            ShippingSerial,
            ShippingNumber,
            IsAdmin: true,
            PageNumber: 0,
            PageSize:100000, IncludeEData:false ,HasShippingId



        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }
    const ChangeToUnVoided = async (item: any) => {

        const body = { "report": { ...item, voided: false } }

        try {
            setLoading(true)
            const { data, status } = await SetShippingReport(body)
            if (status === 200) {
                setLoading(true)
                toast.success('وضعیت گزارش با موفقیت تغییر کرد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined

                    })
                GetDataByPage()
            }


        } catch (error) {
            console.log(error);

        }
    }
    const ChangeVoided = async (item: any) => {

        const body = { "report": { ...item, voided: true } }

        try {
            setLoading(true)
            const { data, status } = await SetShippingReport(body)
            if (status === 200) {
                setLoading(true)
                toast.success('گزارش باطل شد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined

                    })
                GetDataByPage()
            }


        } catch (error) {
            console.log(error);

        }
    }
    const GetDataByPage = async () => {

        try {

            setLoading(true)

            let configs = {

                headers: { 'Content-Type': 'application/json' },
                params: {
                    ShippingIds: [ShippingIds],
                    ShippingSerial,
                    ShippingNumber,
                    IsAdmin: true,
                    PageNumber,
                    IncludeEData: true,
                    PageSize,HasShippingId
                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }
            };

            const { data, status } = await GetShippingReports(configs)
            if (status === 200) {

                setLoading(false)
                SetshippingReports(data.result.shippingReports.values);
                setTotalCount(data.result.shippingReports.totalCount)


                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }


    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        {
            Header: 'حواله', accessor: 'shippingId', Cell: (row: any) => {


                if (row.row.original.shippingId !== 0 && row.row.original.shippingId !== null) {

                    if (row.row.original.shippingCompanySourceId === 1) {
                        let Edata = JSON.parse(row.row.original.eData)
                        return (<div className="con-tooltipList left" title='' >


                            {row.row.original.shippingId}

                            <div className='tooltipListReport'>
                                <p></p>
                                <p>{`CompanyCode: ${Edata.CompanyCode}`}</p>
                                <p>{`KaCode: ${Edata.kaCode}`}</p>
                                <p>{`ghErtebat: ${Edata.ghErtebat}`}</p>
                                <p>{`barAdd: ${Edata.barAdd} `}</p>

                                <p></p>

                            </div>

                        </div>)
                    }
                    else {
                        let Edata = JSON.parse(row.row.original.eData)
                        return (<div className="con-tooltipList left" title='' >


                            {row.row.original.shippingId}

                            <div className='tooltipListReport'>
                                <p></p>
                                <p>{`DestinationCityName :${Edata.DestinationCityName} | DestinationStateName  : ${Edata.DestinationStateName} | GoodName  : ${Edata.GoodName} | CompanyName  : ${Edata.CompanyName}`}</p>
                                <p>{`SenderName :${Edata.SenderName} `}</p>
                                <p>{`ReceiverName :${Edata.ReceiverName} `}</p>
                                <p>{`ReqID :${Edata.ReqID} `}</p>
                                <p>{`SealedNo :${Edata.SealedNo} `}</p>
                                <p>{`ReceiverAddress :${Edata.ReceiverAddress} `}</p>
                                <p></p>

                            </div>

                        </div>)
                    }
                }
                else {
                    if (row.row.original.shippingCompanySourceId === 1) {
                        let Edata = JSON.parse(row.row.original.eData)
                        return (<div className="con-tooltipList left" title='' >


                            نامشخص

                            <div className='tooltipListReport'>
                                <p></p>
                                <p>{`CompanyCode: ${Edata.CompanyCode}`}</p>
                                <p>{`KaCode: ${Edata.kaCode}`}</p>
                                <p>{`ghErtebat: ${Edata.ghErtebat}`}</p>
                                <p>{`barAdd: ${Edata.barAdd} `}</p>

                                <p></p>

                            </div>

                        </div>)
                    }
                    else {
                        let Edata = JSON.parse(row.row.original.eData)
                        return (<div className="con-tooltipList left" title='' >


                            نامشخص

                            <div className='tooltipListReport'>
                                <p></p>
                                <p>{`DestinationCityName :${Edata.DestinationCityName} | DestinationStateName  : ${Edata.DestinationStateName} | GoodName  : ${Edata.GoodName} | CompanyName  : ${Edata.CompanyName}`}</p>
                                <p>{`SenderName :${Edata.SenderName} `}</p>
                                <p>{`ReceiverName :${Edata.ReceiverName} `}</p>
                                <p>{`ReqID :${Edata.ReqID} `}</p>
                                <p>{`SealedNo :${Edata.SealedNo} `}</p>
                                <p>{`ReceiverAddress :${Edata.ReceiverAddress} `}</p>
                                <p></p>

                            </div>

                        </div>)
                    }


                }
            }
        },
        {
            Header: 'تاریخ', accessor: 'createDate', Cell: (row: any) => {

                return (new Date(row.row.original.createDate).toLocaleDateString('fa-IR'))
            }
        },
        {
            Header: 'مقدار', accessor: 'quantity', Cell: (row: any) => {

                return (formatter.format(row.row.original.quantity))
            }
        },
        {
            Header: 'واحد', accessor: 'measureUnitId', Cell: (row: any) => {

                return (MeasureUnitSample.filter((q: any) => q.id === row.row.original.measureUnitId).map((x: any) => x.name)[0])
            }
        },
        {
            Header: 'وضعیت', accessor: 'voided', Cell: (row) => {

                return (

                    <div className='text-nowrap rounded btn-sm darktext
                'style={{ backgroundColor: `${VoidedTypeEnum.filter((i: any) => i.id === row.row.original.voided).map((i: any) => i.color)}` }}>
                        {VoidedTypeEnum.filter((i: any) => i.id === row.row.original.voided).map((i: any) => i.name)[0]}
                    </div>
                )

            }
        },
        { Header: 'شماره بارنامه', accessor: 'shippingNumber' },
        { Header: 'سریال بارنامه', accessor: 'shippingSerial' },
        { Header: 'نام راننده', accessor: 'delivererName' },
        { Header: 'شماره راننده', accessor: 'delivererNumber' },
        { Header: 'پلاک ', accessor: 'delivererPlaque' },
        {
            Header: 'کرایه ', accessor: 'shippingCost', Cell: (row: any) => {

                return (formatter.format(row.row.original.shippingCost))
            }
        },
        {
            Header: 'سامانه باربری ', accessor: 'shippingCompanySourceId', Cell: (row: any) => {

                return (row.row.original.shippingCompanySourceId ? ShippingCompanySource.filter((i: any) => i.id === row.row.original.shippingCompanySourceId).map((i: any) => i.name)[0] : 'همه')
            }
        },
        {
            Header: 'عملیات', accessor: '  ', Cell: (row) => {

                return (

                    <div>
                        <button hidden={row.row.original.voided === false || row.row.original.voided === null ? false : true} disabled={Loading} className="bg-transparent border-0 m-1" title="باطل کردن " onClick={() => ChangeVoided(row.row.original)}><TbNotesOff size={'1.5rem'} style={{ color: '#d9534f' }} /><ClipLoader

                            loading={Loading}
                            color="#ffff"
                            size={15}
                        /></button>

                        <button hidden={row.row.original.voided === true ? false : true} disabled={Loading} title='بازگشت از ابطال' className="btn-sm btn-warning p-2 m-1" onClick={() => ChangeToUnVoided(row.row.original)}>یازگشت ابطال<ClipLoader

                            loading={Loading}
                            color="#ffff"
                            size={15}
                        /></button>

                        <button className='btn btn-sm btn-primary' onClick={() => modalIsOpen(row.row.original)}>تخصیص حواله</button>


                    </div>)
            }
        }


    ], [shippingReports])
    const data = useMemo(() => shippingReports, [shippingReports]);
    const handelSearchFieldClear = () => {

        SetShippingIds([])
        SetShippingNumber('')
        SetShippingSerial('')
        getShippingReport()
        sessionStorage.clear()

    }
    if (shippingReports) {
        const dataForExcel = data.map((item: any) => ({
            "#": item.id,
            "شناسه حواله": item.shippingId,
            "تاریخ بارنامه": (new Date(item.createDate).toLocaleDateString('fa-IR')),
            "واحد": (MeasureUnitSample.filter((q) => q.id === item.measureUnitId).map((x) => x.name)[0]),
            "وزن": item.quantity,
            "شماره بارنامه": item.shippingNumber,
            "سریال بارنامه": item.shippingSerial,
            'هزینه باربری': item.shippingCost,
            "نام راننده": item.delivererName,
            "شماره راننده": item.delivererNumber,
            'پلاک': item.delivererPlaque,
            "سامانه باربری": (item.shippingCompanySourceId ? ShippingCompanySource.filter((i) => i.id === item.shippingCompanySourceId).map((i) => i.name)[0] : 'همه')

        }))
        return (
            <div>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 '>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   rounded">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>




                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> شناسه حواله</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شناسه حواله  " value={ShippingIds} onChange={e => SetShippingIds(Number(e.target.value))} />
                            </div>


                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

                                <label> شماره بارنامه </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شماره بارنامه " value={ShippingNumber} onChange={e => SetShippingNumber(e.target.value)} />
                            </div>









                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> سریال بارنامه</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="   سریال بارنامه " value={ShippingSerial} onChange={e => SetShippingSerial(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            >
                            <div className=" form-control-sm">
                                <label>  دارای حواله مرتبط </label>
                            <Select
                                    menuShouldScrollIntoView={false}
                                    value={hasShippingIds().filter((i: any) => i.value === HasShippingId).map((i: any) => i)}
                                    placeholder=' مبدا سفارش  '
                                    options={hasShippingIds()}


                                    onChange={(e: any) => {
                                     

                                        SetHasShippingId(e.value)
                                    }}
                                />
                            </div>
                            </div>

                        </form>
                        <div className="  filter-btn mt-2 ">
                            <div className=" row  ">
                                <div className="col-6 ">
                                    <button onClick={handelSearchFieldClear}
                                        className="  btn-sm btn-danger ">حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={GetDataBySearch}
                                        className="  btn-sm  btn-primary">جستجو
                                    </button>
                                </div>
                            </div></div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().EntityTypeId || getDefault().CreateEndtDate || getDefault().CreateStartDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">

                    <div>
                        <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                            total={totalCount}
                            setPageSize={setPageSize}
                            PageSize={PageSize}
                            getDataBySearch={GetDataByPage}
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                        />
                    </div>

                    <AddShippingIdModal modalIsOpen={IsOpen} closeModal={CloseModal} Item={Item} reload={GetDataByPage} />
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Shipping/GetShippingReports/${urlForExcel()}`} fileName='گزارش بار' />
                </div>
                </div>
            </div>


        )
    }
    else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   rounded">
                <AdvancedSearch>

<form className='form-row  form-group textOnInput'>




    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> شناسه حواله</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شناسه حواله  " value={ShippingIds} onChange={e => SetShippingIds(Number(e.target.value))} />
    </div>


    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

        <label> شماره بارنامه </label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شماره بارنامه " value={ShippingNumber} onChange={e => SetShippingNumber(e.target.value)} />
    </div>









    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> سریال بارنامه</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="   سریال بارنامه " value={ShippingSerial} onChange={e => SetShippingSerial(e.target.value)} />
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
    >
    <div className=" form-control-sm">
        <label>  دارای حواله مرتبط </label>
    <Select
            menuShouldScrollIntoView={false}
            value={hasShippingIds().filter((i: any) => i.value === HasShippingId).map((i: any) => i)}
            placeholder=' مبدا سفارش  '
            options={hasShippingIds()}


            onChange={(e: any) => {
             

                SetHasShippingId(e.value)
            }}
        />
    </div>
    </div>

</form>
<div className="  filter-btn mt-2 ">
    <div className=" row  ">
        <div className="col-6 ">
            <button onClick={handelSearchFieldClear}
                className="  btn-sm btn-danger ">حذف فیلتر
            </button>
        </div>
        <div className="col-6">
            <button onClick={GetDataBySearch}
                className="  btn-sm  btn-primary">جستجو
            </button>
        </div>
    </div></div>
<br />
</AdvancedSearch>

                </div>
                {getDefault().OrderId || getDefault().CreateEndtDate || getDefault().CreateStartDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        {/*<button className="btn btn-primary m-3" >تعریف باربری جدید</button>*/}


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>


                    </div>
                </div>


            </div>
        )
    }
}

export default ShippingReportList