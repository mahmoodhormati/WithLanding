import React, { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { DeleteItemCart, DeleteItemCarts, GetShoppingCart } from "../../../services/cartShoppingService";
import { MeasureUnitSample } from "../../Enums/MeasureUnitSample";

import Setting from "../../Setting/setting";
import { SetOrder } from "../../../services/orderService";
import NewsHeader from "../News/newsHeader";
import { toast } from 'react-toastify';
import { GiHamburgerMenu } from "react-icons/gi"
import { BiX } from "react-icons/bi"
import { PaymentStructureEnums } from "../../Enums/PaymentStructureEnums";
import { ClipLoader } from "react-spinners";
import { Link } from 'react-router-dom';
import { useProSidebar } from 'react-pro-sidebar';
import { RootState } from '../../../store';
import  QueryString  from 'qs';
import { GetAttachments } from '../../../services/attachmentService';


const attachmetURL = (window as any).globalThis.stie_att



const Header: React.FC = () => {
    const ref: any = useRef()
    const { collapseSidebar , collapsed } = useProSidebar();
    const refNews: any = useRef()
    const Navigate = useNavigate()
    const user = useSelector((state: RootState) => state.user);
    const [cartShopping, setCartShopping] = useState([])
    const [theme, setTheme] = useState(false)
    const [show, setShow] = useState(false)
    const [showNews, setShowNews] = useState(false)
    const roles = useSelector((state: RootState) => state.roles);
    const [loading, setLoading] = useState(false);

    const [attachments, Setattachments] = useState([]);
    
    const handelGetAttachment = async () => {

        let config = {
          headers: { "Content-Type": "application/json" },
          params: {
            entityTypeId: 1,
            entityId: Number(localStorage.getItem('connect')),
            attachmentTypeId: 3
          },
          paramsSerializer: (params: any) => {
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
    useEffect(() => {

        const checkIfClickedOutside = (e: any) => {
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

        const checkIfClickedOutside = (e: any) => {
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


    let newAttachment: any = []
  newAttachment = attachments.filter((item: any) => item.deleted === false && item.attachmentTypeId === 3)
    return (


        <div className="header-container fixed-top">

            <header className="header navbar navbar-expand-sm">
               

                <div className="block ">
                    {collapsed ? <GiHamburgerMenu size="2rem" onClick={() => collapseSidebar()} />
                        : <BiX size="2rem" onClick={() => collapseSidebar()} />
                    }
                </div>
                <div className="mr-3 ml-3 tarikh">{user.companyName ? user.companyName : null}</div>
                <div className="mr-3 ml-3 tarikh">{`${dayName} ${new Date().toLocaleDateString("fa-IR")}`}</div>
                <ul className="navbar-item flex-row search-ul ">

                </ul>
              
                <ul className="navbar-item flex-row navbar-dropdown ">
                    <li className="nav-item m-auto">
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

                    <li className="nav-item dropdown notification-dropdown">
                        <div ref={refNews}>
                            <Link to='#' className="nav-link dropdown-toggle" id="messageDropdown"
                                onClick={() => {
                                    setShowNews(oldState => !oldState)
                                    setShow(false)
                                }}>
                                <svg style={{
                                    width: "24",
                                    height: "24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                }} className="feather feather-bell">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </Link>
                            <span className="badge badge-success"></span>
                        </div>
                        <div className="  row cart-news ql-direction-rtl  "
                            style={{ top: "80px", left: showNews == true ? "1rem" : "-60rem" }}>
                            {showNews && (
                                <NewsHeader />
                            )}
                        </div>
                    </li>

                    <li className="nav-item dropdown user-profile-dropdown  order-lg-0 order-1">
                        <Link to='#' className="nav-link dropdown-toggle user" id="userProfileDropdown" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                          {newAttachment.length>0? <img src={`${attachmetURL}${newAttachment[0].path}`} className="rounded-circle " alt={`${user.firstName} ${user.lastName}`}  />:
                                     <svg style={{ marginLeft: '8px', backgroundColor: 'white', border: '2px solid white', borderRadius: '5px' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                        className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                    </svg>      }                       </Link>
                        <div className="dropdown-menu position-absolute animated fadeInUp"
                            aria-labelledby="userProfileDropdown">
                            <div className="user-profile-section">
                                <div className="media mx-auto">
                                {newAttachment.length>0? <img src={`${attachmetURL}${newAttachment[0].path}`} className="rounded-circle " alt={`${user.firstName} ${user.lastName}`}  />:
                                     <svg style={{ marginLeft: '8px', backgroundColor: 'white', border: '2px solid white', borderRadius: '5px' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                        className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                    </svg>      }                                    <div className="media-body ml-2">
                                        <h5>{user.firstName ? user.firstName +" "+ user.lastName: localStorage.getItem('mobile')}</h5>

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
                        </div>
                    </li>

                </ul>
            </header>

        </div>

    )
}
export default Header;
