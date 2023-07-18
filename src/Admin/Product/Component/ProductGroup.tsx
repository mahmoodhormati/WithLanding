import React, { useState,useEffect} from 'react'
import { GetAttribute } from '../../../services/attributeService';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import MyTable from '../../../Common/Shared/Form/MyTable';
import {DeleteGroup, GetGroupsForEntity, GetGroupWithCompany, SetGroup} from '../../../services/GroupService';
import  Modal  from 'react-modal';
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import {DeleteHouses, SetWareHouses} from "../../../services/wareHouseService";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import QueryString from "qs";
import MyTableBazargah from "../../../Common/Shared/Form/MyTableBazargah";
import { GetCompanyChild } from '../../../services/companiesService';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import  Select  from 'react-select';
import {toast} from "react-toastify";


const ProductGroup:React.FC = () => {
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
            border: '2px ridge black'
        }
    };
const navigate=useNavigate();
    const [PageNumber, setPageNumber] = useState( getPage().PageNumber?getPage().PageNumber:0)
    const [PageSize, setPageSize] = useState(getPage().PageSize?getPage().PageSize:10)
    const [totalCount , setTotalCount]=useState(0) ;
    const [productG, setProductG] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id , setId]= useState(0)
    const[selectedRows,setSelectedRows]=useState([])
    const [stateSuccess , SetStateSuccess ] = useState(0)
    const [stateError , SetStateError ] = useState(0)
    const[open,SetOpen]=useState(false);
    const [userCompanies, setUserCompanies] = useState<any>([])
    let [companyId, SetcompanyId] = useState()

    const param = { PageSize , PageNumber}

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items? items:''


    }
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

    const GetCurrentUserCompany = async () => {

        try {
            const { data, status } = await GetCompanyChild()
            if (status === 200) {
                setUserCompanies(data.result.companies)
                SetcompanyId(data.result.companies[0].id)
            }
        } catch (error) {
            console.log();
        }
    }
    const getDataBySearch = async () => {

        const { data, status } = await GetGroupsForEntity(2,config);
        setProductG(data.result.groups)
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


    }
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData=[];
    const getSelectedData=(data:any)=>{

        arrayOfSelectedData= data.map((item:any)=>item.original);


        return(arrayOfSelectedData)

    }
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
                const{data,status}=await DeleteGroup(arrayOfData[i].id)
                if(data.result.success ===true){
                    SetOpen(true)

                    SetStateSuccess ( successCount+=1)
                } if(data.result.success ===false){
                    SetOpen(true)

                    SetStateError (errorCount+=1)
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
                    'group':copyData[i]
                }
                const{data,status}=await SetGroup(payload)
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
                    'group':copyData[i]
                }

                const{data,status}=await SetGroup(payload)
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
                    'group':copyData[i]
                }
                const{data,status}=await SetGroup(payload)
                SetOpen(true)
                if(status===200){

                    SetStateSuccess( successCount+=1)

                }

                
            } catch (error) {
                SetOpen(true)

                SetStateError (errorCount+=1)

            }finally {

            }


        }


    }
    const openModal =  (id:number) => {
        setIsOpen(true);
setId(id)
       
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const GetProductGroup = async (companyId:any) => {
        if (userCompanies.length === 1) {
            try {

                const { data, status } = await GetGroupWithCompany(2, userCompanies[0].id);
                setProductG(data.result.groups)

            } catch (error) {

            }

        }
        else {
            if(companyId!==undefined && companyId>0){
            try {
                const { data, status } = await GetGroupWithCompany(2, companyId);
                setProductG(data.result.groups)

            } catch (error) {

            }

        }
    }

    }
useEffect(()=>{
    GetCurrentUserCompany();
},[])


useEffect(()=>{
    GetProductGroup(companyId);
},[companyId])
const editHandler = (id:number) => {
    navigate(`/admin/editproductgroup/${id}`)
}
const deletHandler =async () => {
    try {
        const {data , status}= await DeleteGroup(id)
        if (status===200)
        {
            toast.success("گروه کالا  با موفقیت حذف شد", {
                position: "top-right",
                closeOnClick: true
            });
           setIsOpen(false)
           GetProductGroup(companyId);
        }
    }catch (err){
        console.log(err)
    }
}
const columns=useMemo(()=>[
    { Header: '#', accessor: 'id' },
    { Header: 'نام', accessor: 'name' },
   { Header: 'عملیات', accessor: '11', Cell: (row:any) =>
    {

        return(
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


            <button  onClick={()=>openModal(row.row.original.id)  } className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="حذف">
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
    )}}
],[])
const companys = () => {
    
    return (userCompanies.map((item:any) => ({ label: item.name, value: item.id })))

}
let defaultValue = companys()[0]
const data=useMemo(()=>productG,[productG]);

const handelForm=()=>{
navigate('/admin/newproductgroup')
}
    if (productG && productG.length >0) {
        const dataForExcel = data.map((item:any) => ({
            'شناسه': item.id,
            'نام گروه': item.name,

        }))
        return (
            <div className=''>
                <div className=''>
                    <div className='statbox widget-content widget-content-area mb-2'>
                    {userCompanies.length > 1 ?
                            
                                <form className='form-row textOnInput'>

                                    <div className="col-lg-4 col-md-4 col-sm-4 m-4  selectIndex">
                                        <label> شرکت</label>
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            defaultValue={defaultValue}
                                            placeholder='نام شرکت'
                                            options={companys()}
                                            key={defaultValue}
                                            isClearable={true}
                                            onChange={e => {


                                                SetcompanyId(e.value)


                                            }

                                            }

                                        />
                                    </div>


                                </form>

                           : ''}


                    </div>
                </div>

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


                            <p> آیا مطمئنید  گروه {productG.filter((item:any) => item.id === id).map((item:any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>




                            <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>

                        <button className="btn btn-primary m-3" onClick={handelForm}> تعریف گروه جدید</button>
                        <MyTableBazargah columns={columns} data={data} getData={(rows:any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />


                        <div className="d-flex justify-content-end">
                            <ExportToExcel apiData={dataForExcel} fileName='لیست گروه کالا' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    else {
        return (
            <div className=''>
                <div className=''>
                    <div className='statbox widget-content widget-content-area mb-2'>

                    {userCompanies.length > 1 ?
                         
                                <form className='form-row textOnInput'>

                                    <div className="col-lg-4 col-md-4 col-sm-4  m-4 selectIndex">
                                        <label> شرکت</label>
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            defaultValue={defaultValue}
                                            placeholder='نام شرکت'
                                            options={companys()}
                                            key={defaultValue}
                                            isClearable={true}
                                            onChange={e => {


                                                SetcompanyId(e.value)


                                            }

                                            }

                                        />
                                    </div>


                                </form>

                             : ''}

                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area">
                    <div>

                        <button className="btn btn-primary m-3" onClick={handelForm}> تعریف گروه جدید</button>

                        <div className='text-center mt-5 '>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
}

export default ProductGroup