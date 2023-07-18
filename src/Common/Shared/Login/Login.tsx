import React, { useState, useRef } from 'react';
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { loginUser } from '../../../services/userService';
import { toast } from 'react-toastify';
import './customCss.css';

import { BiArrowBack } from 'react-icons/bi';
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatMobail } from "../../../Utils/validitionParams";
import { RootState } from '../../../store';
import LoginWithPassword from './loginWithPassword';
import CodeForMobile from './CodeForMobile';
const afra = require('./afra.jpg');



const Login: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [, forceUpdate] = useState();
    const history = useNavigate();
    const [click, setClick] = useState(false);
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtp, SetShowOtp] = useState(false)



    const handelBack = (e: any) => {
        e.preventDefault()
        history('sysplus')
    }
    let d = new Date();
    d.setTime(d.getTime() + (60 * 2000));
    let expires = d.toUTCString();

    const dataLogin = {
        expiresAt: expires,
    }
    function getDataLogin() {
        let items = JSON.parse(String(sessionStorage.getItem('dataLogin')));
        return items ? items : ''


    }
    const handleSubmit = async () => {

        setLoading(true)
        setClick(true);
        const user = {

            phoneNumber: mobile

        }
        const resetForm = () => {
            setMobile('');

        }

        try {



            if (getDataLogin().expiresAt < new Date().toUTCString()) {

                sessionStorage.removeItem("dataLogin")


            }
            if (getDataLogin().expiresAt) {
                toast.warning('لطفا چند دقیقه بعد امتحان کنید', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined

                });


            }
            if (!getDataLogin().expiresAt) {
                const { status, data } = await loginUser(user);
                setLoading(false)
                if (data.success === true) {
                    toast.success("کد برای تلفن همراه شما ارسال شد", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined

                    });
                    setLoading(true)
                    localStorage.setItem('mobile', user.phoneNumber)
                    resetForm();
                   SetShowOtp(true)
                }
                sessionStorage.setItem('dataLogin', JSON.stringify(dataLogin));
            }
        }
        catch (error) {

            setClick(false);
            SetShowOtp(false)
        }
        setLoading(false)
    }

    let mobileNo;
    if (mobile) {
        mobileNo = mobile
    }

  if(!showOtp)  return (
        <div className='auth' >
            <div className='card'>
                <div className='row no-gutters'>
                    <div className='col-md-5'>
                        {show === true ?
                            <>
                                <LoginWithPassword setShows={setShow} value={mobileNo} onchange={(e: any) => {
                                    setMobile(e.target.value)
                                    localStorage.setItem('mobile', mobile)
                                }} />
                            </> :
                            <div className='card-body'>

                                <div className='row'>
                                    <h4 className="col-10">
                                        ورود
                                    </h4>
                                    {/* <BiArrowBack className="col-2 text-left"  size="20px" title="بازگشت به صفحه اصلی" onClick={handelBack}/> */}
                                </div>
                                <p className='mt-5'>برای استفاده از خدمات هولدینگ افرا، وارد حساب کاربری خود شوید .</p>


                                <Formik
                                    initialValues={{
                                        mobile

                                    }}
                                    enableReinitialize={true}
                                    onSubmit={values => {
                                        // same shape as initial values
                                        handleSubmit()
                                    }}>
                                    {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                                        <Form >
                                            <div className=' mt-5 textOnInput ' style={{ direction: 'ltr' }} >
                                                <label>شماره موبایل</label>

                                                <Field type='text' name='mobile' className='form-control opacityForInput' value={mobile} placeholder='09121234567 ' maxLength="11" onChange={(e: any) => {
                                                    setMobile(e.target.value)
                                                }} validate={validatMobail} />

                                                {errors.mobile && touched.mobile && <div className="text-danger">{errors.mobile}</div>}


                                            </div>
                                            <div className='form-group' style={{ height: "20px" }}>
                                            </div>
                                            <div className='row'>


                                                <div className="col-6">
                                                    <button className='  btn btn-success mt-5 mb-5 float-left' disabled={loading}>
                                                        تایید و ادامه
                                                        <ClipLoader

                                                            loading={loading}
                                                            color="#ffff"
                                                            size={15}
                                                        />
                                                    </button>

                                                </div>
                                                <div className="col-6">

                                                    <button className='   btn btn-primary mt-5 mb-5 float-right' onClick={() => setShow(true)}>ورود با رمز عبور</button>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                            </div>
                        }
                    </div>
                    <div className='col-md-7'>
                        <img className='card-img h-100' src={afra} alt="" />
                    </div>

                </div>
            </div>
        </div>
    )
    else{
        return(<CodeForMobile SetShowOtp={SetShowOtp}/>)
    }
}
export default Login;
