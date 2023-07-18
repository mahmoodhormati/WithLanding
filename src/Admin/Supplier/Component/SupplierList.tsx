
import React,{ useMemo, useState, useEffect } from 'react';
import {
    DeleteSupplier,
    DeleteSupply,
    GetAllSuppliers,
    GetDataWithSearchSupply,
    SetSupplier,
    SetSupply
} from '../../../services/supplyService';
import MyTable from '../../../Common/Shared/Form/MyTable';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import {toast} from "react-toastify";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import QueryString from "qs";
import { GetCompanyChild } from '../../../services/companiesService';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';

const SupplierList:React.FC = () => {
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
    const [PageNumber, setPageNumber] = useState( getPage().PageNumber?getPage().PageNumber:0)
    const [PageSize, setPageSize] = useState(getPage().PageSize?getPage().PageSize:10)
    const [totalCount , setTotalCount]=useState(0) ;
    const navigate = useNavigate()
    const [suppliers, setSuppliers] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0)
    const[selectedRows,setSelectedRows]=useState([])
    const [stateSuccess , SetStateSuccess ] = useState(0)
    const [stateError , SetStateError ] = useState(0)
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(getPage().companyId ? getPage().companyId : null)
    const[open,SetOpen]=useState(false);
    const param = { PageSize , PageNumber}

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items? items:''


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
    const getCompanies = async () => {
        try {
            const { data, status } = await GetCompanyChild()
            setCompanies(data.result.companies)
      


        } catch (error) {

        }

    }
    const DeleteSelectedItem=async()=>{
        const arrayOfData=getSelectedData(selectedRows);
        let successCount=0;
        let errorCount=0;
        for (let i = 0; i < arrayOfData.length; i++) {

            try {
                const{data,status}=await DeleteSupplier(arrayOfData[i].id)
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
                    'supplier':copyData[i]
                }
                const{data,status}=await SetSupplier(payload)
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
                    'supplier':copyData[i]
                }

                const{data,status}=await SetSupplier(payload)
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
                    'supplier':copyData[i]
                }

                const{data,status}=await SetSupplier(payload)
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


    const deletHandler = async () => {
        try {
            const { data, status } = await DeleteSupplier(id)
            if (data.success === true)
            {
                toast.success("تامین کننده با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)
                getSuppliers()
            }
        } catch (err) {
            setIsOpen(false)

            console.log(err)
        }
    }

    const formHandler = () => {
        navigate("/admin/newsupplier")
    }


    const openModal = (id:number) => {
        setIsOpen(true);
        setId(id)
       
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getSuppliers = async () => {
        try {
            const { data, status } = await GetAllSuppliers();
            if (status === 200) {
                setSuppliers(data.result.suppliers.values)
                setTotalCount(data.result.suppliers.totalCount)
            }

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {

        getSuppliers();
        getCompanies()
    }, [])


    
 const urlForExcel = () => {

    let parameter = {
        PageNumber,
        PageSize:1000000
        ,companyId

    }



    let url = QueryString.stringify(parameter)


    return (`?${url}`)



}
    const getDataBySearch = async () => {
        let config = {

            headers: {'Content-Type': 'application/json'},
            params: {

                PageNumber,
                PageSize
                ,companyId


            }
            ,
            paramsSerializer:(params:any)=>{

                return QueryString.stringify(params)
            }

        };

        try {
            const {data, status} = await GetAllSuppliers(config);
            if (status === 200) {
                setSuppliers(data.result.suppliers.values)            }
            sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

        } catch (err) {
            console.log(err)
        }

    }
    const editHandler = (id:number) => {
        navigate(`/admin/editsupplier/${id}`)
    }
    const columns = useMemo(() => [

        { Header: '#', accessor: 'id' },
        { Header: 'نام تامین کننده', accessor: 'name' },{Header:'نام شرکت',accessor:'companyName'},
        {
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


                        <button onClick={() => openModal(row.row.original.id)} className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="حذف">
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
        }
    ],[])
    const CompaniesIDs = () => {
        return (companies.map((data:any) => ({ label: data.name, value: data.id })))
    }

    const data = useMemo(() => suppliers,[suppliers])
    if(suppliers){
        const dataForExcel = data.map((item:any) => ({
            'شناسه': item.id,
            'نام تامین کننده': item.name
        }))

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

                            <p> آیا مطمئنید  تامین {suppliers.filter((item:any) => item.id === id).map((item:any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>




                            <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler} >تعریف تامین کننده جدید </button>
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
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Supply/GetSuppliers/${urlForExcel()}`} fileName='لیست تامین کنندگان' />
                    </div>
                </div>
            </div>
        )}
    else{
        return(
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler} >تعریف تامین کننده جدید </button>




                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>


                    </div>
                </div>


            </div>
        )
    }

}

export default SupplierList