import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import MyTable from "../../../../../Common/Shared/Form/MyTable";
import Modal from "react-modal";
import { ExportToExcel } from "../../../../../Common/Shared/Common/ExportToExcel";
import ModalGroupWork from "../../../../../Common/Shared/Common/ModalGroupWork";
import AdvancedSearch from '../../../../../Common/Shared/Common/AdvancedSearch';
import QueryString from "qs";
import { GetShippingCompanies, SetShippingCompany } from "../../../../../services/ShippingService";
import { GetGroupsForEntity } from "../../../../../services/GroupService";
import { ShippingCompanySource } from "../../../../../Common/Enums/ShippingCompanySourceId";
import { ExportToExcelProVersion } from "../../../../../Utils/ExportToExcelProVersion";




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
const ShoppingCompanyList:React.FC = () => {
    const [PageNumber, setPageNumber] = useState( getPage().PageNumber?getPage().PageNumber:0)
    const [PageSize, setPageSize] = useState(getPage().PageSize?getPage().PageSize:10)
    const [totalCount, setTotalCount] = useState(0);
    const [shippingCompany, setShippingCompanys] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0)
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [shippingCompanyG, setShippingCompanyG] = useState([])
    const [groupIds, SetGroupId] = useState()
    const [Name, setName] = useState(getDefault().Name)
    const [Code, setCode] = useState(getDefault().Code)
    const [isclearable, setIscreable] = useState(true)
    const [getData, setGeData] = useState(false)
    const param = { PageSize , PageNumber}

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items? items:''


    }

    const [open, SetOpen] = useState(false);
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData = [];
    const getSelectedData = (data:any) => {

        arrayOfSelectedData = data.map((item:any) => item.original);


        return (arrayOfSelectedData)

    }

    const GetshippingCompanyGroup = async () => {
        const { data, status } = await GetGroupsForEntity(2);
        if (status === 200) {


            setShippingCompanyG(data.result.groups);


        }

    }

    const getBulkJob = (selected:any) => {
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
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item:any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'shippingCompany': copyData[i]
                }

                const { data, status } = await SetShippingCompany(payload)
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
        const copyData = arrayOfData.map((item:any) => { return { ...item, active: true } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {


                let payload = {
                    'shippingCompany': copyData[i]
                }

                const { data, status } = await SetShippingCompany(payload)
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
        const copyData = arrayOfData.map((item:any) => { return { ...item, active: false } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'shippingCompany': copyData[i]
                }

                const { data, status } = await SetShippingCompany(payload)
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
    const getGroupForCompbo = () => {

        return (shippingCompanyG.map((item:any) => ({ label: item.name, value: item.id })))

    }
    const groups = getGroupForCompbo();
    const params = { Name, Code}
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items? items:''


    }
    const urlForExcel = () => {

        let parameter = {
            Name,
            Code,
            PageNumber:0,
            PageSize:1000000,

            


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }
    const getDataBySearch = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                Name,
                Code,
                PageNumber:0,
                PageSize,

                


            },
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShippingCompanies(config)
            if (status === 200) {
setPageNumber(0)
                setShippingCompanys(data.result.shippingCompanies.values)
                setTotalCount(data.result.shippingCompanies.totalCount)
                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getDataByPage = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                Name,
                Code,
                currentPage: 0,
                PageNumber,
                PageSize,


            },
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShippingCompanies(config)
            if (status === 200) {

                setShippingCompanys(data.result.shippingCompanies.values)
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
            setTotalCount(data.result.shippingCompanies.totalCount)


            }
        } catch (error) {
            console.log(error);
        }
    }
    const openModal = (id:any) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getShippingCompany = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                Name:null,
                Code:null,
                PageNumber:0,
                PageSize:10,




            },
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShippingCompanies(config)
            setGeData(false)
            setShippingCompanys(data.result.shippingCompanies.values)
            setTotalCount(data.result.shippingCompanies.totalCount)

        } catch (error) {
            console.log(error);
        }
    }
 

    const editHandler = (id:number) => {
        navigate(`/admin/editshippingCompany/${id}`)
    }
    const navigate = useNavigate()
    const formHandler = () => {
        navigate("/admin/newshippingcompany")
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام باربری', accessor: 'name',Cell:(rows:any)=>{


            return(`${rows.row.original.name} ${rows.row.original.shippingCompanySourceId?`( ${ShippingCompanySource.filter((i:any)=>i.id===rows.row.original.shippingCompanySourceId).map((i:any)=>i.name)[0]} )`:''}`)
        } }
        , { Header: 'شماره کد', accessor: 'code' }, {Header: 'فعال', accessor: 'activechanger  ',
       Cell: (row:any) => {
            const [active, setActive] = useState(row.row.original.active)
            

            const activeChang = {
                "shippingCompany":{
                    "id": row.row.original.id,
                    "code": row.row.original.code,
                    "name": row.row.original.name,
                    "createDate": row.row.original.createDate,
                    "active": !active,
                    "shippingCompanySourceId": row.row.original.shippingCompanySourceId,
                    "comment": row.row.original.comment
                }
                
              }

            const activeHandler = async () => {
                setActive(!active)

                try {
                    const { data, status } = await SetShippingCompany(activeChang)

                    // if (status === 200){
                    //
                    //     setActive(!active)
                    // }
                } catch (err) {
                    console.log(err)
                }


            }
            if (active === true) {
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="feather feather-check  " onClick={activeHandler} style={{ color: 'green' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>)
            } else {
                return (<svg xmlns="http://www.w3.org/2000/svg" data-dismiss="alert" width="21" height="21"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="feather feather-x  danger " onClick={activeHandler} style={{ color: 'red' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>)
            }




        }
    }
        , {
            Header: 'عملیات', accessor: '11', Cell: (row:any) => {

                return (
                    <ul className="table-controls">

                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="ویرایش"
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
                    </ul>
                )
            }
        }
    ],[])
    const data = useMemo(() => shippingCompany,[shippingCompany]);
    const handelSearchFieldClear = async () => {
setPageNumber(0)
        setName('')
        setCode('')
        setPageSize(10)
      sessionStorage.clear()
      getShippingCompany()

    }
    if (shippingCompany) {
        const dataForExcel = data.map((item:any) => ({
            'شناسه': item.id,
            'نام شرکت': item.name,
            'کد': item.code,
            'تاریخ ایجاد': new Date(item.createDate).toLocaleTimeString('fa-IR')
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

                                <label> نام شرکت</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام شرکت" value={Name} onChange={e => setName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد " value={Code} onChange={e => setCode(e.target.value)} />
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
                                <button onClick={getDataBySearch}
                                        className="  btn-sm  btn-primary">جستجو
                                </button>
                            </div>
                        </div></div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().Name || getDefault().Code ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{fontSize:"15px"}}>نمایش اطلاعات بر اساس فیلتر  </span>:null}

                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >
                        <div style={{width:'20rem'}}>
                            <div className="d-block clearfix mb-2"   onClick={closeModal}><svg
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


                            <p> آیا مطمئنید  کالا {shippingCompany.filter((item:any) => item.id === id).map((item:any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>




                            <button className="btn btn-danger float-left">حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف باربری جدید</button>
                        <MyTable columns={columns} data={data} getData={(rows:any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                            total={totalCount}
                            setPageSize={setPageSize}
                            PageSize={PageSize}
                            getDataBySearch={getDataByPage}
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                        />                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Shipping/GetShippingCompanies/${urlForExcel()}`} fileName='لیست باربری ها' />
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

                                <label> نام شرکت</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام شرکت" value={Name} onChange={(e:any) => setName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد " value={Code} onChange={(e:any) => setCode(e.target.value)} />
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
                                <button onClick={getDataBySearch}
                                        className="  btn-sm  btn-primary">جستجو
                                </button>
                            </div>
                        </div>    </div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().Name || getDefault().Code ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{fontSize:"15px"}}>نمایش اطلاعات بر اساس فیلتر  </span>:null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف باربری جدید</button>


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>


                    </div>
                </div>


            </div>
        )
    }

}
export default ShoppingCompanyList