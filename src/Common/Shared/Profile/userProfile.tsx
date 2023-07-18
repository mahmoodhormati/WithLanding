import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GetAddress, GetAllProvince } from "../../../services/addressService";
import { ImUser } from "react-icons/im"
import { GetAllOrganisation,GetOrganisationById } from "../../../services/organisationService";
import { RootState } from "../../../store";
const UserProfile:React.FC = () => {
  const Navigate = useNavigate()
  const user = useSelector((state:RootState) => state.user);
  const roles = useSelector((state:RootState)=>state.roles);

  const [address, setAddress] = useState([]);
  const [province, setProvince] = useState([]);
  const [organization, setOrganization] = useState({});
  const getProvince = async () => {
    const { data, status } = await GetAllProvince();
    setProvince(data.result.provinces);
  }
  useEffect(() => {
    getProvince();
  }, []);
  const cities = province.filter((data:any) => data.parentId !== null);
  const CitiesrenderList = (id:any) => {
    return (cities.filter((item:any) => item.id === id).map((data:any) => data.name))
  }
  useEffect(() => {
    fetchApi();
 
    getOrganiz()

  }, [])
  async function fetchApi() {
    const { data, status } = await GetAddress(1, Number(localStorage.getItem('connect')));
    setAddress(data.result.addresses);
  }
  const navitage = () => {
    if(roles.every(item=>(item  <= 2))){
      Navigate("/client/editProfile")

    }else{
      Navigate("/admin/editProfile")

    }
  }
  const navigateOrganization = () => {
    if(roles.some(item=>(item  <= 2))){
    Navigate(`/client/editorganization/${user.organizationId}`)
  }else{
    Navigate(`/admin/editorganization/${user.organizationId}`)
  }
  }
  const navitageAddress = (id:any) => {
    if(roles.some(item=>(item  <= 2)) ){
    Navigate(`/client/editAddress/${id}`)
  }else{
    Navigate(`/admin/editAddress/${id}`)

  }
  }
  const getOrganiz = async () => {

    try {
      const { data, status } = await GetOrganisationById(user.organizationId)
      setOrganization(data.result.organizationLists.values)
    } catch (error) {
      console.log(error);
    }
  }

  let organizm:any = {}
  if (user.organizationId) {
    organizm =organization
  }
  return (

    <div className="row layout-spacing">

      <div className={roles[0]  <= 2?"col-xl-12 col-lg-12 col-md-12 col-sm-12 layout-top-spacing":"col-xl-4 col-lg-6 col-md-5 col-sm-12 layout-top-spacing"}>

        <div className="user-profile layout-spacing">
          <div className=" dashboard-widget widget-content widget-content-area dashboard-widget">
            <div className="d-flex justify-content-between">
              <h3 className="">اطلاعات</h3>

              <svg onClick={navitage} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="feather feather-edit-3">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>

            </div>
            <div className="text-center user-info">
              <ImUser size={"4rem"} />
              <p >{user.firstName} {user.lastName}</p>
            </div>
            <div className="user-info-list">

              <div className="">
                <ul className="contacts-block list-unstyled">

                  <li className="contacts-block__item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-calendar">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {user.nationalCode}
                  </li>

                  <li className="contacts-block__item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-mail">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {user.email}
                  </li>
                  <li className="contacts-block__item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-phone">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {user.userName}
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>



      </div>
      <div className={roles[0]  <= 2?"col-xl-12 col-lg-12 col-md-12 col-sm-12 layout-top-spacing":"col-xl-8 col-lg-6 col-md-7 col-sm-12 layout-top-spacing"}>

        <div className="skills layout-spacing ">
          <div className=" dashboard-widget widget-content widget-content-area">
            <h3 className=""> آدرس</h3>

            {address.map((item:any) =>

              <div key={item.id}>
                <svg onClick={() => navitageAddress(item.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="feather feather-edit-3">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <p> آدرس :{item.fullAddress} </p>
                <p> کدپستی :{item.postalCode} </p>
                <p> شهر :{CitiesrenderList(item.provinceId)} </p>
                <hr />

              </div>
            )}
          </div>
        </div>
      </div>

      {/* {organizm && user.organizationId?
        <div className="col-xl-4 col-lg-6 col-md-5 col-sm-12 layout-top-spacing">

          <div className="user-profile layout-spacing">
            <div className="widget-content widget-content-area">
              <div className="d-flex justify-content-between">
                <h3 >سازمان</h3>

                <svg onClick={navigateOrganization} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="feather feather-edit-3">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>

              </div>

              <div className="user-info-list">

                <div className="">
                  <ul className="contacts-block list-unstyled">

                    <li className="contacts-block__item">
                      <svg style={{ color: 'black' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z" fill="#121212"></path> <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" fill="#121212"></path> </svg>
                      {organizm.name}
                    </li>

                    <li className="contacts-block__item">
                      <svg style={{ color: 'black' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M200,32H56a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V40A8,8,0,0,0,200,32ZM128,168a32,32,0,1,1,32-32A32,32,0,0,1,128,168Z" opacity="0.2" fill="#000000"></path><circle cx="128" cy="136" r="32" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><path d="M80,192a60,60,0,0,1,96,0" fill="#000000" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><rect x="32" y="48" width="192" height="160" rx="8" transform="translate(256) rotate(90)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><line x1="96" y1="64" x2="160" y2="64" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
                      {organizm.nationalId}
                    </li>
                    <li className="contacts-block__item">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M29.0656 10.3347C27.495 10.5444 25.8365 10.8494 24 11.2401C22.1635 10.8494 20.505 10.5444 18.9344 10.3347C20.3889 10.8707 21.8637 11.5367 23.4281 12.2735C23.7775 12.438 24 12.7901 24 13.1763C24 12.7901 24.2225 12.438 24.5719 12.2735C26.1363 11.5367 27.6111 10.8707 29.0656 10.3347ZM24 36.4187C24 37.1531 23.234 37.6364 22.5649 37.3336C17.7454 35.1522 13.6821 33.9759 8.23384 34.9703C7.6002 35.0859 7 34.6112 7 33.9671V10.7733C6.27982 10.9178 5.53424 11.0833 4.75659 11.2707C4.31119 11.378 4 11.7783 4 12.2365V37.7749C4 38.4077 4.58268 38.8804 5.20425 38.7618C11.4168 37.5766 15.6049 37.4936 21.3258 38.3611C21.8219 39.3339 22.8331 40 24 40C25.1669 40 26.1781 39.3339 26.6742 38.3611C32.3951 37.4936 36.5832 37.5766 42.7957 38.7618C43.4173 38.8804 44 38.4077 44 37.7749V12.2365C44 11.7783 43.6888 11.378 43.2434 11.2707C42.4658 11.0833 41.7202 10.9178 41 10.7733V33.9671C41 34.6112 40.3998 35.0859 39.7662 34.9703C34.3179 33.9759 30.2546 35.1522 25.4351 37.3336C24.766 37.6364 24 37.1531 24 36.4187Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5375V33.967C8 33.9674 8 33.9678 8.00001 33.9681C8.00095 33.9694 8.003 33.9719 8.00678 33.9749C8.01286 33.9798 8.02054 33.9838 8.02856 33.9859C8.03554 33.9877 8.04358 33.9884 8.05429 33.9865C13.7857 32.9404 18.0681 34.2006 22.9773 36.4225C22.9823 36.4248 22.9847 36.4252 22.985 36.4252L22.9861 36.4252C22.9877 36.4251 22.9921 36.4242 22.9972 36.4209C22.9983 36.4202 22.9993 36.4195 23 36.4189C23 36.4189 23 36.419 23 36.4189V13.1772C17.6831 10.6732 13.6584 9.12233 8 10.5375ZM7.48401 8.60493C13.8784 6.99621 18.4649 8.83062 23.8542 11.3687C24.5553 11.6989 25 12.4043 25 13.1762V36.4187C25 37.8969 23.4678 38.8398 22.1526 38.2445C17.4227 36.1038 13.5785 35.0113 8.41339 35.954C7.20041 36.1754 6 35.2701 6 33.967V10.524C6 9.63895 6.589 8.83011 7.48401 8.60493Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M40 10.5375V33.967C40 33.9674 40 33.9678 40 33.9681C39.999 33.9694 39.997 33.9719 39.9932 33.9749C39.9871 33.9798 39.9795 33.9838 39.9714 33.9859C39.9645 33.9877 39.9564 33.9884 39.9457 33.9865C34.2143 32.9404 29.9319 34.2006 25.0227 36.4225C25.0177 36.4248 25.0153 36.4252 25.015 36.4252L25.0139 36.4252C25.0123 36.4251 25.0079 36.4242 25.0028 36.4209C25.0017 36.4202 25.0007 36.4193 25 36.4187C25 36.4186 25 36.4188 25 36.4187V13.1762C30.3169 10.6723 34.3416 9.12233 40 10.5375ZM40.516 8.60493C34.1216 6.99621 29.5351 8.83062 24.1458 11.3687C23.4447 11.6989 23 12.4052 23 13.1772V36.4189C23 37.8971 24.5322 38.8398 25.8474 38.2445C30.5773 36.1038 34.4215 35.0113 39.5866 35.954C40.7996 36.1754 42 35.2701 42 33.967V10.524C42 9.63895 41.411 8.83011 40.516 8.60493Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0104 29.0025C14.6795 28.9646 16.7269 29.3354 20.622 30.9258L21.378 29.0742C17.2509 27.389 14.9401 26.9618 10.9896 27.0027L11.0104 29.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0104 25.0025C14.6795 24.9646 16.7269 25.3354 20.622 26.9258L21.378 25.0742C17.2509 23.389 14.9401 22.9618 10.9896 23.0027L11.0104 25.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0104 21.0025C14.6795 20.9646 16.7269 21.3354 20.622 22.9258L21.378 21.0742C17.2509 19.389 14.9401 18.9618 10.9896 19.0027L11.0104 21.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 13V16H11.5V13H13.5Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M17 14V17H15V14H17Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5 15V18H18.5V15H20.5Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M36.9896 29.0025C33.3205 28.9646 31.2731 29.3354 27.378 30.9258L26.622 29.0742C30.7491 27.389 33.0599 26.9618 37.0103 27.0027L36.9896 29.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M36.9896 25.0025C33.3205 24.9646 31.2731 25.3354 27.378 26.9258L26.622 25.0742C30.7491 23.389 33.0599 22.9618 37.0103 23.0027L36.9896 25.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M36.9896 21.0025C33.3205 20.9646 31.2731 21.3354 27.378 22.9258L26.622 21.0742C30.7491 19.389 33.0599 18.9618 37.0103 19.0027L36.9896 21.0025Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M34.5 13V16H36.5V13H34.5Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M31 14V17H33V14H31Z" fill="#333333" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M27.5 15V18H29.5V15H27.5Z" fill="#333333" /> </svg>
                      {organizm.registrationNumber}
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div> : ''} */}
    </div>

  )
}
export default UserProfile