import React, { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useProSidebar } from 'react-pro-sidebar';
import QueryString from 'qs';
import { GetAttachments } from '../../services/attachmentService';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BiX } from 'react-icons/bi';
import Setting from '../../Common/Setting/setting';
import NewsHeader from '../../Common/Shared/News/newsHeader';
import './style.css'
import { index } from 'd3';
import { ClipLoader } from 'react-spinners';
import { BsBasket } from 'react-icons/bs';


const attachmetURL = (window).globalThis.stie_att



const LandingHeader = () => {
    const ref = useRef()
    const { collapseSidebar, collapsed } = useProSidebar();
    const refNews = useRef()
    const Navigate = useNavigate()
    const user = useSelector((state) => state.user);
    const [cartShopping, setCartShopping] = useState([])
    const [theme, setTheme] = useState(false)
    const [show, setShow] = useState(false)
    const [showNews, setShowNews] = useState(false)
    const roles = useSelector((state) => state.roles);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const [attachments, Setattachments] = useState([]);

    const handelGetAttachment = async () => {

        if (token) {
            let config = {
                headers: { "Content-Type": "application/json" },
                params: {
                    entityTypeId: 1,
                    entityId: Number(localStorage.getItem('connect')),
                    attachmentTypeId: 3
                },
                paramsSerializer: (params) => {
                    return QueryString.stringify(params);
                },
            };
            try {
                const { data, status } = await GetAttachments(config);
                if (status === 200) {
                    Setattachments(data.result.attachments);


                }
            } catch (error) {
                console.log(error);


            }
        }
    }
    useEffect(() => {

        const checkIfClickedOutside = (e) => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (show && ref.current && !ref.current.contains(e.target)) {
                setShow(false)
            }
            if (showNews && refNews.current && !refNews.current.contains(e.target)) {
                setShowNews(false)
            }

        }

        document.addEventListener("click", checkIfClickedOutside)


        return () => {
            // Cleanup the event listener
            document.removeEventListener("click", checkIfClickedOutside)
        }
    }, [show])
    useEffect(() => {

        const checkIfClickedOutside = (e) => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (show && ref.current && !ref.current.contains(e.target)) {
                setShow(false)
            }
            if (showNews && refNews.current && !refNews.current.contains(e.target)) {
                setShowNews(false)
            }
        }

        document.addEventListener("click", checkIfClickedOutside)


        return () => {
            // Cleanup the event listener
            document.removeEventListener("click", checkIfClickedOutside)
        }
    }, [showNews])
    // const getCartShopping = async () => {
    //     const { data, status } = await GetShoppingCart(Number(localStorage.getItem('connect')))

    //     setCartShopping(data.result.shoppingCartItems)

    // }




    useEffect(() => {
        // getCartShopping()
        handelGetAttachment()

    }, [])

    let days = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    let d = new Date()
    let dayName = days[d.getDay()]


    let newAttachment = []
    newAttachment = attachments.filter((item) => item.deleted === false && item.attachmentTypeId === 3)
    return (


        <div className=" header-fixed">

            <header className="header navbar navbar-expand-sm" style={{ minHeight: '110px' }}>


                <ul className="navbar-item flex-row navbar-dropdown col-md-4 ">
                    <li className="nav-item dropdown apps-dropdown more-dropdown md-hidden">
                        <div className="dropdown ">
                            <Link className="dropdown-toggle" to="#" role="button" id="appSection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><GiHamburgerMenu size="2rem" /></Link>

                            <div className="dropdown-menu  animated fadeInUp" aria-labelledby="appSection">
                                <a className="dropdown-item" data-value="Chat" href="apps_chat.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> چت</a>
                                <a className="dropdown-item" data-value="Mailbox" href="apps_mailbox.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> صندوق پستی</a>
                                <a className="dropdown-item" data-value="Todo" href="apps_todoList.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> لیست انجام کار</a>
                                <a className="dropdown-item" data-value="Notes" href="apps_notes.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> یادداشت</a>
                                <a className="dropdown-item" data-value="scrumboard" href="apps_scrumboard.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg> صفحه اسکراب</a>
                                <a className="dropdown-item" data-value="Contacts" href="apps_contacts.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> مخاطبین</a>
                                <a className="dropdown-item" data-value="Invoice" href="apps_invoice.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> لیست فاکتورها</a>
                                <a className="dropdown-item" data-value="Calendar" href="apps_calendar.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> تقویم</a>
                            </div>
                        </div>
                    </li>
                </ul>

                <ul className="navbar-item  col-md-4 ">
                    <li className="nav-item theme-logo m-auto">

                        <img src={`${attachmetURL}Resources/logo.png`} className="navbar-logo" alt="logo" style={{ height: '5rem' }} />

                    </li>
                </ul>

                <ul className="navbar-item flex-row  justify-content-end navbar-dropdown align-items-center col-md-4">
                    <li className="nav-item ">
                        <Setting />
                    </li>
                    {/* <li className="nav-item dropdown message-dropdown">
                        <div ref={ref}>
                            <Link to='#' className="nav-link dropdown-toggle" id="messageDropdown"
                                onClick={() => setShow(oldState => !oldState)}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor"
                                    className="bi bi-cart" viewBox="0 0 16 16" id="IconChangeColor">
                                    <path
                                        d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                                        id="mainIconPathAttribute"></path>
                                </svg>
                                <span className="badge badge-primary">{cartShopping.length}</span>

                            </Link>
                        </div>
                        <div onClick={handleHeaderClick} className="  row cart-shop2 ql-direction-rtl  "
                            style={{ top: "80px", left: show == true ? "1rem" : "-60rem" }}>
                            <div className="col-12 px-2" >
                                <div className="row">
                                    <span className=" col-6 float-left bold py-2" style={{ fontSize: 'smaller' }}>{cartShopping.length} محصول</span>

                                    <span className=" col-6 float-right py-2" onClick={() => setShow(oldState => !oldState)}><svg
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
                                                x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                                </div>
                                <div >
                                    {cartShopping.length !== 0 ?

                                        Array.from({ length: 10 } && cartShopping.map((item: any, i) =>

                                            show && (

                                                <Link to='#' className=" animated dropdown-item border-bottom border-light p-2 my-2 mt-3 "
                                                    key={item.id}>
                                                    <div className="row shadow">
                                                        <div className="col-12">
                                                            <span className=" float-left mt-1"
                                                                onClick={() => deleteItemHandler(item.productSupplyId)}><svg
                                                                    style={{ color: 'red' }} width="24" height="24"
                                                                    stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"> <path
                                                                        d="M9.17218 14.8284L12.0006 12M14.829 9.17157L12.0006 12M12.0006 12L9.17218 9.17157M12.0006 12L14.829 14.8284"
                                                                        stroke="red" stroke-linecap="round"
                                                                        stroke-linejoin="round" /> <path
                                                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                                        stroke="currentColor" stroke-linecap="round"
                                                                        stroke-linejoin="round" /> </svg></span></div>
                                                        <div className="media col-5 ">
                                                            <div className="user-img">
                                                                <div className="avatar avatar-xl">
                                                                    <span className="avatar-title rounded-circle">
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="media-body col-6  mt-3">
                                                                <div className="">
                                                                    <h5 className="usr-name text-primary">{item.product.name}</h5>
                                                                    <p style={{
                                                                        fontSize: 'x-small',
                                                                        color: 'lightgrey'
                                                                    }}> موجود در انبار</p>

                                                                    <p className="">مقدار:{item.quantity}<span
                                                                        className="mx-1">{MeasureUnit(item.measureUnitId)}</span>
                                                                    </p>

                                                                    <p> قیمت:{formatter.format(item.price)} ریال</p>
                                                                </div>

                                                            </div>


                                                        </div>

                                                    </div>

                                                </Link>

                                            )
                                        ))

                                        : <Link to='#' className="dropdown-item border-bottom border-light p-2 my-2 mt-3 ">

                                            <div className="col-12"></div>
                                            <div className="media col-5 p-2 ">
                                                <span> کالایی در سبد خرید موجود نیست</span>

                                            </div>



                                        </Link>
                                    }
                                </div>
                            </div>

                            <div className="footer-car-shop col-12 shadow p-3 rounded  " >
                                <span className="float-right " onClick={deleteHandler}> <svg style={{ color: 'red' }}
                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-trash-2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>

                                </svg></span>
                                <p className="font-weight-bolder  " style={{ fontSize: '0.8rem' }}> مبلغ قابل پرداخت
                                    :{formatter.format(cartShopping.reduce((total, item: any) => total + (item.price), 0))} ریال</p>
                                <p>
                                    <button
                                        onClick={setOrder} disabled={loading ? true : cartShopping.length > 0 ? false : true} className="btn btn-primary  float-left mt-3">ارسال درخواست
                                        <ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>

                                    <button className="btn btn-primary float-right mt-3" onClick={() => {
                                        setShow(oldState => !oldState)
                                        setShowNews(false)
                                    }} >ادامه خرید</button>
                                </p>
                            </div>
                        </div>

                    </li> */}

                    <li className="nav-item dropdown message-dropdown  ">
                        <div ref={ref}>
                            <Link to='#' className="nav-link dropdown-toggle" id="messageDropdown"
                                onClick={() => setShow(oldState => !oldState)}>

                                <BsBasket strokeWidth="0" />
                                <span className="badge badge-primary">{cartShopping.length}</span>

                            </Link>
                        </div>
                        <div className="  row cart-shop2 ql-direction-rtl  "
                            style={{ top: "110px", zIndex: 3, left: show == true ? "0.8rem" : "-60rem" }}>
                            <div className="col-12 px-2" >
                                <div className="row">
                                    <span className=" col-6 float-right bold py-2" style={{ fontSize: 'smaller', color: "black" }}>{cartShopping.length !== 0 ? <span>{cartShopping.length} کالا در سبد خرید</span> : <span> کالایی در سبد خرید موجود نیست</span>}</span>

                                    <span className=" col-6 float-right py-2" onClick={() => setShow(oldState => !oldState)}><svg
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
                                                x1="6" y1="6" x2="18" y2="18"></line></svg></span>

                                </div>
                                {/* <div > 
                                    {cartShopping.length !== 0 ?

                                        Array.from({ length: 10 } && cartShopping.map((item, i) =>

                                            show && (

                                                <Link to='#' className=" animated dropdown-item    "
                                                    key={item.id}>
                                                    <div className="row px-4 ">
                                                       
                                                        <div className=" col-3">
                                                            <div className="user-img">
                                                                <div className="avatar avatar-xl">
                                                                    <span className="avatar-title rounded-circle">
                                                                        <img className="img-fluid" style={{width:"100px" }} src="/assets/img/afralogo.png"/>
                                                                    </span>
                                                                </div>
                                                                <span className=" product-detail-cartShop">{item.quantity}<span
                                                                        className="mx-1 ">{MeasureUnit(item.measureUnitId)}</span>
                                                                    </span>
<br />

                                                                    <span className=" product-price-cartShop"> {formatter.format(item.price)} ریال</span>
                                                            </div>
                                                         


                                                        </div>
                                                        <div className=" col-8  ">
                                                                <div className="">
                                                               
                                                                    <p className=" product-name-cartShop" >{item.product.name}</p>
                                                                    <p style={{
                                                                        fontSize: 'x-small',
                                                                        color: 'lightgrey'
                                                                    }}> موجود در انبار</p>

                                                                   
                                                                    
                                                                </div>

                                                            </div>
                                                            <div className="col-1">
                                                        <span className="  "
                                                                onClick={() => deleteItemHandler(item.productSupplyId)}><svg
                                                                    style={{ color: 'red' }} width="24" height="24"
                                                                    strokeWidth="1.5" viewBox="0 0 24 24" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"> <path
                                                                        d="M9.17218 14.8284L12.0006 12M14.829 9.17157L12.0006 12M12.0006 12L9.17218 9.17157M12.0006 12L14.829 14.8284"
                                                                        stroke="red" strokeLinecap="round"
                                                                        strokeLinejoin="round" /> <path
                                                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                                        stroke="currentColor" strokeLinecap="round"
                                                                        strokeLinejoin="round" /> </svg></span>
                                                            </div>
                                                    </div>

                                                </Link>

                                            )
                                        ))

                                        :
                                        <div className='text-center'>
                                    
                                        <img src="/assets/img/emptyBasket.svg"/>
                                        </div>
                                    }
                                </div> */}
                            </div>

                            {/* { cartShopping.length !== 0 ? <div className="footer-car-shop col-12  p-3   " >
                                <span className="float-right " onClick={deleteHandler}> <svg style={{ color: 'red' }}
                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-trash-2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>

                                </svg></span>
                                <p className="font-weight-bolder  " style={{ fontSize: '0.8rem' }}> مبلغ قابل پرداخت
                                    :{formatter.format(cartShopping.reduce((total, item) => total + (item.price), 0))} ریال</p>
                                <p className='text-center'>
                                    <button
                                        onClick={setOrder} disabled={loading ? true : cartShopping.length > 0 ? false : true} className="btn btn-primary w-100  mt-3">ارسال درخواست
                                        <ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>

                                    {/* <button className="btn btn-primary float-right mt-3" onClick={() => {
                                        setShow(oldState => !oldState)
                                        setShowNews(false)
                                    }} >ادامه خرید</button> */}
                            {/* </p>
                            </div>: null */}
                        </div>

                    </li>

                    <li className="nav-item dropdown user-profile-dropdown  order-lg-0 order-1">
                       {token? <Link to='#' className="nav-link dropdown-toggle user" id="userProfileDropdown" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            {newAttachment.length > 0 ? <img src={`${attachmetURL}${newAttachment[0].path}`} className="rounded-circle " alt={`${user.firstName} ${user.lastName}`} /> :
                                <svg style={{ marginLeft: '8px', border: '2px solid white', borderRadius: '5px' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                    className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    <path fillRule="evenodd"
                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                </svg>}                       </Link>:<Link to='/login' className="nav-link dropdown-toggle user" id="userProfileDropdown" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            {newAttachment.length > 0 ? <img src={`${attachmetURL}${newAttachment[0].path}`} className="rounded-circle " alt={`${user.firstName} ${user.lastName}`} /> :
                                <svg style={{ marginLeft: '8px', border: '2px solid white', borderRadius: '5px' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                    className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    <path fillRule="evenodd"
                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                </svg>}                       </Link>}

                        {token ? <div className="dropdown-menu position-absolute animated fadeInUp"
                            aria-labelledby="userProfileDropdown">
                            <div className="user-profile-section">
                                <div className="media mx-auto">
                                    {newAttachment.length > 0 ? <img src={`${attachmetURL}${newAttachment[0].path}`} className="rounded-circle " alt={`${user.firstName} ${user.lastName}`} /> :
                                        <svg style={{ marginLeft: '8px', border: '2px solid white', borderRadius: '5px' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                            className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                            <path fillRule="evenodd"
                                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                        </svg>}                                    <div className="media-body ml-2">
                                        <h5>{user.firstName ? user.firstName + " " + user.lastName : localStorage.getItem('mobile')}</h5>

                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-item">
                                <NavLink to="/client/userProfile">
                                    <svg style={{
                                        width: "24",
                                        height: "24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                    }} className="feather feather-user">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>پروفایل من</span>
                                </NavLink>
                            </div>
                            <div className="dropdown-item">
                                <Link to="apps_mailbox.html">
                                    <svg style={{
                                        width: "24",
                                        height: "24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                    }} className="feather feather-inbox">
                                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                        <path
                                            d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                                    </svg>
                                    <span>صندوق ورودی من</span>
                                </Link>
                            </div>
                            {/*<div className="dropdown-item">*/}
                            {/*    <NavLink to="setting">*/}
                            {/*        <IoSettingsOutline size='50px' /> <span>تنظیمات تم</span>*/}
                            {/*    </NavLink>*/}
                            {/*</div>*/}
                            <div className="dropdown-item">
                                <NavLink to="/logout">
                                    <svg style={{
                                        width: "24",
                                        height: "24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                    }} className="feather feather-log-out">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>خروج</span>
                                </NavLink>
                            </div>
                        </div> : ''}
                    </li>

                </ul>
            </header>

        </div>

    )
}
export default LandingHeader;
