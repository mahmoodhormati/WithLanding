import React, { useState, useEffect, useMemo } from 'react'
import { DeleteOrganization, GetAllOrganisationCode, SetOrganisation } from '../../../services/organisationService';
import { useNavigate } from 'react-router-dom';
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import MyTable from '../../../Common/Shared/Form/MyTable';
import { DeleteProduct } from "../../../services/productService";

import Modal from "react-modal";
import { toast } from "react-toastify";
import { DeleteNews, SetNews } from "../../../services/newsService";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import QueryString from "qs";
import { GetDataWithSearch } from "../../../services/userService";
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';
import { TbReportMoney } from 'react-icons/tb';
import { GetFinancialCardex } from '../../../services/reportService';
const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5%',
        border: '2px ridge black',
        maxHeight:'80vh'

    }
};
const OrganizationList: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)

    const [totalCount, setTotalCount] = useState(0);
    const [organization, setOrganization] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0)
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [open, SetOpen] = useState(false);
    const [Name, setName] = useState(getDefault().Name)
    const [NationalId, setNationalId] = useState(getDefault().NationalId)
    const [RegistrationNumber, setRegistrationNumber] = useState(getDefault().RegistrationNumber)
    const [getData, setGeData] = useState(false)

    const params = { Name, NationalId, RegistrationNumber }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''


    }
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }



    let config = {

        headers: { 'Content-Type': 'application/json' },
        params: {
            Name: params.Name,
            NationalId: params.NationalId,
            RegistrationNumber: params.RegistrationNumber,

            PageNumber,
            PageSize


        }
        ,
        paramsSerializer: (params: any) => {

            return QueryString.stringify(params)
        }

    };

    const getDataBySearch = async () => {

        const { data, status } = await GetAllOrganisationCode(config);

        setOrganization(data.result.organizationLists.values);
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
        setTotalCount(data.result.organizationLists.totalCount)


    }
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData = [];

    const getWithSearchParams = async (e: any) => {
        e.preventDefault();
        try {
            let parameter = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    Name: params.Name,
                    NationalId: params.NationalId,
                    RegistrationNumber: params.RegistrationNumber,
                    PageSize,
                    PageNumber: 0,




                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };

            const { data, status } = await GetAllOrganisationCode(parameter);
            setOrganization(data.result.organizationLists.values);
            setTotalCount(data.result.organizationLists.totalCount)
            sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
            sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));



        } catch (error) {
            console.log(error);
        }


    }
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
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {

            try {
                const { data, status } = await DeleteOrganization(arrayOfData[i].id)
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)

            }


        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'organization': copyData[i]
                }
                const { data, status } = await SetOrganisation(payload)
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const enableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, active: true } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'organization': copyData[i]
                }
                const { data, status } = await SetOrganisation(payload)
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const disableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, active: false } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'organization': copyData[i]
                }
                const { data, status } = await SetOrganisation(payload)
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const getOrganizationName = async () => {
      
        try {
            let parameter = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    Name: null,
                    NationalId:null ,
                    RegistrationNumber: null,
                    PageSize:10,
                    PageNumber:0
                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };

            const { data, status } = await GetAllOrganisationCode(parameter);
            setGeData(false)
            setOrganization(data.result.organizationLists.values);
            setTotalCount(data.result.organizationLists.totalCount)


        } catch (error) {
            console.log(error);
        }
    }


    const openModal = (id: any) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const handelSearchFieldClear = async () => {
        setGeData(true)
        setName("")
        setPageNumber(0)
        setPageSize(10)
        setRegistrationNumber("")
        setNationalId("")
        sessionStorage.clear();


getOrganizationName()
    }

    const urlForExcel = () => {

        let parameter = {
            Name: params.Name,
            NationalId: params.NationalId,
            RegistrationNumber: params.RegistrationNumber,
            PageSize:1000000,
            PageNumber: 0,


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }
 
    useEffect(() => {

        // getOrganizationName();

    }, [getData])
    const addNewOrganizationHandler = () => {
        navigate('/admin/addorganization')
    }
    const navigate = useNavigate()

    const editHandler = (id: number) => {
        navigate(`/admin/editorganization/${id}`)
    }
    const deletHandler = async () => {
        try {
            const { data, status } = await DeleteOrganization(id)
            if (status === 200) {
                toast.success("سازمان با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)
                getOrganizationName()
            }
            if (status === 500) {

                toast.error("این سازمان به یک یا چند کاربر اختصاص داده شده است", {
                    position: "top-right",
                    closeOnClick: true
                });
            }
        } catch (err) {
            console.log(err)
        }
        setIsOpen(false)

    }

    const OrganizationKardex=async(id:any)=>{
        
        let config = {
    
            headers: { 'Content-Type': 'application/json' },
            params: {
                OrganizationId:id
    
            }
            ,
            paramsSerializer: (params: any) => {
    
                return QueryString.stringify(params)
            }
    
        };
    
            try {
                const{data,status}=await GetFinancialCardex(config)
                if(status===200 && data.result.cardices.length>0){
    
                    navigate(`/admin/kartex/${id}`,{state:{'Organization':data.result.cardices}})
    
    
    
                }
                else if(status===200 && data.result.cardices.length===0){
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

    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام سازمان', accessor: 'name' }
        , { Header: 'شناسه ملی', accessor: 'nationalId' }, {
            Header: 'شماره ثبت', accessor: 'registrationNumber'
        },{
            Header: ' کارتکس سازمان', accessor: '', Cell: (row:any) => (
                <div className="table-controls ">
                    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title=' کارتکس سازمان'
                        onClick={e => OrganizationKardex(row.row.original.id)}>
                        <TbReportMoney size="1.5rem" />
                    </button>
                </div>
            )
            }
        , {
            Header: 'عملیات', accessor: '', Cell: (row: any) => (
                <ul className="table-controls">
                    {/*<NavLink className='btn btn-primary btn-rounded ' to={`/userrole/${row.row.original.id}`}> تعیین نقش </NavLink>*/}

                    <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="ویرایش"
                        onClick={e => editHandler(row.row.original.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>

                    <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="حذف"
                        onClick={() => openModal(row.row.original.id)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-trash-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>

                        </svg>
                    </button>


                </ul>
            )
        }
    ], [])
    const data = useMemo(() => organization, [organization]);

  

    if (organization) {
        const dataForExcel = data.map((item: any) => ({
            'شناسه': item.id,
            'نام سازمان': item.name,
            'شناسه ملی شرکت': item.nationalId,
            'شمار ثبت ': item.registrationNumber,
        }));
        return (
            <div className=''>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 '>

                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>



                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">

                                <label> نام سازمان</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان" value={Name} onChange={(e: any) => setName(e.target.value)} />
                            </div>

                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">
                                <label> شناسه ملی </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی " value={NationalId} onChange={(e: any) => setNationalId(e.target.value)} />
                            </div>

                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">
                                <label> شماره ثبت  </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره ثبت" value={RegistrationNumber} onChange={(e: any) => setRegistrationNumber(e.target.value)} />
                            </div>



                        </form>
                        <div className="  filter-btn ">
                            <div className=" row  ">
                                <div className="col-6 ">
                                    <button onClick={async() => {
                                       await handelSearchFieldClear()
                                    
                                    }}
                                        className="  btn-sm btn-danger ">حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={getWithSearchParams}
                                        className="  btn-sm  btn-primary">جستجو
                                    </button>
                                </div>
                            </div></div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().Name || getDefault().RegistrationNumber || getDefault().NationalId ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div className="table-responsive">
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Selected Option"
                            ariaHideApp={false}

                        >
                            <div style={{ width: "20rem" }}>
                                <div className="d-block clearfix mb-2" onClick={closeModal}><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24" height="24"
                                    viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-x close"
                                    data-dismiss="alert"><line x1="18" y1="6"
                                        x2="6"
                                        y2="18"></line><line
                                            x1="6" y1="6" x2="18" y2="18"></line></svg></div>


                                <p> آیا مطمئنید  سازمان {organization.filter((item: any) => item.id === id).map((item: any) => item.name)}   </p>
                                <p>حذف شود ؟ </p>




                                <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                                </button>

                                {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                            </div>
                        </Modal>
                        <button onClick={addNewOrganizationHandler} className="btn btn-primary m-3">تعریف سازمان جدید</button>


                        <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                            total={totalCount}
                            setPageSize={setPageSize}
                            PageSize={PageSize}
                            getDataBySearch={getDataBySearch}
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                        />
                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                    <div className="d-flex justify-content-end">
                        <ExportToExcelProVersion url={`Organization/GetOrganizations/${urlForExcel()}`} fileName='لیست سازمان ها' />
                    </div>
                </div>
            </div>

        )
    }

    else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>



                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">

                                <label> نام سازمان</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان" value={Name} onChange={e => setName(e.target.value)} />
                            </div>

                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">
                                <label> شناسه ملی </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی " value={NationalId} onChange={e => setNationalId(e.target.value)} />
                            </div>

                            <div className="col-lg-4 col-md-6  col-sm-12  mb-1">
                                <label> شماره ثبت  </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره ثبت" value={RegistrationNumber} onChange={e => setRegistrationNumber(e.target.value)} />
                            </div>



                        </form>
                        <div className="  filter-btn ">
                            <div className=" row  ">
                                <div className="col-6 ">
                                    <button onClick={handelSearchFieldClear}
                                        className="  btn-sm btn-danger ">حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={getWithSearchParams}
                                        className="  btn-sm  btn-primary">جستجو
                                    </button>
                                </div></div>
                        </div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().Name || getDefault().RegistrationNumber || getDefault().NationalId ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button onClick={addNewOrganizationHandler} className="btn btn-primary m-3">تعریف سازمان جدید</button>


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>
                    </div>
                </div>


            </div>
        )
    }






}

export default OrganizationList