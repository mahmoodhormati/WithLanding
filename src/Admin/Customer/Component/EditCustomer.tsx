import {NavLink, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {CreateUser, GetUserData} from "../../../services/userService";
import {GetAllOrganisationCode} from "../../../services/organisationService";
import Select from "react-select";
import {setCustomerInfo} from "../../../services/customerService";
import {Field, Form, Formik} from "formik";
import {validatAlpha, validateEmail, validatmin10, validatMobail, validatNumber} from "../../../Utils/validitionParams";
import {ClipLoader} from "react-spinners";
import {PriceUnitEnums} from "../../../Common/Enums/PriceUnit";

const EditCustomer:React.FC = () => {
    const navigate = useNavigate()
    const params =useParams()
    const [userName, setUserName]=useState('')
    const [email, setEmail]=useState('')
    const [maxValidity, setMaxValidity] = useState<any>(0)
    const [maxValidityUnitId, setMaxValidityUnitId] = useState(null)
    const [firstName, setFirstName]=useState('')
    const [lastName, setLastName]=useState('')
    const [nationalCode, setNationalCode]=useState('')
    const [organizationID, setOrganizationID]=useState([])
    const [organizationId, setOrganizationId]=useState(null)
    const [password, setPassword]=useState(null)
    const [passwordConfirm , setPasswordConfirm]=useState(null)
    const [check, setChek] = useState(false);
    const [active, setActive] = useState(false);
    const [show , setShow]=useState(false)
    const [groupId, setGroupId] = useState(null)
    const [actionBlock, SetactionBlock] = useState(false)
    const [passwordType, setPasswordType] = useState("password");
    const [loading, setLoading] = useState(false);
    const togglePassword = (e:any) => {
        e.preventDefault()
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const showHandler = (e:any) => {
        setShow(e.target.checked)
    }
    const dataUser={

        id:Number( params.id),
        userName,
        email,
        firstName,
        lastName,
        nationalCode,
        organizationId:check?organizationId:null,
        password,
        active,
        maxValidity:maxValidity ?maxValidity.replaceAll(",",""):maxValidity,
        maxValidityUnitId,
        actionBlock,
        groupId
    }

    const getUserInfo = async () => {
        try {
            const {data , status}= await GetUserData(params.id)
            setEmail(data.result.customer.email)
            setUserName(data.result.customer.userName)
            setFirstName(data.result.customer.firstName)
            setLastName(data.result.customer.lastName)
            setNationalCode(data.result.customer.nationalCode)
            setOrganizationId(data.result.customer.organizationId)
            setActive(data.result.customer.active)
            SetactionBlock(data.result.customer.actionBlock)
            setMaxValidity(formatter.format(data.result.customer.maxValidity))
            setMaxValidityUnitId(data.result.customer.maxValidityUnitId)
            setGroupId(data.result.customer.groupId)


        }catch (err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getUserInfo()
    },[])

    useEffect(()=>{


        if(organizationId !== null){
            setChek(true)
        }


    },[organizationId])
   
    const submit = async (dataUser:any)=>{
        try {
            const {data , status} = await setCustomerInfo(dataUser)

        }catch (err){
            console.log(err)
        }
        navigate('/admin/customerlist')

    }
    const getOrganizationId = async () => {
        try {
            const {data , status}= await GetAllOrganisationCode()
            setOrganizationID(data.result.organizationLists)
        }catch (err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getOrganizationId()
    },[])
    const OrganizationId = () => {
        return(organizationID.map((item:any)=>( {label: item.name ,  value:item.id}) ))
    }
    const OrganizationItem = () => {
        return(organizationID.filter((item:any)=>item.id === organizationId).map((item:any)=>( {label: item.name ,  value:item.id}) ))
    }

    const PriceUnitItem = () => {
        return (PriceUnitEnums.map((item:any) => ({ label: item.name, value: item.id })))
    }
    const PriceUnit = () => {
        return (PriceUnitEnums.filter((item:any) => item.id === maxValidityUnitId).map((item:any) => ({ label: item.name, value: item.id }))[0])
    }
    const handelNavigate = (e:any) => {
        e.preventDefault()
        navigate(-1)
    }
    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0, });

    return(

        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5> ویرایش کاربر </h5>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='widget box shadow col-md-4 col-xs-12'>

                    <Formik
                        initialValues={{

                            id:Number( params.id),
                            userName,
                            email,
                            firstName,
                            lastName,
                            nationalCode,
                            organizationId:check?organizationId:null,
                            password,
                            active,
                            maxValidity:maxValidity ?maxValidity.replaceAll(",",""):maxValidity,
                            maxValidityUnitId,
                            actionBlock,
                            groupId

                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit( values)
                        }}>
                        {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (

                            <Form  >

                                <div className="form-group  textOnInput col-12 ">

                                    <div className="form-row">

                                        <div className="col-12 mb-5 d-flex justify-content-between ">
                                            <div className="col-lg-4 col-md-6 col-sm-11 ">


                                                <label className="form-check-label mb-3">

                                                    <input type="checkbox" checked={check} className="form-check-input" onChange={e => setChek(e.target.checked)} />
                                                    حقوقی
                                                </label>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11">

                                                <label className="form-check-label mb-3">

                                                    <Field type="checkbox" className="form-check-input" name="active"  />
                                                    فعال                                     </label>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11">

                                                <label className="form-check-label mb-3 text-danger font-weight-bold">

                                                    <Field type="checkbox"  name="actionBlock" className="form-check-input" />
                                                    تعلیق کاربر                                  </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >شماره موبایل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="شماره موبایل" name="userName" validate={validatMobail} />

                                            {errors.userName && touched.userName && <div className="text-danger">{errors.userName}</div>}

                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >نام</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام" name="firstName"   validate={validatAlpha}/>
                                            {errors.firstName && touched.firstName && <div className="text-danger">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4" >
                                            <label >نام خانوادگی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام خانوادگی" name="lastName" validate={validatAlpha} />
                                            {errors.lastName && touched.lastName && <div className="text-danger">{errors.lastName}</div>}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >کد ملی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="0070090602" maxLength="10" validate={validatmin10} name="nationalCode"/>
                                            {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >ایمیل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="email@example.com" name="email" validate={validateEmail} />
                                            {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}

                                        </div>


                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >مقدار اعتبار </label>
                                            <Field type="text" className=" formater form-control opacityForInput" placeholder="100,000" validate={validatNumber}  name='maxValidity'  />
                                            {errors.maxValidity && touched.maxValidity && <div className="text-danger">{String(errors.maxValidity)}</div>}

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >واحد قیمت</label>
                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                value={PriceUnit()}
                                                placeholder="واحد قیمت"
                                                options={PriceUnitItem()}
                                                onChange={(e:any) => setMaxValidityUnitId(e.value)}
                                            />
                                        </div>



                                        {check === true ?
                                            <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                                <label >شرکت</label>
                                                <Select
                                                    menuShouldScrollIntoView ={false}
                                                    value={OrganizationItem()}
                                                    options={OrganizationId()}
                                                    onChange={(e:any) => setOrganizationId(e.value)}
                                                />
                                            </div> : ''}
                                        <div className='col-12 textOnInputForGrp '><input type='checkbox' checked={show} onChange={showHandler} /> تغییر رمز عبور </div>


                                        <div className="input-group col-lg-5 col-md-6 col-sm-11 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >رمز عبور</label>
                                            <Field type={passwordType} className="form-control opacityForInput  " style={{ borderLeft: 'none' }} placeholder="*******" name="password" onChange={(e:any) => {
                                                setPassword(e.target.value)
                                            }} />

                                            <div className="input-group-append ">

                                                <button className=" btn-outline-primary box-shadow-none rounded" onClick={togglePassword} style={{ border: 'none' }}>
                                                    {passwordType === "password" ? <svg style={{ color: "blue" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" fill="blue"></path> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="blue"></path> </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" /> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" /> <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" /> </svg>}</button>
                                            </div>
                                            <hr/>

                                        </div>

                                        <div className="col-1"></div>
                                        <div className="input-group col-lg-5 col-md-6 col-sm-11 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >تکراررمز عبور</label>
                                            <input type={passwordType} className="form-control opacityForInput  " style={{ borderLeft: 'none' }} placeholder="*******" value={passwordConfirm || ""} onChange={(e:any) => {
                                                setPasswordConfirm(e.target.value)
                                            }} />
                                            <div className="input-group-append ">
                                                <button className=" btn-outline-primary box-shadow-none rounded" onClick={togglePassword} style={{ border: 'none', outline: 'none' }}>
                                                    {passwordType === "password" ? <svg style={{ color: "blue" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" fill="blue"></path> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="blue"></path> </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" /> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" /> <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" /> </svg>}</button>
                                            </div>

                                        </div>

                                        {password !== passwordConfirm ?
                                            <p hidden={!show} className="d-block text-danger">رمز عبور برابر نیست</p> : ''}

                                        <div className="col-12">
                                            <div className='row'>
                                                <div className='col-lg-6 col-md-6 col-sm-12 mb-1 '>
                                                    {show === true ?
                                                        <button type="submit" className="btn btn-success  " disabled={password !== passwordConfirm } >تایید</button> :
                                                        <button type="submit" className="btn btn-success  " disabled={!loading ? false:true} >تایید
                                                            <ClipLoader

                                                                loading={loading}
                                                                color="#ffff"
                                                                size={15}
                                                            />
                                                        </button>}
                                                </div>
                                                <div className='col-lg-6 col-md-6 col-sm-12 mb-1'>
                                                    <button onClick={handelNavigate} className="btn btn-danger   float-right">بازگشت</button>
                                                </div>
                                            </div>
                                        </div>
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
export default EditCustomer