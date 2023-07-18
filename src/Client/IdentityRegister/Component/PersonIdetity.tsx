
import React, { useState, useRef, useEffect } from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-multi-date-picker/styles/layouts/prime.css";
import { useSelector, useDispatch } from 'react-redux';
import { GetOrganisationCode, SetOrganisation } from '../../../services/organisationService';
import { setCustomerInfo } from '../../../services/customerService';
import { GetUserInfo } from '../../../services/userService';
import {validatAlpha, validateEmail, validatmin10} from "../../../Utils/validitionParams";
import {Field, Form, Formik} from "formik";
import { RootState } from '../../../store';


const PersonIdetity:React.FC = () => {
    const navigate=useNavigate()

    const [, forceUpdate] = useState();
    const [userData, setUserData] = useState({});
    const [Click, setClick] = useState(false);
    const [check, setChek] = useState(false);
    const userinfo = useSelector((state:RootState) => state.user);
    const dispatch = useDispatch();
    const [nationalId, SetnationalId] = useState('');
    const [formDisable, setformDisable] = useState(true);
    const [password, setPassword]=useState<any>(null)
    const [passwordConfirm , setPasswordConfirm]=useState(null)
    const [companyName, setcompanyName] = useState('');
    const [companyRegister, setcompanyRegister] = useState('');
    const [firstName, setfirstName] = useState(userinfo.firstName);
    const [lastName, setlastName] = useState(userinfo.lastName);
    const [nationalCode, setnationalCode] = useState(userinfo.nationalCode);
    const [email, setemail] = useState(userinfo.email);
    const [show , setShow]=useState(false)
    const [passwordType, setPasswordType] = useState("password");
    const togglePassword = (e:any) => {
        e.preventDefault()
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const user = {
        id: userinfo.id,
        userName: userinfo.userName,
        email,
        firstName,
        lastName,
        requireInfo: true,
        nationalCode,
        organizationId: null,
        active:true
    }

    const organ = {
        organization: {
            id: 0, parentId: 0,
            name: companyName, nationalId, registrationNumber: companyRegister
        }
    }


    const handelSetCustomer = async () => {

        try {

            const { data, status } = await setCustomerInfo(user);
            if (data.success) {

                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                const { data, status } = await GetUserInfo();

navigate('/admin/identitypannel')
            }


        } catch (error) {

           
        }
    }

    const handelSetOrganisation = async () => {

        try {

            const { data, status } = await SetOrganisation(organ);
            if (status === 200) {

                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

                setformDisable(false);
            }


        } catch (error) {
            toast.error("خطایی از سمت سرور رخ داده است", {
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
    const showHandler = () => {

        setShow(!show)
    }
    const handelSubmit = () => {
        try {


                if (check) {
                    handelSetOrganisation();
                    handelSetCustomer();
                }
                else {
                    handelSetCustomer();
                }

            } catch (error) {

        }



    }

    if (!check) {

        return (
            <div className='user-progress' >
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                        <h5 >تکمیل اطلاعات کاربری</h5>
                        <p>در این بخش می توانید وضعیت حساب کاربری خود را مشاهده کنید.</p>
                    </div>
                </div>
                <div className='row d-flex justify-content-center '>
                    <div className='widget box shadow col-4'>

                        <Formik
                            initialValues={{
                                id: userinfo.id,
                                userName: userinfo.userName,
                                email,
                                firstName,
                                lastName,
                                requireInfo: true,
                                nationalCode,
                                organizationId: null,
                                parentId: 0,
                                name: companyName, nationalId, registrationNumber: companyRegister

                            }}
                            enableReinitialize={true}
                            onSubmit={values => {
                                // same shape as initial values
                                handelSubmit()
                            }}>
                            {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (



                                <Form  >
                            <div className="n-chk">


                                <label className="form-check-label mb-3">
                                    <input type="checkbox" className="form-check-input" onChange={e => setChek(e.target.checked)} />
                                    شخص حقوقی هستم
                                </label>
                            </div>
                            <div className="form-group mb-4 textOnInput  align-content-between">

                                <label >نام</label>
                                <Field name="firstName" validate={validatAlpha}  type="text" className="form-control opacityForInput" placeholder="نام" value={firstName } onChange={
                                    (e:any) => {
                                        setfirstName(e.target.value);
                                    }} />
                                {errors.firstName && touched.firstName && <div className="text-danger">{errors.firstName}</div>}
                            </div>
                            <div className="form-group mb-4 textOnInput">
                                <label >نام خانوادگی</label>
                                <Field type="text" className="form-control opacityForInput" placeholder="نام خانوادگی" value={lastName } onChange={(e:any) => {
                                    setlastName(e.target.value)
                                }} name="lastName" validate={validatAlpha} />
                                {errors.lastName && touched.lastName && <div className="text-danger">{errors.lastName}</div>}
                            </div>
                            <div className="form-group mb-4 textOnInput">
                                <label >کد ملی</label>
                                <Field type="text" className="form-control opacityForInput" placeholder="0070090602" value={nationalCode } onChange={(e:any) => {
                                    setnationalCode(e.target.value)
                                }} name="nationalCode"  validate={validatmin10}/>
                                {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}
                            </div>


                            <div className="form-group mb-4 textOnInput">
                                <label >ایمیل</label>
                                <Field type="text" className="form-control opacityForInput" placeholder="email@example.com" value={email} onChange={(e:any) => {
                                    setemail(e.target.value)
                                }} name='email' validate={validateEmail}/>
                                {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}
                            </div>


                            <div><input type='checkbox' checked={show} onClick={showHandler}/> تغییر رمز عبور </div>
                            {show === true?
                                <>
                                    <div className="input-group col-12 mb-5 mt-4 textOnInputForGrp rounded"  hidden={!show}>
                                        <label >رمز عبور</label>
                                        <input type={passwordType}  className="form-control opacityForInput" placeholder="*******" value={password } onChange={(e:any) => {
                                            setPassword(e.target.value)
                                        }} />
                                        <div className="input-group-append ">
                                            <button className=" btn-outline-primary box-shadow-none rounded"
                                                    onClick={togglePassword} style={{border: 'none'}}>
                                                {passwordType === "password" ? <svg style={{color: "blue"}}
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16" height="16"
                                                                                    fill="currentColor"
                                                                                    className="bi bi-eye"
                                                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                                                        fill="blue"></path>
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                                                        fill="blue"></path>
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                              height="16" fill="currentColor"
                                                              className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                </svg>}</button>
                                        </div>

                                    </div>
                                    <div className="input-group col-12 mb-5 mt-4 textOnInputForGrp rounded"  hidden={!show}>
                                        <label >تکرار مرز عبور</label>
                                        <input type={passwordType}  className="form-control opacityForInput" placeholder="*******" value={passwordConfirm || " "} onChange={(e:any) => {
                                            setPasswordConfirm(e.target.value)
                                        }} />
                                        <div className="input-group-append ">
                                            <button className=" btn-outline-primary box-shadow-none rounded"
                                                    onClick={togglePassword} style={{border: 'none'}}>
                                                {passwordType === "password" ? <svg style={{color: "blue"}}
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16" height="16"
                                                                                    fill="currentColor"
                                                                                    className="bi bi-eye"
                                                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                                                        fill="blue"></path>
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                                                        fill="blue"></path>
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                              height="16" fill="currentColor"
                                                              className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                </svg>}</button>
                                        </div>


                                    </div>
                                    {password !== passwordConfirm ?
                                        <span  className="text-danger ">رمز عبور برابر نیست</span> : ''}
                                </>:''
                            }



                            <div className="form-group">
                                <div className="form-check pl-0">
                                    <div className="custom-control custom-checkbox checkbox-info">

                                    </div>
                                </div>
                            </div>
                            <div className='row justify-content-between'>
                                <div className='col '>
                                    <button type="submit" className="btn btn-success " disabled={Click} >تایید</button>
                                </div>
                                <div className='col-3 '>
                                    <NavLink to='/admin/identitypannel' className="btn btn-danger">بازگشت</NavLink>
                                </div>
                            </div>





                                </Form>
                            )}
                        </Formik>
                    </div >
                </div >
            </div>

        )
    }
    else {

        const handelCheckCompanyCode = async (event:any) => {
            event.preventDefault();
            const NationalId = nationalId
            try {


                const { data, status } = await GetOrganisationCode(NationalId);
                if (data.result.organization === null) {
                    
                    setformDisable(false);
                    setcompanyName('');
                    setcompanyRegister('');



                }
                else {
                    setcompanyName(data.result.organization.name);
                    setcompanyRegister(data.result.organization.name);
                }

            } catch (error) {
                console.log(error)
            }

        }

        return (
            <div className='user-progress' >
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                        <h5 >تکمیل اطلاعات کاربری</h5>
                        <p>در این بخش می توانید وضعیت حساب کاربری خود را مشاهده کنید.</p>
                    </div>
                </div>
                <div className='row d-flex justify-content-center '>
                    <div className='widget box shadow col-4'>

                        <Formik
                            initialValues={{
                                id: userinfo.id,
                                userName: userinfo.userName,
                                email,
                                firstName,
                                lastName,
                                requireInfo: true,
                                nationalCode,
                                organizationId: null,
                                parentId: 0,
                                name: companyName, nationalId, registrationNumber: companyRegister
                            }}
                            enableReinitialize={true}
                            onSubmit={values => {
                                // same shape as initial values
                                handelSubmit()
                            }}>
                            {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (



                                <Form  className='form' >
                            <div className="n-chk">


                                <label className="form-check-label mb-3">
                                    <input type="checkbox" className="form-check-input" onChange={(e:any) => setChek(e.target.checked)} />
                                    شخص حقوقی هستم
                                </label>
                            </div>
                                    <div className="form-group mb-4 textOnInput  align-content-between">

                                        <label >نام</label>
                                        <Field name="firstName" validate={validatAlpha}  type="text" className="form-control opacityForInput" placeholder="نام" value={firstName || ""} onChange={
                                            (e:any) => {
                                                setfirstName(e.target.value);
                                            }} />
                                        {errors.firstName && touched.firstName && <div className="text-danger">{errors.firstName}</div>}
                                    </div>
                                    <div className="form-group mb-4 textOnInput">
                                        <label >نام خانوادگی</label>
                                        <Field type="text" className="form-control opacityForInput" placeholder="نام خانوادگی" value={lastName || ""} onChange={(e:any) => {
                                            setlastName(e.target.value)
                                        }} name="lastName" validate={validatAlpha} />
                                        {errors.lastName && touched.lastName && <div className="text-danger">{errors.lastName}</div>}
                                    </div>
                                    <div className="form-group mb-4 textOnInput">
                                        <label >کد ملی</label>
                                        <Field type="text" className="form-control opacityForInput" placeholder="0070090602" value={nationalCode ||""} onChange={(e:any) => {
                                            setnationalCode(e.target.value)
                                        }} name="nationalCode"  validate={validatmin10}/>
                                        {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}
                                    </div>


                                    <div className="form-group mb-4 textOnInput">
                                        <label >ایمیل</label>
                                        <Field type="text" className="form-control opacityForInput" placeholder="email@example.com" value={email || ""} onChange={(e:any) => {
                                            setemail(e.target.value)
                                        }} name='email' validate={validateEmail}/>
                                        {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}
                                    </div>

                            <br />
                            <div className="form-group mb-4 textOnInput">

                                <label >شماره ملی شرکت</label>
                                <div className='form-row justify-content-center'>
                                    <input type="text" className="form-control opacityForInput col" value={nationalId || ""} onChange={(e:any) => { SetnationalId(e.target.value)}} placeholder="12345678912" />
                                    <button type='submit' className='btn btn-outline-primary col-4 ' onClick={handelCheckCompanyCode}>استعلام </button>

                                </div>


                            </div>
                            <div className="form-group mb-4 textOnInput ">
                                <label >نام شرکت</label>
                                <input type="text" className="form-control opacityForInput" disabled={formDisable} value={companyName || ""} onChange={(e:any) => {
                                    setcompanyName(e.target.value)
                                }} placeholder="نام شرکت" />

                            </div>
                            <div className="form-group  textOnInput ">
                                <label >شماره ثبت</label>
                                <input type="text" className="form-control opacityForInput" disabled={formDisable} value={companyRegister || ""} onChange={(e:any) => {
                                    setcompanyRegister(e.target.value)
                                }} placeholder="شماره ثبت" />

                            </div>
                            <div><input type='checkbox' checked={show} onClick={showHandler}/> تغییر رمز عبور </div>
                            {show === true?
                                <>
                                    <div className="form-group m-4 textOnInput">
                                        <label >رمز عبور</label>
                                        <input type="password" className="form-control opacityForInput" placeholder="*******" value={password || ""} onChange={(e:any) => {
                                            setPassword(e.target.value)
                                        }} />
                                    </div>
                                    <div className="form-group m-4 textOnInput">
                                        <label >تکرار مرز عبور</label>
                                        <input type="password" className="form-control opacityForInput" placeholder="*******" value={passwordConfirm || ""} onChange={(e:any) => {
                                            setPasswordConfirm(e.target.value)
                                        }} />
                                        {password !== passwordConfirm ?
                                            <p  className="text-danger">رمز عبور برابر نیست</p> : ''}

                                    </div> </>:''
                            }


                            <div className='row justify-content-between'>
                                <div >
                                    <button type="submit" className="btn btn-success " disabled={Click}  >تایید</button>
                                </div>
                                <div >
                                    <NavLink to='/admin/identitypannel' className="btn btn-danger">بازگشت</NavLink>
                                </div>
                            </div>



                                        </Form>
                                        )}
                                </Formik>
                    </div >
                </div >
            </div>

        )
    }
}

export default PersonIdetity