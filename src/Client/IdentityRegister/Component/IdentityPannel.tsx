import React, {useEffect, useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './style.css';
import AddresForm from './AddresForm';
import PersonIdetity from './PersonIdetity';
import { Link, Routes,Route } from 'react-router-dom';
import {useSelector} from "react-redux";
import {GetAddress} from "../../../services/addressService";
import {HiArrowLeft} from "react-icons/hi"
import  "../../../Utils/style.css"
import { RootState } from '../../../store';

const IdentityPannel :React.FC= () => {
    const user=useSelector((state:RootState)=>state.user);

    const [address , setAddress] = useState<any>()
    const GetAddresUser= async ()=>{
        const {data , status} = await GetAddress(1, user.id )
        setAddress(data.result.addresses)

    }
    useEffect(()=>{
        GetAddresUser()
    },[])
    return (
        <div className='user-progress'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تکمیل اطلاعات کاربری</h5>
                    <p>در این بخش می توانید وضعیت حساب کاربری خود را مشاهده کنید.</p>
                </div>
            </div>
            <div className='boxrow' >
                <Link to='/admin/personidentity'  className="m-auto rounded" style={{ color: user.nationalCode ? " green": " lightcoral", border: user.nationalCode ? " 1px solid green": " 1px solid lightcoral" , animation:user.nationalCode ? "none":"pulsered 2s infinite" }} >

                    <div className='col-lg-12 col-md-12 col-sm-2 col-xs-2 m-auto widget box shadow'  >


                        <div className='card-title text-left' >
                                <h5  style={{ color: user.nationalCode ? " green": " lightcoral"}} className='heading'>1.تکمیل مشخصات کاربری </h5>
                                {/* span baraye response server */}

                                {/* <span className='status'>تست ریسپانس</span> */}
                            </div>




                    </div>
                    {/*<p className='text-center ' style={{ margin:"0 auto", backgroundColor: user.nationalCode ? "green": "lightcoral", color:"white" , fontSize:"20px"}}>{user.nationalCode ? "✓"  : "x"} </p>*/}
                </Link>
                {user.nationalCode ? <HiArrowLeft  style={{margin:"auto 0 " ,color:"green"}} size={"3rem"}/> :  null}

                <Link to='/admin/addresform' className=' m-auto rounded' style={{ color:address && address.length !== 0 ?  " green": " lightcoral" ,border:address && address.lenght !==0 ? " 1px solid green": " 1px solid lightcoral" , animation: address && address.lenght!== 0 ? "none":"pulsered 2s infinite" }} >
                    
                
                    <div className='col-lg-12 col-md-12 col-sm-2 col-xs-2 m-auto widget box shadow'  >

                    

                   
                            <div className='card-title text-left'>
                                <h5  style={{ color: address && address.lenght!==0 ? " green": " lightcoral"}} className='heading'> 2.ثبت آدرس </h5>
                                   {/* span baraye response server */}
                                {/* <span className='status'>تست ریسپانس</span> */}
                            </div>
                       


                    </div>
                    {/*<p className='text-center ' style={{ margin:"0 auto", backgroundColor:address && address.lenght > 0 ? "green": "lightcoral" , color:"white" , fontSize:"20px"}}>{address && address.lenght > 0 ? "✓"  : "x"} </p>*/}

                </Link>
                {address && address.lenght>0 ? <HiArrowLeft  style={{margin:"auto 0 " ,color:"green"}} size={"3rem"}/> :  null}

               {/* <Link to='/personBankAccount' className='col-lg-2 col-md-2 col-sm-2 col-xs-2 m-auto widget box shadow' >*/}
               {/*     */}
               {/* */}
               {/*     <div className='text-center'>*/}

               {/*     */}

               {/*    */}
               {/*             <div className='card-title text-left'>*/}
               {/*                 <span className='heading'> 3.ثبت شماره حساب </span>*/}
               {/*                    /!* span baraye response server *!/*/}
               {/*                 /!* <span className='status'>تست ریسپانس</span> *!/*/}
               {/*             </div>*/}
               {/*        */}


               {/*     </div>*/}
               {/*   */}
               {/*  </Link>*/}
               {/*<div className='col-lg-2 col-md-2 col-sm-2 col-xs-2 m-auto widget box shadow' >*/}
               {/*     <div className='card-title text-left'>*/}


               {/*     </div>*/}
               {/* </div>*/}
            </div>
          
        </div>
    );
}

export default IdentityPannel;