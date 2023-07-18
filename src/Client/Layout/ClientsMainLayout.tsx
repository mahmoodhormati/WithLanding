import React, { Fragment, useEffect, useReducer, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FooterClient from "./Footer/FooterClient";
import HeaderClient from "./Header/HeadrClient";
import ClientSideNavbar from "./../Nav/ClientSideNavbar";
import "./mainclient.css";
import { useDispatch } from "react-redux";
import { GetUserInfo, GetUsersRoles } from "../../services/userService";
import { addUser } from "../../store/Slice/user/userSlice";
import { userRoles } from "../../store/Slice/user/userRole/userRoleSlice";
import { GetCompanyChild } from "../../services/companiesService";
import { AllCompanies } from "../../store/Slice/companies/companySlice";
import OrderCustomer from "../Order/Component/OrderCustomer";
import HeaderClientMian from "./Header/headerClientMian";
import OrderDetailTest from "../Order/Component/customerOrderDetailTest";
import Ticket from "../Ticket/ticket_v2";
import NewTicket from "../Ticket/newTicket";

import DashbordCustomer from "../Dashboard/Component/dashbordCustomer";
import InvoiceCreator from "../../Utils/invoiceCreator";
import NotFound from "../../Common/Shared/Common/notFound";
import UserProfile from "../Profile/userProfile";
import EditProfile from "../Profile/editProfile";
import EditAddress from "../Profile/editAddress";
import OrganizationClient from "../organition/organizationClient";
import EditOrganizaion from "../organition/EditOrganization";
import InvoiceClient from "../invoice/invoiceClient";
import PaymentMethods from "../paymentMethods/paymentMethods";
import PaymentMethodComponent from "../paymentMethods/paymentMethods";
import PaymentList from "../payment/paymentList";
import AddresForm from "./../IdentityRegister/Component/AddresForm";
import { decryptStirng, encryptMessage } from "../../Utils/DecryptionUtill";
import SalesBoardForCustomer from "../../Common/Shared/Common/salesBoard";
import WalletList from "../Wallet/Component/Wallet";
import WalletHistories from "../Wallet/Component/WalletHistories";
import AddressContainer from "../Profile/AddressContainer";

const ClientsMainLayout: React.FC = () => {
  const [collapsed, Setcollapsed] = useState(true);
  const [userinfo, setUserinfo] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)


  const navigate = useNavigate();

  useEffect(() => {
    fetchApi();
    getUserRole();
    // getUserCompanies();
  }, [updateValue]);

  const dispatch = useDispatch();
  async function fetchApi() {
    const { data, status } = await GetUserInfo();
    try {
      if (status === 200) {
        localStorage.setItem("connect", data.result.customer.id);
        localStorage.setItem("com", data.result.customer.companyId);

        setUserinfo(data.result.customer);
        dispatch(addUser(data.result.customer));
      }
    } catch (error) {
     ForceUpdate()
    }
  }
  document.body.classList.add("clientBody");

  const getUserRole =  () => {
   
    const role=localStorage.getItem('rd')
    if(role){
    dispatch(userRoles( decryptStirng( role)))
    }
   
  };

  const getUserCompanies = async () => {
    const { data, status } = await GetCompanyChild();
    if (status === 200) {
      dispatch(AllCompanies(data.result.companies));
    }
  };

  return (
    <Fragment>
      <div className="headerClient">
        {" "}
        <HeaderClient collapsed={collapsed} updateHeader={updateValue} />
        <HeaderClientMian />
      </div>

      <div className="hero-section style-2">
      <svg
            id="wave"
            style={{transform:"rotate(180deg)",transition: "0.3s"}}
            viewBox="0 0 1440 460"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
                <stop stopColor="rgba(62, 71.325, 243, 1)" offset="0%"></stop>
                <stop
                  stopColor="rgba(157.733, 255, 212.167, 1)"
                  offset="100%"
                ></stop>
              </linearGradient>
            </defs>
            <path
              style={{transform:"translate(0, 0px)", opacity:"1"}}
              fill="url(#sw-gradient-0)"
              d="M0,414L60,345C120,276,240,138,360,115C480,92,600,184,720,253C840,322,960,368,1080,360.3C1200,353,1320,291,1440,260.7C1560,230,1680,230,1800,230C1920,230,2040,230,2160,199.3C2280,169,2400,107,2520,99.7C2640,92,2760,138,2880,176.3C3000,215,3120,245,3240,283.7C3360,322,3480,368,3600,375.7C3720,383,3840,353,3960,291.3C4080,230,4200,138,4320,92C4440,46,4560,46,4680,76.7C4800,107,4920,169,5040,207C5160,245,5280,261,5400,253C5520,245,5640,215,5760,230C5880,245,6000,307,6120,291.3C6240,276,6360,184,6480,153.3C6600,123,6720,153,6840,153.3C6960,153,7080,123,7200,107.3C7320,92,7440,92,7560,130.3C7680,169,7800,245,7920,283.7C8040,322,8160,322,8280,291.3C8400,261,8520,199,8580,168.7L8640,138L8640,460L8580,460C8520,460,8400,460,8280,460C8160,460,8040,460,7920,460C7800,460,7680,460,7560,460C7440,460,7320,460,7200,460C7080,460,6960,460,6840,460C6720,460,6600,460,6480,460C6360,460,6240,460,6120,460C6000,460,5880,460,5760,460C5640,460,5520,460,5400,460C5280,460,5160,460,5040,460C4920,460,4800,460,4680,460C4560,460,4440,460,4320,460C4200,460,4080,460,3960,460C3840,460,3720,460,3600,460C3480,460,3360,460,3240,460C3120,460,3000,460,2880,460C2760,460,2640,460,2520,460C2400,460,2280,460,2160,460C2040,460,1920,460,1800,460C1680,460,1560,460,1440,460C1320,460,1200,460,1080,460C960,460,840,460,720,460C600,460,480,460,360,460C240,460,120,460,60,460L0,460Z"
            ></path>
            <defs>
              <linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0">
                <stop stopColor="rgba(62, 151.031, 243, 1)" offset="0%"></stop>
                <stop stopColor="rgba(255, 255, 255, 1)" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path
              style={{transform:"translate(0, 50px)", opacity:"0.9"}}
              fill="url(#sw-gradient-1)"
              d="M0,138L60,138C120,138,240,138,360,161C480,184,600,230,720,253C840,276,960,276,1080,245.3C1200,215,1320,153,1440,168.7C1560,184,1680,276,1800,291.3C1920,307,2040,245,2160,237.7C2280,230,2400,276,2520,299C2640,322,2760,322,2880,291.3C3000,261,3120,199,3240,191.7C3360,184,3480,230,3600,237.7C3720,245,3840,215,3960,207C4080,199,4200,215,4320,230C4440,245,4560,261,4680,283.7C4800,307,4920,337,5040,352.7C5160,368,5280,368,5400,306.7C5520,245,5640,123,5760,92C5880,61,6000,123,6120,184C6240,245,6360,307,6480,337.3C6600,368,6720,368,6840,306.7C6960,245,7080,123,7200,107.3C7320,92,7440,184,7560,245.3C7680,307,7800,337,7920,314.3C8040,291,8160,215,8280,153.3C8400,92,8520,46,8580,23L8640,0L8640,460L8580,460C8520,460,8400,460,8280,460C8160,460,8040,460,7920,460C7800,460,7680,460,7560,460C7440,460,7320,460,7200,460C7080,460,6960,460,6840,460C6720,460,6600,460,6480,460C6360,460,6240,460,6120,460C6000,460,5880,460,5760,460C5640,460,5520,460,5400,460C5280,460,5160,460,5040,460C4920,460,4800,460,4680,460C4560,460,4440,460,4320,460C4200,460,4080,460,3960,460C3840,460,3720,460,3600,460C3480,460,3360,460,3240,460C3120,460,3000,460,2880,460C2760,460,2640,460,2520,460C2400,460,2280,460,2160,460C2040,460,1920,460,1800,460C1680,460,1560,460,1440,460C1320,460,1200,460,1080,460C960,460,840,460,720,460C600,460,480,460,360,460C240,460,120,460,60,460L0,460Z"
            ></path>
          </svg>
        <div
          className="bg_img hero-bg bottom_center"
          data-background="./hero-bg.png"
        >
         
        </div>
      </div>
      <section className="dashboard-section padding-bottom  mt-lg--440 pos-rel">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-12 col-lg-3  ">
              <ClientSideNavbar />
            </div>
            <div className=" col-lg-9">
              {!userinfo.requireInfo ? (
                <Routes>
                  <Route path="/" element={<DashbordCustomer />} />
                  <Route path="/*" element={<NotFound />} />
                  {/* Sales&Order&Bazargah*/}

                  <Route path="orderlist" element={<OrderCustomer />} />
                  <Route path="orderDetail/:id" element={<OrderDetailTest />} />
                  <Route
                    path="consular-invoice/:id"
                    element={<InvoiceCreator closeModal={null} />}
                  />
                  <Route
                    path="salesBoard"
                    element={<SalesBoardForCustomer setloading={setLoading} update={ForceUpdate} />}
                  />

                  {/* Ticket*/}

                  <Route path="ticket" element={<Ticket />} />
                  <Route path="newTicket" element={<NewTicket />} />
                  {/* Profile*/}

                  <Route path="userProfile" element={<UserProfile />} />
                  <Route path="editProfile" element={<EditProfile />} />
                  <Route path="editAddress/:id" element={<EditAddress />} />
                  <Route path="newAddress" element={<AddresForm />} />
                  <Route path="addresses" element={<AddressContainer />} />

                  {/*organization */}
                  <Route path="organization" element={<OrganizationClient />} />
                  {/* <Route
                    path="editorganization/:id"
                    element={<EditOrganizaion />}
                  /> */}
                  {/* invoice */}
                  <Route path="invoice" element={<InvoiceClient />} />
                  <Route
                    path="PaymentMethod"
                    element={<PaymentMethodComponent invoiceId={null}  closeModal={null}/>}
                  />
                  {/* payment */}
                  <Route path="payment" element={<PaymentList />} />
                  {/* wallet */}
                  <Route path="wallet" element={<WalletList />} />
                  <Route path="walletHistory/:id" element={<WalletHistories />} />

                </Routes>
              ) : (
                <Routes>
                  <Route path="/" element={<EditProfile />} />
                  <Route path="/*" element={<NotFound />} />
                  {/* Sales&Order&Bazargah*/}

                  <Route path="editProfile" element={<EditProfile />} />
                  <Route path="addresses" element={<AddressContainer />} />

                </Routes>
              )}
            </div>
          </div>
        </div>
      </section>
      <FooterClient />
    </Fragment>
  );
};

export default ClientsMainLayout;
