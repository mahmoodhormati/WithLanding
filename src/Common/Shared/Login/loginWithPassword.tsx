import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { GetUsersRoles, loginUser } from "../../../services/userService";
import { toast } from "react-toastify";
import { decodeToken } from '../../../Utils/decodeToken';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineReload } from "react-icons/ai"
import Captcha from "react-captcha-code";
import FadeLoader from "react-spinners/FadeLoader";
import { ClipLoader } from "react-spinners";
import { addUser } from "../../../store/Slice/user/userSlice";
import { userRoles } from "../../../store/Slice/user/userRole/userRoleSlice";
import axios from 'axios';
import { Field, Form, Formik } from "formik";
import { validateRequired, validatMobail } from "../../../Utils/validitionParams";
import { RootState } from "../../../store";
import { encryptMessage } from "../../../Utils/DecryptionUtill";

interface Props {
    value: any, onchange: any, setShows: any
}

const LoginWithPassword: React.FC<Props> = ({ value, onchange, setShows }) => {
    const [input, setInput] = useState('')
    const [valid, setValid] = useState(true)
    const [SHOW, setShow] = useState(false)
    const [, forceUpdate] = useState();
    const [captcha, setCaptcha] = useState<any>('');

    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();
    const location = useLocation()
    const dispatch = useDispatch();
    const select = useSelector((state: RootState) => state.user)
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const captchaRef: any = useRef()
    const [passwordType, setPasswordType] = useState("password");
    const togglePassword = (e: any) => {
        e.preventDefault()
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const handelCaptchaChange = useCallback((code: any) => {

        setCaptcha(code)

    }, [])

    const captchaChek = () => {

        if (SHOW) {
            if (captcha === input) {
                setValid(true)
            }
            else {
                setValid(false)
            }
        }

    }



   

    const handelBack = (e: any) => {
        e.preventDefault()
        navigate('sysplus')
    }
    const handelRefreshCaptcha = (e: any) => {
        e.preventDefault()
        captchaRef.current.refresh()
    }
    const handleSubmit = async () => {
        setLoading(true)



        const user = {

            phoneNumber: value,
            password
        }

        if (SHOW) {
            if (captcha === input) {
                try {



                    const { status, data } = await loginUser(user);
                    if (status === 200) {


                        setValid(true)
                        localStorage.setItem('mobile', user.phoneNumber)
                        localStorage.setItem('token', data.result.token);
                        localStorage.setItem('refresh', data.result.refresh);

                        axios.defaults.headers.common["Authorization"] = `Bearer ${data.result.token}`;
                        const response = await GetUsersRoles()

                        toast.success("ورود موفقیت آمیز بود", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined
                        });

                        dispatch(userRoles(response.data.result.userRoleIds))
                        localStorage.setItem("rd", encryptMessage(response.data.result.userRoleIds));

                        if (location.state?.from) {
                            navigate(location.state.from)
                       

                        }
                        else{
                        navigate('/client')
                        }
                    }



                    else {
                        setShow(true)
                        captchaRef.current.refresh()
                        toast.error(`${data.error.message}`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined
                        });

                    }

                    setLoading(false)




                }



                catch (error) {
                    setShow(true)

                    console.log(error);
                    setLoading(false)


                }

            }
            else {

                captchaRef.current.refresh()
                setLoading(false)
                toast.warning('کد امنیتی را اشتباه است', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }

        }
        else {
            try {



                const { status, data } = await loginUser(user);
                if (status === 200) {


                    setValid(true)
                    localStorage.setItem('mobile', user.phoneNumber)
                    localStorage.setItem('token', data.result.token);
                    localStorage.setItem('refresh', data.result.refresh);

                    axios.defaults.headers.common["Authorization"] = `Bearer ${data.result.token}`;
                    const response = await GetUsersRoles()

                    toast.success("ورود موفقیت آمیز بود", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });

                    dispatch(userRoles(response.data.result.userRoleIds))
                    localStorage.setItem("rd", encryptMessage(response.data.result.userRoleIds));


                   
                    if (location.state?.from) {
                        navigate(location.state.from)
                    
                        
                    }
                    else{
                    navigate('/client')
                    }

                }



                else {
                    setShow(true)
                    captchaRef.current.refresh()
                    toast.error(`${data.error.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });

                }

                setLoading(false)




            }



            catch (error) {
                setShow(true)

                console.log(error);
                setLoading(false)


            }
        }

    }



    return (

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
                    value,
                    password

                }}
                enableReinitialize={true}
                onSubmit={values => {
                    // same shape as initial values
                    handleSubmit()
                }}>
                {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                    <Form >
                        <div className='mt-5 textOnInput' style={{ direction: 'ltr' }}>
                            <label>شماره موبایل</label>

                            <Field type='text' name='value' className='form-control opacityForInput' placeholder='09121234567 ' maxLength="11"
                                value={value} onChange={onchange} validate={validatMobail} />



                        </div>
                        <div className='form-group' style={{ height: "20px" }}>
                            {errors.value && touched.value && <div className="text-danger">{String(errors.value)}</div>}

                        </div>
                        <div className=' textOnInput' style={{ direction: 'ltr' }}>
                            <label>رمز عبور</label>
                            <Field type={passwordType} name='password' className='form-control opacityForInput float-left' placeholder='******** '
                                value={password} onChange={(e: any) => {
                                    setPassword(e.target.value)
                                }} validate={validateRequired} />
                            {passwordType === 'password' ? <AiOutlineEye onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-94%', cursor: 'pointer', color: 'gray', marginTop: '5%' }} /> : <AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-94%', cursor: 'pointer', color: 'gray', marginTop: '5%' }} />}




                        </div>
                        <div className=' row mt-4' style={{ display: SHOW ? "flex" : "none" }} >
                            <div className='col-6 textOnInput' style={{ direction: 'ltr' }}>

                                <label>کد امنیتی</label>

                                <input className='form-control opacityForInput' value={input} onChange={e => setInput(e.target.value)} />

                            </div>
                            <div className="row" >
                                {/* <LoadCanvasTemplate reloadColor="black" reloadText={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/> </svg>`} /> */}
                                <button className="border-0" style={{ backgroundColor: '#ff000000' }} onClick={handelRefreshCaptcha}><AiOutlineReload size={30} color='#888ea8' /></button>

                                <Captcha height={30} fontSize={25} width={130} onChange={handelCaptchaChange} ref={captchaRef} />
                            </div>


                        </div>


                        <div className='form-group' style={{ height: "20px" }}>
                            {errors.password && touched.password && <div className="text-danger">{errors.password}</div>}

                        </div>
                        <div className='row'>
                            <div className="col-5">
                                <button type="submit" className='btn btn-success mt-5  mb-5 float-left' disabled={loading}>
                                    تایید

                                    <ClipLoader

                                        loading={loading}
                                        color="#ffff"
                                        size={15}
                                    />

                                </button>
                            </div>
                            <div className="col-7">
                                <button className=' btn btn-primary  mt-5 mb-5 float-right' onClick={() => setShows(false)}>ورود با رمز یکبار مصرف</button>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>


    )
}

export default LoginWithPassword