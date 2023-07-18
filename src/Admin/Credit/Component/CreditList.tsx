import React, { useState } from 'react'
import MyTable from '../../../Common/Shared/Form/MyTable';
import { useMemo } from 'react';
import { GetCredits } from '../../../services/creditService';
import QueryString from 'qs';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PriceUnitEnums } from './../../../Common/Enums/PriceUnit';
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';

const CreditList: React.FC = () => {

    const [Credits, setCredits] = useState([])
    const [Name, SetName] = useState(getDefault().Name)
    const [getData, setGeData] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate()

    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { Name }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''

    }

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
        }
        if (selected === 4) {
            DeleteSelectedItem()
        }
        if (selected === 5) {
            disableSelectedItem()
        }
    }
    const editInfoHandler = (id: any) => {
        navigate(`/admin/editCredit/${id}`)
    }

    const DeleteSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {

            // try {
            //     const { data, status } = await DeleteSupply(arrayOfData[i].id)
            //     if (data.result.success === true) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }
            //     if (data.result.success === false) {
            //         SetOpen(true)

            //         SetStateError(errorCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {
            //     let payload = {
            //         'supply': copyData[i]
            //     }
            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const enableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: true }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {
            //     let payload = {
            //         'supply': copyData[i]
            //     }

            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const disableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: false }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {

            //     let payload = {
            //         'supply': copyData[i]
            //     }

            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const getDataByPage = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Name,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetCredits(config);
            if (status === 200) {
                setCredits(data.result.credits.values)
                setTotalCount(data.result.credits.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }

        } catch (err) {
            console.log(err)
        }



    }

    const urlForExcel = () => {

        let parameter = {
        
            Name,
            PageNumber,
            PageSize:1000000

        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Name,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetCredits(config);
            if (status === 200) {
                setCredits(data.result.credits.values)
                setTotalCount(data.result.credits.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }

        } catch (err) {
            console.log(err)
        }




    }
    const getAllCredit = async () => {
        if (getData) {
            sessionStorage.clear()

        }

        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Name,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetCredits(config);
            if (status === 200) {
                setGeData(false)
                setCredits(data.result.credits.values)
                setTotalCount(data.result.credits.totalCount)

            }
        } catch (err) {
            console.log(err)
        }

    }

   

    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });
    const formHandler = () => {
        navigate("/admin/newCredit")
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام گروه اعتباری', accessor: 'name' },
        {
            Header: 'ارزش', accessor: 'value', Cell: (rows: any) => {

                return (formatterForMoney.format(rows.row.original.value))
            }
        },
        { Header: 'واحد', accessor: 'priceUnitId',Cell:(row:any)=>{

return(PriceUnitEnums.filter((i:any)=>i.id===row.row.original.priceUnitId).map((i:any)=>i.name))

        } },
        { Header: 'توضیحات', accessor: 'comment' },
        {
            Header: 'مشاهده جزییات ', accessor: '', Cell: (row: any) => (<div>
                <Link className="border-0 bg-transparent non-hover edit-btn" to={`/admin/CreditDetails/${row.row.original.id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width='25' height='25' viewBox="0 0 256 256"><rect
                        width="256" height="256" stroke="none" fill="none" /><line x1="201.1" y1="127.3" x2="224" y2="166.8"
                            fill="none" stroke="currentColor" strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth="12" /><line
                            x1="154.2" y1="149.3" x2="161.3" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth="12" /><line x1="101.7" y1="149.2" x2="94.6" y2="189.6"
                                fill="none" stroke="currentColor" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="12" /><line
                            x1="54.8" y1="127.3" x2="31.9" y2="167" fill="none" stroke="currentColor" strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth="12" /><path
                            d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1" fill="none" stroke="currentColor"
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" /></svg>
                </Link>
            </div>
            )
        },
        {
            Header: 'عملیات', accessor: '  ', Cell: (row: any) => {
                return (
                    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="ویرایش"
                        onClick={(e: any) => editInfoHandler(row.row.original.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>)
            }
        }


    ], [Credits])


    const data = useMemo(() => Credits, [Credits])
    const handelSearchFieldClear = () => {
        
        SetName('')
        getAllCredit()
    }

    if (Credits) {
        return (
            <div className="rounded">

                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12  '>
                    </div>
                </div>

                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                    <div >
                        <section className="mb-2 mt-2">
                            <div className=" mb-5  pt-3 form textOnInput" >

                                <div className="col-lg-3 ml-1 col-md-4  col-sm-12  mb-1 ">
                                    <label>نام گروه اعتبار</label>

                                    <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام گروه"
                                        value={Name} onChange={(e: any) => SetName(e.target.value)} />
                                </div>

                                <div className="  filter-btn pb-2">
                                    <div className=" row  ">
                                        <div className="col-6 ">
                                            <button onClick={handelSearchFieldClear}
                                                className="  btn-sm btn-danger ">حذف فیلتر
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button onClick={getDataBySearch}
                                                className="  btn-sm  btn-primary">جستجو
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>

                <div className=" statbox widget-content widget-content-area">
                    <button className="btn btn-primary m-3" onClick={formHandler}>تعریف گروه اعتباری</button>

                    <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                        total={totalCount}
                        setPageSize={setPageSize}
                        PageSize={PageSize}
                        getDataBySearch={getDataByPage}
                        setPageNumber={setPageNumber}
                        PageNumber={PageNumber}
                    />


                </div>
                <div className="d-flex justify-content-end">
                <ExportToExcelProVersion url={`Credit/GetCredits/${urlForExcel()}`} fileName='لیست گروه اعتباری' />
                </div>
            </div>
        )

    }

    else {

        return (<div className="rounded">

            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12  '>
                </div>
            </div>

            <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                <div >
                    <section className="mb-2 mt-2">
                        <div className=" mb-5  pt-3 form textOnInput" >

                            <div className="col-lg-3 ml-1 col-md-4  col-sm-12  mb-1 ">
                                <label>نام گروه اعتبار</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام گروه"
                                    value={Name} onChange={(e: any) => SetName(e.target.value)} />
                            </div>

                            <div className="  filter-btn pb-2">
                                <div className=" row  ">
                                    <div className="col-6 ">
                                        <button onClick={handelSearchFieldClear}
                                            className="  btn-sm btn-danger ">حذف فیلتر
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button onClick={getDataBySearch}
                                            className="  btn-sm  btn-primary">جستجو
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
            <div className=" statbox widget-content widget-content-area">
                <div>
                    <button className="btn btn-primary m-3" onClick={formHandler}>تعریف گروه اعتباری</button>

                    <div className='text-center mt-5'>
                        <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                    </div>
                </div>
            </div>

        </div>
        )
    }
}

export default CreditList

