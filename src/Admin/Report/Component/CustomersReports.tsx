import React, { useState, useMemo } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_en from "react-date-object/locales/persian_en";
import { NavLink } from 'react-router-dom';


import FadeLoader from 'react-spinners/FadeLoader'
import MyTableBazargah  from "../../../Common/Shared/Form/MyTableBazargah";
import {GetCustomersReports } from "../../../services/reportService";
import {ExportToExcel} from "../../../Common/Shared/Common/ExportToExcel";
import persian_fa from "react-date-object/locales/persian_fa";


const CustomerReports:React.FC = () => {
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState([]);
    const [clicked, SetClicked] = useState(false)
    const[selectedRows,setSelectedRows]=useState([])

    const[show,SetShow]=useState(false);
    const[disable,setDisable]=useState(false);

    const[open,SetOpen]=useState(false);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#0c4088");
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData=[];
    const getSelectedData=(data:any)=>{

        arrayOfSelectedData= data.map((item:any)=>item.original);


        return(arrayOfSelectedData)

    }
    const getBulkJob=(selected:any)=>{

    }



    const handelStartDate = (value:any) => {
        if (value === null) {
            setStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setStartDate(new Date(value.toDate().setHours(3,30,0,0)).toJSON())
        }
    }
    const handelEndDate = (value:any) => {
        if (value === null) {
            setEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setEndDate(new Date(value.toDate().setHours(3,30,0,0)).toJSON())
        }
    }
    const handelSubmit = async (event:any) => {
        setLoading(true)
        event.preventDefault();
        try {
            const { data, status } = await GetCustomersReports(StartDate, EndDate);
            if (status === 200) {

                SetResponse(data.result.customerReports);
                SetClicked(true);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }

    }
    const handelFrom=()=>{
        SetClicked(false)
    }

    const columns = useMemo(() => [
        { Header: 'ردیف', accessor: 'id' },
        {Header:'نام کاربری',accessor:'userName',Cell:(row:any) => row.row.original.userName? row.row.original.userName :"--"},
        { Header: 'نام مشتری ', accessor: 'name' ,Cell:row => row.row.original.name ? row.row.original.name :"--"},
        { Header: 'کد ملی مشتری', accessor: 'nationalCode',Cell:row => row.row.original.nationalCode? row.row.original.nationalCode :"--" },
        { Header: 'کد سازمان', accessor: 'organizationId',Cell:row => row.row.original.organizationId? row.row.original.organizationId :"--"},
        { Header: ' نام سازمان', accessor: 'organization',Cell:row => row.row.original.organization? row.row.original.organization :"--"},
        { Header: 'شناسه ملی سازمان', accessor: 'organizationNationaId',Cell:row => row.row.original.organizationNationaId? row.row.original.organizationNationaId :"--" },
        { Header: 'شماره ثبت سازمان', accessor: 'organizationRegistrationNumber' ,Cell:row => row.row.original.organizationRegistrationNumber? row.row.original.organizationRegistrationNumber :"--"},
       ],[]);
    const data = useMemo(() => Response,[Response]);;

    if (!clicked) {
        if(!loading){
            return (
                <div className='user-progress' >
                    <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                            <h5 >درخواست اطلاعات </h5>
                            <p>در این بخش می توانید گزارش مشتریان دریافت کنید.</p>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center '>
                        <div className=' col-lg-6 col-sm-12 m-2'>


                            <form >
                                <div className='row'>
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
                                        {show? <p  style={{color:'red'}}> شروع تاریخ از 1401/4/1 است</p>:null}
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

                                    </div>
                                </div>
                                <div className='row justify-content-between'>
                                    <div className='col-6 '>
                                        <button type="submit" disabled={disable} className="btn btn-success float-right " onClick={handelSubmit} >تایید</button>
                                    </div>
                                    <div className='col-6 '>
                                        <NavLink to='/admin' className="btn btn-danger ">بازگشت</NavLink>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            )
        }
        else{
            return(
                <div style={{position:'fixed',top:'40%',left:'40%'}}>
                    <p>دریافت اطلاعات ...</p>
                    <FadeLoader loading={loading} color={color}/>
                </div>
            )

        }
    }
    else {

        const formatTrProps = (state: any = {}) => {
           
            
            {
                return {
                    onClick: async () => {
    
                        SetShow(!show)
    
                       
                    },
                }
            }
    
        }
        if (Response && Response.length >0){
            const dataForExcel = Response.map((item:any) => ({
                'ردیف': item.id,
                'نام کاربری': item.userName,
                'نام': item.name,
                'کد ملی': item.nationalCode,
                'کد سازمان': item.organizationId,
                'نام سازمان':item.organization,
                'شناسه ملی سازمان':item.organizationNationaId,
                'شماره ثبت سازمان': item.organizationRegistrationNumber,
            }))
            return (
                <div className=" statbox widget-content widget-content-area ">
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>

                        <MyTableBazargah columns={columns} data={data} getData={(rows:any)=>setSelectedRows(rows)}   bulkJob={getBulkJob}/>
                        {/*<ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />*/}
                    </div>
                    <div className="d-flex justify-content-end m-2">
                        <ExportToExcel apiData={dataForExcel} fileName='لیست گزارش' />
                    </div>
                </div>

            )
        }else {
            return(
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

export default CustomerReports