import React, { useState, useMemo } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import { NavLink } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader'
import MyTableBazargah  from "../../../Common/Shared/Form/MyTableBazargah";
import { GetOrdersReports} from "../../../services/reportService";
import {ExportToExcel} from "../../../Common/Shared/Common/ExportToExcel";
import persian_fa from "react-date-object/locales/persian_fa";
import {MeasureUnitSample} from "../../../Common/Enums/MeasureUnitSample";


const OrdersReports:React.FC = () => {
    const [StartDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState<any>([]);
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
            const { data, status } = await GetOrdersReports(StartDate, EndDate);
            if (status === 200) {

                SetResponse(data.result.orderReports);
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
    let formatter = new Intl.NumberFormat('fa-IR', {

        maximumFractionDigits: 0,
        minimumFractionDigits: 0,


    });
    let formater = new Intl.NumberFormat('fa-IR', {


    });

    const columns = useMemo(() => [
        { Header: 'شماره سفارش', accessor: 'orderId' },
        {Header:'شناسه انبار',accessor:'wareHouseId', Cell :(row:any) => String(row.row.original.wareHouseId? row.row.original.wareHouseId :"--") },
        { Header: 'نام انبار', accessor: 'wareHouseName' ,Cell:(row:any) => String(row.row.original.wareHouseName? row.row.original.wareHouseName :"--" )},
        { Header: 'شناسه محصول', accessor: 'productId' ,Cell:(row:any) =>String( row.row.original.productId? row.row.original.productId :"--") },
        { Header: 'نام محصول', accessor: 'productName',Cell:(row:any)=> String(row.row.original.productName? row.row.original.productName :"--" )},
        { Header: 'نام عرضه', accessor: 'productSupplyName',Cell:(row:any)=> String(row.row.original.productSupplyName? row.row.original.productSupplyName :"--" )},
        { Header: 'شناسه عرضه', accessor: 'productSupplyId',Cell:(row:any) => String(row.row.original.productSupplyId? row.row.original.productSupplyId :"--" )},
        { Header: 'شناسه بازارگاه', accessor: 'kharidId' ,Cell:(row:any)=> String(row.row.original.kharidId? row.row.original.kharidId :"--") },
        { Header: 'شناسه تخصیص', accessor: 'allocationId' ,Cell:(row:any) => String(row.row.original.allocationId? row.row.original.allocationId :"--" )},
        { Header: 'مقدار ', accessor: 'quantity' },
        {Header: 'واحد ', accessor:(d:any) => {
                let MeasureUnit = MeasureUnitSample.filter((item:any) => item.id === d.measureUnitId).map((item:any) => item.name)
                return(`${MeasureUnit}`)
            }, Cell: (row:any) => {

                String (MeasureUnitSample.filter((item:any) => item.id === row.row.original.measureUnitId).map((item:any) => item.name))
            }
        },
        { Header: 'تاریخ', accessor: 'createDate',Cell:row => new Date(row.row.original.createDate).toLocaleDateString('fa-IR')},
        { Header: 'قیمت واحد', accessor: 'itemPrice',Cell:row => formatter.format(row.row.original.itemPrice) },
        { Header: 'قیمت سفارش', accessor: 'orderPrice',Cell:row => formatter.format(row.row.original.orderPrice) },
        { Header: 'نام کاربر', accessor: 'customerName' ,Cell:row => row.row.original.customerName? row.row.original.customerName :"--" },
        { Header: 'کد ملی  کاربر', accessor: 'customerNationalCode',Cell:row => row.row.original.customerNationalCode? row.row.original.customerNationalCode :"--" },
        { Header: 'نام سازمان', accessor: 'organizationName',Cell:row => row.row.original.organizationName? row.row.original.organizationName :"--" },
        { Header: 'شناسه ملی سازمان', accessor: 'organizationNationalId',Cell:row => row.row.original.organizationNationalId? row.row.original.organizationNationalId :"--" },
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
                            <p>در این بخش می توانید گزارش سفارشات دریافت کنید.</p>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center '>
                        <div className='widget box shadow col-lg-4 col-sm-12'>


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
                                        <button type="submit" disabled={disable} className="btn btn-success float-left " onClick={handelSubmit} >تایید</button>
                                    </div>
                                    <div className='col-6 '>
                                        <NavLink to='/admin' className="btn btn-danger float-right">بازگشت</NavLink>
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
        if (Response && Response.length >0){
            const dataForExcel = Response.map((item:any) => ({
                'شناسه سفارش': item.orderId,
                'شناسه انبار': item.wareHouseId,
                'نام انبار': item.wareHouseName,
                'شناسه محصول': item.productId,
                'نام محصول': item.productName,
                'شناسه عرضه':item.productSupplyId,
                'نام عرضه':item.productSupplyName,
                'شناسه بازارگاه': item.kharidId,
                'شناسه تخصیص': item.allocationId,
                'مقدار': item.quantity,
                'واحد': item.measureUnitId,
                'تاریخ':new Date(item.createDate).toLocaleDateString("fa-IR"),
                'قیمت واحد': item.itemPrice,
                'قیمت سفارش': item.orderPrice,
                'نام کاربر': item.customerName,
                'شناسه ملی کار بر': item.customerNationalCode,
                'نام سازمان': item.organizationName,
                'شناسه ملی سازمان': item.organizationNationalId,
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

export default OrdersReports