

import { GetAllOrganisation, GetAllOrganisationCode, GetOrganisationById } from "../services/organisationService";
import { GetAddress } from "../services/addressService";
import { GetOrder, GetOrderDetails } from "../services/orderService";
import { MeasureUnitSample } from "../Common/Enums/MeasureUnitSample";
import { useEffect, useState, createRef, useRef } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from "react-router-dom";
import { GetOrderDetailsAdmin } from '../services/orderService';
import { useSelector } from "react-redux";
import { RootState } from '../store';

import { CompaniesEnums } from '../Common/Enums/CompaniesDetailsEnums';

import './style.css';

const InvoiceCreatorForAdmin = ({ closeModal }) => {
    const roles = useSelector((state) => state.roles)

    
    const params = useParams()
    const [order, setOrder] = useState({});
    const [orderStatusId, setOrderStatus] = useState(0);
    const [hidden, setHidden] = useState(false);
    const [companyId, setCompanyId] = useState(1);
    const [customer, SetCustomer] = useState({});
    const [orderDetail, setOrderDetail] = useState([])
    const [SellerData, SetSellerData] = useState([])
    const navigate = useNavigate();

    const [organizations, SetOrganisations] = useState([]);

    const [Address, SetAddress] = useState([]);
    const [SellerAddress, SetSellerAddress] = useState([])

    const Clientref = useRef()


    const handelNavigate = (e) => {

        e.preventDefault()
        if (roles[0] <= 2) {
            navigate(-1)

            return null
        } else {
            navigate(-1)

        }


    }
    const getOrder = async () => {
        try {
            const { data, status } = await GetOrder(params.id)
            setOrder(data.result.order)
            setOrderStatus(data.result.order.orderStatusId)
            SetCustomer(data.result.order.customer)

            SetSellerData(CompaniesEnums)
            setCompanyId(data.result.order.companyId)
            const response = await GetAddress(23, data.result.order.companyId)
            if (response.status === 200) {
                SetSellerAddress(response.data.result.addresses)
            }
            getAddress(data.result.order.customerId)
            if (data.result.order.customer.organizationId) {
                getOrganization(data.result.order.customer.organizationId)

            }
        } catch (error) {
            console.log(error);
        }

    }



    const GetOrderDetail = async () => {
        try {

            const { data, status } = await GetOrderDetails(params.id);
            if (status === 200) {
                setOrderDetail(data.result.orderDetails)
            }


        } catch (error) {
            setHidden(true)

            console.log(error);
        }

    }

    useEffect(() => {

        getOrder()
        GetOrderDetail()

    }, [])
    const getOrganization = async (organizationId) => {
        try {
            const { data, status } = await GetOrganisationById(organizationId)
            if (status === 200) {

                SetOrganisations(data.result.organization)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getAddress = async (id) => {
        try {

            const { data, status } = await GetAddress(1, id)
            SetAddress(data.result.addresses)
        } catch (error) {
            console.log(error);
        }

    }


    const downloadFile = (rootElementId, FileName) => {
        const input = document.getElementById(rootElementId)
        html2canvas(input).then((canvas) => {

            const imgData = canvas.toDataURL('image/jpeg')
            const pdf = new jsPDF('landscape', 'pt', 'a4')
            pdf.addImage(imgData, 'JPEG', 0, 0, 850, 600)
            pdf.save(`${FileName}`)
        })

    }

    const Fullname = () => {

        let fName = customer.firstName;
        let lName = customer.lastName;
        let OName;
        let fullname;
        if (customer.organizationId !== null) {

            const { name } = organizations
            OName = name
            fullname = `${OName ? OName : ''}`;

        }
        else {
            fullname = `${fName ? fName : ''} ${lName ? lName : ''}`;

        }


        return (fullname)


    }


    

    const handelPrintClient=useReactToPrint({
        content:()=>Clientref.current,
        documentTitle:''
    })
    const Code = () => {
        let Ncode = customer.nationalCode;
        let OName;
        let code = ''
        if (customer.organizationId !== null) {

            const { nationalId } = organizations
            OName = nationalId
            return (code = `${OName ? OName : ''}`)
        }
        else {
            return (code = `${Ncode ? Ncode : ''} ${OName ? OName : ''}`)

        }



    }
    var formatter = new Intl.NumberFormat('fa-IR', {

        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });





    const image = SellerData.filter(item => item.id === companyId).map(i => i.images);


    if (order.orderStatusId !== 13) {

        if (hidden === false) {
            return (
                <div  >
                    <div id="body" className='  rounded-5'  >



                        <div  id='pageClient' className=" widget section-to-print"  ref={Clientref} >

                            <div style={{ textAlign: 'end', marginLeft: '3.5%', fontSize: 'small', lineHeight: '1%', marginTop: '5%' }}>

                                <p > تاریخ {""}:{""} {new Date(order.createDate).toLocaleDateString('fa-IR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}</p>
                                <p className="pt-2"> شماره سریال {""}:{""}  {order.id}</p>
                            </div>

                            <h5 className="text-center mb-2">پیش فاکتور</h5>
                            <div className="containBox  ">
                                <div className="coloredBox">
                                    <p>مشخصات فروشنده</p>

                                </div>
                                <div className="small  info-border p-1">
                                    <div className="row">
                                        <div className="col-6">
                                            <p>نام شخص حقیقی/حقوقی {""}:{""} {SellerData.length !== 0 ? SellerData.filter(item => item.id === companyId).map(i => i.name)[0] : ''}
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <p>شماره اقتصادی {""}:{""} {SellerData.length !== 0 ? SellerData.filter(item => item.id === companyId).map(i => i.economicCode)[0] : ''} </p>

                                        </div>
                                        <div className="col-3">
                                            <p>شماره ثبت/شماره ملی{""}:{""}  {SellerData.length !== 0 ? SellerData.filter(item => item.id === companyId).map(i => i.CopmanyNationalId)[0] : ''}</p>

                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <p>نشانی {""}:{""} {'بلوار آفریقا - کوچه گلخانه  - پلاک 14'}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>کد پستی ده رقمی {""}:{""} {'1915873145'} </p>

                                        </div>
                                        <div className="col-3">
                                            <p>شماره تلفن/نمابر {""}:{""} {'2852-021'}</p>

                                        </div>

                                    </div>
                                </div>
                                <div className="coloredBox">
                                    <p>مشخصات خریدار</p>
                                </div>
                                <div className="small info-border p-1">
                                    <div className="row">
                                        <div className="col-6">
                                            <p>نام شخص حقیقی/حقوقی {""}:{""}  {Fullname()}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>شماره اقتصادی {""}:{""} {organizations ? organizations.registrationNumber : ''}</p>

                                        </div>
                                        <div className="col-3">
                                            <p>شماره ثبت/شماره ملی{""}:{""}  {Code()}</p>

                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            {/* <p>نشانی {""}:{""} {Address.length !== 0 ? Address[0].fullAddress : ''}</p> */}
                                            <p>نشانی {""}: </p>
                                        </div>
                                        <div className="col-3">
                                            <p>  کد پستی ده رقمی {""}:{""}   {Address.length !== 0 ? Address[0].postalCode : ''}</p>

                                        </div>
                                        <div className="col-3">
                                            <p> شماره تلفن/نمابر {""}:{""}  {customer.userName}</p>

                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <div className="EmptycoloredBox"></div>
                                    <div className="w-100">

                                        <table
                                            className="w-100  table-bordered text-dark  text-center font-weight-bold   h-auto " style={{ width: "100%", fontSize: '14px' }}>
                                            <thead>
                                                <tr>
                                                    <td>ردیف</td>
                                                    <td>شرح کالا یا خدمات</td>
                                                    <td>عرضه</td>
                                                    <td>تعداد/مقدار</td>
                                                    <td>واحد</td>
                                                    <td>مبلغ واحد(ریال)</td>
                                                    <td>مبلغ کل(ریال)</td>
                                                    <td>مالیات ارزش افزوده</td>
                                                    <td>مبلغ پس از تاثیر عوامل(ریال)</td>
                                                    <td>مبلغ تخفیف(ریال)</td>
                                                    <td>عوارض ارزش افزوده</td>
                                                    <td>جمع مبلغ کل بعلاوه مالیات و عوارض</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderDetail.map(item =>
                                                    <tr>
                                                        <td>{orderDetail.length}</td>
                                                        <td>{item.product.name}</td>
                                                        <td>{item.productSupplyId}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{MeasureUnitSample.filter(i => i.id === item.measureUnitId).map(i => i.name)}</td>
                                                        <td>{formatter.format(item.price / item.quantity)}</td>
                                                        <td>{formatter.format(item.price)}</td>
                                                        <td>0</td>
                                                        <td>{formatter.format(item.priceIncludingTax)}</td>
                                                        <td>0</td>
                                                        <td>0</td>
                                                        <td>{formatter.format(item.priceIncludingTax)}</td>

                                                    </tr>
                                                )}
                                                <tr className='border'>
                                                    <td colspan="9"> جمع</td>
                                                    <td>{order.orderDiscount}</td>
                                                    <td>{order.orderTax}</td>
                                                    <td>{formatter.format(order.orderFinalizedPrice)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-4  " style={{ lineHeight: '30%' }}>
                                {SellerData.length !== 0 ? <h6 className='mb-2 text-dark'>لطفا وجه پیش فاکتور فوق را نزد یکی از بانک های ذیل واریز نمایید   </h6> : ''}
                                {SellerData.length !== 0 && SellerData.filter(item => item.id === companyId).map(i => i.accountNumbers)[0].length > 0 ?
                                    <div className='' style={{ marginLeft: '20%', marginRight: '20%' }}>

                                        <table className='text-dark table'>
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: 'gray' }}>نام بانک</th>
                                                    <th style={{ backgroundColor: 'gray' }}>شماره حساب</th>
                                                    <th style={{ backgroundColor: 'gray' }}>شماره شبا</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {SellerData.filter(item => item.id === companyId).map(i => i.accountNumbers)[0].map(item =>
                                                    <tr>
                                                        <td>{item.bankName}</td>
                                                        <td>{item.accountNumber}</td>
                                                        <td>{item.IR}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    : ''

                                }
                            </div>
                            <div className="end-part-invoice text-dark" style={{  marginLeft: '2.5%', marginRight: '2.5%' }}  >
                                <div className="row   small "  >
                                    <div className="col-6" style={{ border: ' 1px solid black' }}>
                                        <div className="row">
                                            <div className="col-6 border">
                                                شرایط یا نحوه فروش
                                            </div>
                                            <div className="col-3 border">
                                                نسیه</div>
                                            <div className="col-3 border">
                                                نقدی</div>
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <div className="row small" >
                                        <div className="col-6 border" >
                                            <div className="row">
                                                <div className="col-2    " style={{ border: ' 1px solid black' }}>
                                                    توضیحات {""}:{""}
                                                </div>
                                                <div className="col-10 " style={{ border: ' 1px solid black' }}>
                                                    {order.comment ? order.comment : <p>{"       "}</p>
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row small " >
                                    <div className="col-6  border" >

                                    </div>
                                    <div className="col-3 ">
                                        <p>مهر و امضا فروشنده </p>
                                        {image[0] !== undefined ? <img src={image[0]} style={{ width: '13rem', height: '5rem' }} /> : ''}


                                    </div>
                                    <div className="col-3 ">
                                        <p> مهر و امضای خریدار</p>
                                    </div>
                                </div>






                            </div>


                        </div>

                    </div>
                    <div className="d-flex justify-content-center">
                        <button onClick={handelNavigate} className="btn btn-danger col-2   m-2 ">بازگشت</button>
                        <button onClick={handelPrintClient} className="btn btn-info col-2  m-2  ">چاپ</button>
                    </div>
                    <h6 className='text-center text-danger'>مشتری گرامی : لطفا پس از دانلود فایل پیش فاکتور ، اقدام به چاپ آن نمایید ، سپس بوسیله مهر و امضا لازمه پیش فاکتور را را تایید نموده و در آخر تصویر اسکن شده آن را از بخش آپلود فایل برای ما ارسال نمایید</h6>
                </div>
            )
        }


        else {
            return (null)
        }
    }

    else {
        return (null)
    }
}


export default InvoiceCreatorForAdmin


{/* <p>پرداخت {""}:{""}  نسیه یک ماهه - بارگیری منوط به ارائه کد یکتا می باشد - فروش فقط و فقط از طریق سیستم بازارگاه . ارسال هرگونه کالا خارج از سیستم بازارگاه غیر ممکن می باشد - بارگیری 10روز کاری بعد از دریافت چک . بارگیری از کارخانه روغنکشی نوید خلیج فارس استان خوزستان .</p> */ }