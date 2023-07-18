import { NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { CreateUser, GetUserData, SetUserRole } from "../../../services/userService";
import { GetAllOrganisation } from "../../../services/organisationService";
import Select from "react-select";
import { CreateCustomer, setCustomerInfo } from "../../../services/customerService";
import "./style.css"
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from "../../../store";
import { GetGroupWithCompany } from '../../../services/GroupService';
import {

    validatAlpha,
    validateEmail,
    validatmin10,
    validatMobail,
    validatPassword
} from "../../../Utils/validitionParams";
import { optionsRole } from './../../../Common/Enums/RolesEnums';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';


const AddNewUser: React.FC = () => {
    const navigate = useNavigate()
    const companies = useSelector((state: RootState) => state.companies)

    const params = useParams()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [nationalCode, setNationalCode] = useState('')
    const [organizationID, setOrganizationID] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirm, setPasswordConfirm] = useState(null)
    const [check, setChek] = useState(false);
    const [show, setShow] = useState(false)
    const [userRole, setuserRole] = useState<any>()


    const [active, setActive] = useState(true);
    const [actionBlock, SetactionBlock] = useState(false)
    const [loading, setLoading] = useState(false);
    let [userG, setUserG] = useState<any>()
    let [companyId, SetcompanyId] = useState<any>(companies.length>0?companies[0].id:null)
    let [companyName, SetCompanyName] = useState<any>(companies.length>0?companies[0].name:null)
    const [groupId, setGroupId] = useState(null)



    const [passwordType, setPasswordType] = useState("password");


    const togglePassword = (e: any) => {
        e.preventDefault()
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const showHandler = (e: any) => {
        setShow(e.target.checked)
    }
    
    const GetUsersGroup = async (companyId: any) => {
        if (companies.length === 1) {
            try {

                const { data, status } = await GetGroupWithCompany(1, companies[0].id);
             
                setUserG(data.result.groups)

            } catch (error) {

            }

        }
        else {
            try {
                const { data, status } = await GetGroupWithCompany(1, companyId);

                setUserG(data.result.groups)

            } catch (error) {

            }

        }


    }
    useEffect(() => {

        GetUsersGroup(companyId)

    }, [companyId])


    useEffect(() => {


        if (organizationId !== null) {
            setChek(true)
        }


    }, [organizationId])

    const submit = async (dataUser: any) => {
        setLoading(true)
        
   
let body={"customer":{ userName,
    email,
    firstName:firstName,
    lastName:lastName,
    nationalCode,
    organizationId,
    password,
    active,
    actionBlock,
    companyId:userRole===2?null:companyId,
    
    companyName:userRole===2?null:companyName
    
    ,groupId,maxValidityUnitId:0,maxValidity:0
}

}
     


        
        try {
            const { data, status } = await CreateCustomer(body)
            if (status === 200) {

                const userRoles = {
                    userRoleIds: [
                        userRole
                    ],
                    userId: data.result.id
                }


                await SetUserRole(userRoles)

                toast.success('کاربر با موفقیت ثبت شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                navigate(`/admin/editInfo/${data.result.id}`)
            }
            setLoading(false)

        } catch (err) {
            console.log(err)
            setLoading(false)

        }
      
        setLoading(false)

    }
    const getOrganizationId = async () => {
        try {
            const { data, status } = await GetAllOrganisation()
            setOrganizationID(data.result.organizationLists.values)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getOrganizationId()
    }, [])
    const OrganizationId = () => {
        return (organizationID.map((item: any) => ({ label: item.name, value: item.id })))
    }
    const OrganizationItem = () => {
        return (organizationID.filter((item: any) => item.id === organizationId).map((item: any) => ({ label: item.name, value: item.id })))
    }
    const Roles = () => {
        return (optionsRole.map((item: any) => ({ label: item.label, value: Number(item.value) })))
    }
    const UserGroups: any = () => {
        if (userG) {
            return (userG.map((item: any) => ({ label: item.name, value: item.id })))
        }
    }

    
    const companys = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }

    let defaultValue: any = companys()[0]



    return (

        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5> تعریف کاربر </h5>
                    <p>در این بخش می توانید کاربر جدید کنید</p>

                </div>
            </div>
            <div className='box-big row d-flex justify-content-center'>
                <div className='col-md-8 col-xs-12'>
                    <Formik initialValues={{

                        userName,
                        email,
                        firstName,
                        lastName,
                        nationalCode,
                        organizationId,
                        password,
                        active,
                        actionBlock,

                      



                    }}
                            enableReinitialize={true}

                            onSubmit={values => {
                            // same shape as initial values
                            submit(  values )
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (

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

                                                    <Field type="checkbox" className="form-check-input" name="active" />
                                                    فعال                                     </label>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11">

                                                <label className="form-check-label mb-3 text-danger font-weight-bold">

                                                    <Field type="checkbox" name="actionBlock" className="form-check-input" />
                                                    تعلیق کاربر                                  </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >شماره موبایل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="شماره موبایل" name="userName" validate={validatMobail} value={userName} onChange={(e:any) => setUserName(e.target.value)}/>

                                            {errors.userName && touched.userName && <div className="text-danger">{errors.userName}</div>}

                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >نام</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام" name="firstName" validate={validatAlpha}  value={firstName} onChange={(e:any)=>setFirstName(e.target.value)} />
                                            {errors.firstName && touched.firstName && <div className="text-danger">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4" >
                                            <label >نام خانوادگی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام خانوادگی" name="lastName" validate={validatAlpha} value={lastName} onChange={(e:any)=>setLastName(e.target.value)}/>
                                            {errors.lastName && touched.lastName && <div className="text-danger">{errors.lastName}</div>}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >کد ملی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="0070090602" maxLength="10" validate={validatmin10} name="nationalCode"  value={nationalCode} onChange={(e:any)=>setNationalCode(e.target.value)}/>
                                            {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >ایمیل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="email@example.com" name="email" validate={validateEmail}  value={email} onChange={(e:any)=>setEmail(e.target.value)}/>
                                            {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}

                                        </div>
                                        <div className={companies.length > 1 && userRole === 2 ? "col-lg-4 col-md-4 col-sm-11 mb-4 textOnInput" : "col-lg-6 col-md-6 col-sm-11 mb-4 textOnInput"}>

                                            <label> نقش کاربر</label>
                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                placeholder='تعیین نقش'
                                                options={Roles()}
                                                isClearable={true}
                                                onChange={(e: any) => {


                                                    setuserRole(Number(e.value))



                                                }

                                                }

                                            />


                                        </div>



                                        {companies.length > 1 && userRole!==2?
                                            <div className={userRole === 2 ? "col-lg-4 col-md-4 col-sm-11 mb-4 textOnInput" : "col-lg-6 col-md-6 col-sm-11 mb-4 textOnInput"}>

                                                <label> شرکت</label>
                                                <Select
                                                    menuShouldScrollIntoView ={false}
                                                    defaultValue={defaultValue}
                                                    placeholder='نام شرکت'
                                                    options={companys()}
                                                    key={defaultValue}
                                                    isClearable={true}
                                                    onChange={(e: any) => {


                                                        SetcompanyId(e.value)
                                                        SetCompanyName(e.label)


                                                    }

                                                    }

                                                />


                                            </div> : ''

                                        }
                                        {/* {userRole === 2 ?
                                        <div hidden={userRole === 2 ? false : true} className={companies.length > 1 ? "col-lg-4 col-md-4 col-sm-11 mb-4 textOnInput" : "col-lg-6 col-md-6 col-sm-11 mb-4 textOnInput"}>

                                            <label>گروه مشتری</label>
                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                placeholder='تعیین گروه'
                                                options={UserGroups()}
                                                isClearable={true}
                                                onChange={(e: any) => {


                                                    setGroupId(e.value)


                                                }

                                                }

                                            />


                                        </div>:''} */}

                                        {check === true ?
                                            <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                                <label >سازمان</label>
                                                <Select
                                                    menuShouldScrollIntoView ={false}
                                                    value={OrganizationItem()}
                                                    options={OrganizationId()}
                                                    onChange={(e: any) => setOrganizationId(e.value)}
                                                />
                                            </div> : ''}
                                        <div className='col-12 textOnInputForGrp '><input type='checkbox' checked={show} onChange={showHandler} /> تغییر رمز عبور </div>


                                        <div className="col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >رمز عبور</label>
                                            <Field type={passwordType} className="form-control opacityForInput float-left "  placeholder="*******" name="password" validate={validatPassword} value={password} onChange={(e: any) => {
                                                setPassword(e.target.value)
                                            }}/>
                                            {passwordType==='password'?<AiOutlineEye onClick={togglePassword} size={'1.2rem'}   id="togglePassword"  style={{marginRight: '-6%', cursor: 'pointer',color:'gray',marginTop:'2.5%'}}  />:<AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'}   id="togglePassword"  style={{marginRight: '-6%', cursor: 'pointer',color:'gray',marginTop:'2.5%'}}/>}
                                        </div>
                                        
                                        <div className=" col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >تکراررمز عبور</label>
                                            <input type={passwordType} className="form-control opacityForInput float-left  " placeholder="*******" value={passwordConfirm || ""} onChange={(e: any) => {
                                                setPasswordConfirm(e.target.value)
                                            }} />
                                            {passwordType==='password'?<AiOutlineEye onClick={togglePassword} size={'1.2rem'}   id="togglePassword" style={{marginRight: '-6%', cursor: 'pointer',color:'gray',marginTop:'2.5%'}}/>:<AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'}   id="togglePassword" style={{marginRight: '-6%', cursor: 'pointer',color:'gray',marginTop:'2.5%'}}/>}
                                        </div>
                                        {password !== passwordConfirm ?
                                            <p hidden={!show} className="text-danger">رمز عبور برابر نیست</p> : ''}
                                        <div className="form-group">
                                            <div className="form-check pl-0">
                                                <div className="custom-control custom-checkbox checkbox-info">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className='row'>
                                                <div className='col-6  '>
                                                    {show === true ?
                                                        <button  className="btn btn-success  " disabled={password === passwordConfirm ||!loading  ? false : true} onClick={submit}>تایید <ClipLoader

                                                        loading={loading}
                                                        color="#ffff"
                                                        size={15}
                                                    /></button> :
                                                        <button  className="btn btn-success  " disabled={!loading ? false : true}  onClick={submit}>تایید
                                                            <ClipLoader

                                                                loading={loading}
                                                                color="#ffff"
                                                                size={15}
                                                            />
                                                        </button>}
                                                </div>
                                                <div className='col-6  '>
                                                    <NavLink to='/admin/userlist' className="btn btn-danger float-right">بازگشت</NavLink>
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
export default AddNewUser