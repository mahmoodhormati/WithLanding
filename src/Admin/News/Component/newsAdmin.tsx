import {DeleteNews, GetAllNewsForAdmin, GetAllNewsForAdminPage, SetNews} from "../../../services/newsService";
import { useEffect, useState } from "react";
import React, { useMemo } from "react";
import {GetForKarbars, GetUsersRoles, SetUserRole} from "../../../services/userService";
import Select from "react-select";
import { setCustomerInfo } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import MyTable from "../../../Common/Shared/Form/MyTable";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import {toast} from "react-toastify";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import QueryString from "qs";
import { RootState } from "../../../store";
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
const NewsAdmin:React.FC = () => {
    const [PageNumber, setPageNumber] = useState( getPage().PageNumber?getPage().PageNumber:0)
    const [PageSize, setPageSize] = useState(getPage().PageSize?getPage().PageSize:10)
    const [totalCount , setTotalCount]=useState(0) ;
    const navigate = useNavigate()
    const user = useSelector((state:RootState) => state.user);
    const [modalIsOpen, setIsOpen] = useState(false);
const[id,setId]=useState(0)
    const [news, setNews] = useState([])
    const[selectedRows,setSelectedRows]=useState([])
    const [stateSuccess , SetStateSuccess ] = useState(0)
    const [stateError , SetStateError ] = useState(0)
    const[open,SetOpen]=useState(false);
    const param = { PageSize , PageNumber}



   

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items? items:''


    }
    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                PageNumber,
                PageSize


            }
            ,
            paramsSerializer:(params:any)=>{

                return QueryString.stringify(params)
            }

        };
        try {
            const { data, status } = await GetAllNewsForAdminPage(config);
            setNews(data.result.news.values)
            setTotalCount(data.result.news.totalCount)
            sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

        }catch (e) {
            console.log(e)
        }


    }
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData=[];


    const getBulkJob=(selected:any)=>{
        if(selected===2){
            enableSelectedItem()
        }
        if(selected===3){
            copySelectedItem()
        }if(selected===4){
            DeleteSelectedItem()
        }
        if(selected===5){
            disableSelectedItem()
        }
    }

    const DeleteSelectedItem=async()=>{
        const arrayOfData=getSelectedData(selectedRows);
        let successCount=0;
        let errorCount=0;
        for (let i = 0; i < arrayOfData.length; i++) {

            try {
                const{data,status}=await DeleteNews(arrayOfData[i].id)
                if(status===200){
                    SetOpen(true)

                    SetStateSuccess ( successCount+=1)
                }



            } catch (error) {
                 SetOpen(true)

                SetStateError (errorCount+=1)

            }


        }
     
    }
    const copySelectedItem=async()=>{
        const arrayOfData=getSelectedData(selectedRows);
        const copyData= arrayOfData.map((item:any)=>{return{...item,id:0,active:true,createDate:new Date()}})

        let successCount=0;
        let errorCount=0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload={
                    'news':copyData[i]
                }
                const{data,status}=await SetNews(payload)
                if(status===200){
                    SetOpen(true)

                    SetStateSuccess ( successCount+=1)
                }


            } catch (error) {
                 SetOpen(true)

                SetStateError (errorCount+=1)
            }


        }

      
    }
    const enableSelectedItem=async()=>{
        const arrayOfData=getSelectedData(selectedRows);
        const copyData= arrayOfData.map((item:any)=>{return{...item,active:true}})

        let successCount=0;
        let errorCount=0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload={
                    'news':copyData[i]
                }
                const{data,status}=await SetNews(payload)
                if(status===200){
                    SetOpen(true)

                    SetStateSuccess ( successCount+=1)
                }


            } catch (error) {
                 SetOpen(true)

                SetStateError (errorCount+=1)
            }


        }

        
    }
    const disableSelectedItem=async()=>{
        const arrayOfData=getSelectedData(selectedRows);
        const copyData= arrayOfData.map((item:any)=>{return{...item,active:false}})

        let successCount=0;
        let errorCount=0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload={
                    'news':copyData[i]
                }
                const{data,status}=await SetNews(payload)
                if(status===200){
                    SetOpen(true)

                    SetStateSuccess ( successCount+=1)
                }


            } catch (error) {
                 SetOpen(true)

                SetStateError (errorCount+=1)
            }


        }

       
    }
    const getSelectedData=(data:any)=>{

        arrayOfSelectedData= data.map((item:any)=>item.original);


        return(arrayOfSelectedData)

    }

    const openModal = (id:number) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getNewsAdmin = async () => {
        try {
            const { data, status } = await GetAllNewsForAdmin()
            setNews(data.result.news.values)
            setTotalCount(data.result.news.totalCount)
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        getNewsAdmin()
    }, [])

    const deleteHandler = async () => {

        try {

            const { data, status } = await DeleteNews(id)
            if (status === 200)
            {
                toast.success("اعلان با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)
                getNewsAdmin()
            }if (status === 500)
            {

                toast.error("این اعلان به یک یا چند کاربر اختصاص داده شده است", {
                    position: "top-right",
                    closeOnClick: true
                });
            }

        } catch (err) {
            console.log(err)
        }
        setIsOpen(false)

    }
    const editHandler = (id:any) => {
        navigate(`/admin/editNews/${id}`)
    }
    
    const formHandler = () => {
        navigate("/admin/newNews")
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'عنوان', accessor: 'title' }
        , {
            Header: 'متن پیام', accessor: 'message'
        },{ Header: 'نام شرکت', accessor: 'companyName' }
        , {
            Header: 'وضعیت', accessor: '', Cell: (row:any) => {
                const [active, setActive] = useState(row.row.original.active)
                const id = row.row.original.id
                const activeChang = {
                    news: {
                        id,
                        active: !active,
                        creatorId: user.id,
                        title: row.row.original.title,
                        message: row.row.original.message,
                        companyId:row.row.original.companyId,
                        companyName:row.row.original.companyName
                    }

                }

                const activeHandler = async () => {
                    setActive(!active)
                    try {
                        const { data, status } = await SetNews(activeChang)
                        if (status === 200) {
                            toast.success("تغییرات با موفقیت ثبت شد", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined
                            });
            
                        }
                     
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
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x  danger " onClick={activeHandler} style={{ color: 'red' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>)
                }


            }
        }, {
            Header: 'عملیات', accessor: '11', Cell: row => {



             
                return (
                    <ul className="table-controls">

                        {/*<NavLink className='btn btn-primary btn-rounded ' to={`/userrole/${row.row.original.id}`}> تعیین نقش </NavLink>*/}

                        <button className="border-0  non-hover bg-transparent edit-btn" data-toggle="tooltip"
                            data-placement="top"
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


                        <button className="border-0  non-hover  bg-transparent edit-btn"
                            data-toggle="tooltip" data-placement="top" title="حذف"
                            onClick={()=>openModal(row.row.original.id)}
                        >
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


                    </ul>)
            }
        }
    ],[])
    const data = useMemo(() => news,[news]);
    if(news){
        return (
            <div className=''>
               
                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >
                        <>



                            <p> آیا مطمئنید اعلان شماره {news.filter((item:any)=>item.id===id).map((item:any)=>item.id)}    </p>
                            <p>حذف شود ؟ </p>


                            <button className="btn btn-danger  float-left" onClick={deleteHandler}>حذف
                            </button>

                            <button className="btn btn-success float-right" onClick={closeModal}>خیر</button>
                        </>
                    </Modal>
                    <div className="table-responsive">
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف اعلان جدید</button>

                        <MyTable   columns={columns} data={data} getData={(rows:any)=>setSelectedRows(rows)} bulkJob={getBulkJob}
                                   total={totalCount}
                                   setPageSize={setPageSize}
                                   PageSize={PageSize}
                                   getDataBySearch={getDataBySearch}
                                   setPageNumber={setPageNumber}
                                   PageNumber={PageNumber}
                        />
                                         <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                </div>
            </div>)
    }
    else{
        return(
            <div className=''>
               
                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف اعلان جدید</button>


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>
                    </div>
                </div>


            </div>
        )
    }

}
export default NewsAdmin