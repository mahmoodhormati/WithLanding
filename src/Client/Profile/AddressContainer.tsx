import React, { Fragment,useEffect,useState } from 'react'
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { GetAddress, GetAllProvince } from '../../services/addressService';



const AddressContainer :React.FC= () => {
    const [address, setAddress] = useState<any>([]);
    const [province, setProvince] = useState<any>([]);

    const Navigate=useNavigate()
    const hadelNewAdrress = () => {
        Navigate("/client/newAddress");
      };
      useEffect(() => {
        getProvince()
        fetchApi()
    
    },[])


      const getProvince = async () => {
        const { data, status } = await GetAllProvince();
        setProvince(data.result.provinces);
      };
      async function fetchApi() {
        const { data, status } = await GetAddress(
          1,
          Number(localStorage.getItem("connect"))
        );
        setAddress(data.result.addresses);
      }




      const cities = province.filter((data: any) => data.parentId !== null);
      const CitiesrenderList = (id: any) => {
        return cities
          .filter((item: any) => item.id === id)
          .map((data: any) => data.name);
      };   
      
      


  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 layout-top-spacing py-3 px-0 m-0">
        <div className="user-profile layout-spacing">
          <div className=" dashboard-widget widget-content widget-content-area dashboard-widget pb-1">
            <div className="d-flex justify-content-center p-3 addressHeader">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512"><title>ionicons-v5-n</title>
                <path d="M256,48c-79.5,0-144,61.39-144,137,0,87,96,224.87,131.25,272.49a15.77,15.77,0,0,0,25.5,0C304,409.89,400,272.07,400,185,400,109.39,335.5,48,256,48Z"
                      style={{
                        fill: "none",
                        stroke:"#000",
                        strokeLinecap:"round",
                        strokeLinejoin:"round",
                        strokeWidth:"32px"}}
                />
                <circle cx="256" cy="192" r="48" style={{
                fill: "none",
                stroke:"#000",
                strokeLinecap:"round",
                strokeLinejoin:"round",
                strokeWidth:"32px"}}/></svg>
              <h5 className=""> آدرس ها</h5>
            </div>

            <div className="text-center ">
              <div className="">
              <div className="row m-auto text-center addressFiled ">
                {address.length !==0 ? (
                  address.map((item: any , index:any) => (
                    < Fragment key={index} >
                      <div className=" col-lg-6">
                        <div  className=" addressUser">
                        <p className="">
                         آدرس :
                          {item.fullAddress}
                        </p>
                        <p className="">
                          کدپستی :
                          {item.postalCode}
                        </p>

                        <p className="">
                        تلفن همراه : 
                          {item.receiverMobile}
                        </p>
                        </div>
                      </div>
                    </Fragment>
                  ))
                ) : (
                  <span className="p-3"> شما هیچ آدرسی ثبت نکردید</span>
                )}
                </div>
                <div className="addAddressUser">
                 
                  <MdOutlineAddLocationAlt   onClick={hadelNewAdrress} size="3rem"/>
                  <br/>
                  ثبت آدرس جدید
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AddressContainer