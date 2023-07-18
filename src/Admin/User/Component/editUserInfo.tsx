import { NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState, } from "react";
import { useSelector } from "react-redux";
import { CreateUser, GetUserData, SetUserRole } from "../../../services/userService";
import { GetAllOrganisation } from "../../../services/organisationService";
import Select from "react-select";
import { setCustomerInfo } from "../../../services/customerService";
import "./style.css"
import { PriceUnitEnums } from "../../../Common/Enums/PriceUnit";
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import {
    validatAlpha,
    validateEmail,
    validatmin10,
    validatMobail, validatNumber,
    validatPassword
} from "../../../Utils/validitionParams";
import { RootState } from "../../../store";
import { GetUsersRolesById } from '../../../services/userService';
import { optionsRole } from './../../../Common/Enums/RolesEnums';
import { GetGroupWithCompany } from "../../../services/GroupService";
import { FintotechCheck } from '../../../services/outScopeService';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { GetCompanyEntityAccess } from "../../../services/companiesService";
import QueryString from "qs";
import { dataIndexOf } from "react-widgets/cjs/Accessors";
import EntityAccessModal from "./EntityAccessModal";
import { GetPhoneBook } from "../../../services/phoneService";
import OtherPhones from "../../../Common/Shared/Common/OtherPhones";
import { PhoneTypes } from "../../../Common/Enums/PhoneTypes";

const EditUserInfo: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [userName, setUserName] = useState('')
    const [maxValidity, setMaxValidity] = useState<any>(0)
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [nationalCode, setNationalCode] = useState('')
    const [organizationID, setOrganizationID] = useState([])
    const [userRole, setuserRole] = useState<any>([])
    const [user, setUser] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [maxValidityUnitId, setMaxValidityUnitId] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordConfirm, setPasswordConfirm] = useState(null)
    const [check, setChek] = useState(false);
    const [actionBlock, SetactionBlock] = useState(false)
    const [show, setShow] = useState(false)
    const [active, setActive] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [groupId, setGroupId] = useState<any>()
    let [companyId, SetcompanyId] = useState<any>(null)
    let [companyName, SetCompanyName] = useState<any>()
    let [userG, setUserG] = useState<any>()
    const [EntityAccesses, SetEntityAccesses] = useState<any>([])
    const [entityAccessCompanies,SetEntityAccessCompanies]=useState<any>([])
    const [accessOpen, SetAccessOpen] = useState(false)
    const [item, SetItem] = useState<any>(0)
    const [CurenntPhone, SetCurrentPhone] = useState<any>(0)
    const [phoneBook, SetphoneBook] = useState<any>([])
    const [OtherPhoneOpen, SetOtherPhoneOpen] = useState(false)

    const companies = useSelector((state: RootState) => state.companies)

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


    const openModalAccess = (item: any) => {
        if (item!==null) {
            SetItem(item)
        }
        else{
            SetItem(null)
        }
        SetAccessOpen(true)
    }
    const CloseModalAccess = () => {

        SetAccessOpen(false)
        SetItem(null)
        entityAccess()
    }

    const openOtherPhones = (item: any) => {
        if (item !== 0) {
            SetCurrentPhone(item)
        }
        SetOtherPhoneOpen(true)
    }
    const CloseModalOtherPhones = () => {

        SetOtherPhoneOpen(false)
        SetCurrentPhone(null)
        GetPhones()
    }
    const GetUsersGroup = async () => {

      
      
            let groups = []

            for (let i = 0; i < entityAccessCompanies.length; i++) {

                try {

                    const { data, status } = await GetGroupWithCompany(1, entityAccessCompanies[i]);
                    groups.push(...data.result.groups)

                } catch (error) {
                    console.log(error);

                }



            }


            setUserG(groups)


        


    }

console.log(params.id);

    const GetPhones = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                EntityTypeId: 1,
                EntityId: params.id,
                IsAdmin: true


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {

            const { data, status } = await GetPhoneBook(config)

            if (status === 200) {

                SetphoneBook(data.result.phoneBook)
            }

        } catch (error) {

            console.log(error);

        }


    }

    const entityAccess = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                EntityTypeId: 1,
                EntityId: params.id



            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {

            const { data, status } = await GetCompanyEntityAccess(config)

            if (status === 200) {

                SetEntityAccesses(data.result.companyEntityAccesses)
                SetEntityAccessCompanies(data.result.companyEntityAccesses.map((item:any)=>item.companyId))
            }

        } catch (error) {

            console.log(error);

        }


    }

    const getUserInfo = async () => {

        try {
            const { data, status } = await GetUserData(Number(params.id))
            if (status === 200) {
                setUser(data.result.customer)
                setEmail(data.result.customer.email)
                SetcompanyId(data.result.customer.companyId)
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
            }


        } catch (err) {
            console.log(err)
        }
    }

    const getGroupsbyEntity = async () => {

        try {
            const { data, status } = await GetGroupWithCompany(1, 2)
            setUserG(data.result.groups)
        } catch (error) {

        }

    }
    const getuserRole = async (id: number) => {

        const { data, status } = await GetUsersRolesById(id)

        if (status === 200) {
            setuserRole(data.result.userRoleIds)

        }


    }

    useEffect(() => {
        getGroupsbyEntity()
        getUserInfo()
        getuserRole(Number(params.id))
        entityAccess()
        GetPhones()
    }, [params.id])


    useEffect(() => {



        GetUsersGroup()


    }, [entityAccessCompanies])



    useEffect(() => {


        if (organizationId !== null) {
            setChek(true)
        }


    }, [organizationId])

    const body = {
        id: Number(params.id),
        userName,
        email,
        firstName: firstName,
        lastName: lastName,
        nationalCode,
        organizationId: check ? organizationId : null,
        password,
        active,
        maxValidity: 0,
        maxValidityUnitId: 0,
        actionBlock,
        groupId,
        companyId: userRole[0] === 2 ? null : companyId
        , companyName: userRole[0] === 2 ? null : companyName
    }
    const submit = async () => {
        setLoading(true)
        try {
            const userrole = {
                "userRoleIds": [
                    userRole[0]
                ],
                "userId": Number(params.id)
            }
            const { data, status } = await SetUserRole(userrole)
        } catch (error) {

        }
        try {
            const { data, status } = await setCustomerInfo(body)
            if (status === 200) {
                toast.success('کاربر با موفقیت ثبت شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                setLoading(false)
                navigate('/admin/userlist')

            }
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
    const PriceUnitItem = () => {
        return (PriceUnitEnums.map((item: any) => ({ label: item.name, value: item.id })))
    }
    const PriceUnit = () => {
        return (PriceUnitEnums.filter((item: any) => item.id === maxValidityUnitId).map((item: any) => ({ label: item.name, value: item.id }))[0])
    }

    const Roles = () => {
        return (optionsRole.map((item: any) => ({ label: item.label, value: Number(item.value) })))
    }

    let defaulRoleValue: any = Roles().filter((item: any) => item.value === userRole[0])[0]

    const UserGroups: any = () => {
        if (userG) {
            return (userG.map((item: any) => ({ label: `${item.name} (${item.companyName})`, value: item.id })))
        }
    }

    const groupsForAccess: any = () => {
        if (userG) {
            return (userG.map((item: any) => ({ label: item.name, companyId: item.companyId, companyName: item.companyName, value: item.id })))
        }
    }

    let defaultUserGroup: any = (userG) ? UserGroups().filter((item: any) => item.value === groupId) : { label: 'تعیین نشده', value: null }

    const handelNavigate = (e: any) => {
        e.preventDefault()
        navigate(-1)
    }
    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    const companys = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }
    let allcompanies: any = companys()

    let defaultValue: any = allcompanies.filter((item: any) => item.value === companyId)[0]

    const handelFinotech = async (e: any) => {
        e.preventDefault()
        const body = {
            nationalCode,
            "customerId": Number(params.id)
        }

        try {
            const { data, status } = await FintotechCheck(body)
            if (status === 200) {
                toast.success(' استعلام شماره تلفن و نام کاربری مورد تایید است', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }

        } catch (error) {
            console.log(error);

        }

    }


    return (

        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5> ویرایش کاربر </h5>
                    <p>در این بخش می توانید اطلاعات کاربر را ویرایش کنید</p>

                </div>
            </div>
            <div className=' box-big row d-flex justify-content-center '>
                <div className='col-md-8 col-sm-12'>


                    <Formik
                        initialValues={{

                            id: Number(params.id),
                            userName,
                            email,
                            firstName,
                            lastName,
                            nationalCode,
                            organizationId: check ? organizationId : null,
                            password,
                            active,
                            maxValidity: 0,
                            maxValidityUnitId: 0,
                            actionBlock,
                            groupId,
                            companyId: userRole[0] === 2 ? null : companyId
                            , companyName: userRole[0] === 2 ? null : companyName

                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit()
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (

                            <Form >

                                <div className="form-group  textOnInput  col-12 ">

                                    <div className="form-row">

                                        <div className="col-12 mb-5 d-flex justify-content-between ">
                                            <div className="col-lg-3 col-md-6 col-sm-11 ">


                                                <label className="form-check-label mb-3">

                                                    <input type="checkbox" checked={check} className="form-check-input" onChange={e => setChek(e.target.checked)} />
                                                    حقوقی
                                                </label>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-11">

                                                <label className="form-check-label mb-3">

                                                    <input type="checkbox" className="form-check-input" name="active" checked={active} onChange={(e: any) => setActive(!active)} />
                                                    فعال                                     </label>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-11">

                                                <label className="form-check-label mb-3 text-danger font-weight-bold">

                                                    <Field type="checkbox" name="actionBlock" className="form-check-input" checked={actionBlock} onChange={(e: any) => SetactionBlock(e.target.chechked)} />
                                                    تعلیق کاربر                                  </label>
                                            </div>

                                            {userRole.some((item: any) => item < 2) ?

                                                <button className="btn btn-small btn-secondary" onClick={handelFinotech}>استعلام کدملی</button> : ''
                                            }

                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >شماره موبایل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="شماره موبایل" name="userName" validate={validatMobail} value={userName} onChange={(e: any) => setUserName(e.target.value)} />

                                            {errors.userName && touched.userName && <div className="text-danger">{errors.userName}</div>}

                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                            <label >نام</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام" name="firstName" validate={validatAlpha} value={firstName} onChange={(e: any) => setFirstName(e.target.value)} />
                                            {errors.firstName && touched.firstName && <div className="text-danger">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-4" >
                                            <label >نام خانوادگی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="نام خانوادگی" name="lastName" validate={validatAlpha} value={lastName} onChange={(e: any) => setLastName(e.target.value)} />
                                            {errors.lastName && touched.lastName && <div className="text-danger">{errors.lastName}</div>}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >کد ملی</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="0070090602" maxLength="10" validate={validatmin10} name="nationalCode" value={nationalCode} onChange={(e: any) => setNationalCode(e.target.value)} />
                                            {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                            <label >ایمیل</label>
                                            <Field type="text" className="form-control opacityForInput" placeholder="email@example.com" name="email" validate={validateEmail} value={email} onChange={(e: any) => setEmail(e.target.value)} />
                                            {errors.email && touched.email && <div className="text-danger">{errors.email}</div>}

                                        </div>


                                        {/* <div className={companies.length > 0 && (userRole[0] === 7 || companies.length > 0 && userRole[0] === 8) ? "col-lg-4 col-md-4 col-sm-11 mb-4" : "col-lg-6 col-md-6 col-sm-11 mb-4"}>
                                            <label >مقدار اعتبار </label>
                                            <Field type="text" className=" formater form-control opacityForInput" placeholder="100,000" validate={validatNumber} name='maxValidity'  value={maxValidity} onChange={(e:any)=>setUserName(e.target.maxValidity)}/>
                                            {errors.maxValidity && touched.maxValidity && <div className="text-danger">{String(errors.maxValidity)}</div>}

                                        </div>
                                        <div className={companies.length > 0 && (userRole[0] === 7 || companies.length > 0 && userRole[0] === 8) ? "col-lg-4 col-md-4 col-sm-11 mb-4" : "col-lg-6 col-md-6 col-sm-11 mb-4"}>
                                            <label >واحد قیمت</label>
                                            <Select
                                                value={PriceUnit()}
                                                placeholder="واحد قیمت"
                                                options={PriceUnitItem()}
                                                onChange={(e: any) => setMaxValidityUnitId(e.value)}
                                            />
                                        </div> */}
                                        {companies.length > 0 && (userRole[0] === 7 || companies.length > 0 && userRole[0] === 8) ?
                                            <div className="col-lg-4 col-md-4 col-sm-11 mb-4 textOnInput">

                                                <label> شرکت</label>
                                                {companyId ? <Select
                                                    value={companys().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                                    placeholder='نام شرکت'
                                                    options={companys()}
                                                    key={defaultValue}
                                                    isClearable={true}
                                                    menuShouldScrollIntoView={false}
                                                    onChange={(e: any) => {


                                                        SetcompanyId(e.value)
                                                        SetCompanyName(e.label)


                                                    }

                                                    }

                                                /> : <Select

                                                    placeholder='نام شرکت'
                                                    options={companys()}
                                                    key={defaultValue}
                                                    isClearable={true}
                                                    menuShouldScrollIntoView={false}
                                                    onChange={(e: any) => {


                                                        SetcompanyId(e.value)
                                                        SetCompanyName(e.label)


                                                    }

                                                    }

                                                />}



                                            </div> : ''

                                        }


                                        <div className={check || companies.length > 0 === true ? "col-lg-4 col-md-4 col-sm-11 mb-4 " : "col-lg-6 col-md-6 col-sm-11 mb-4 "}>

                                            <label> نقش کاربر</label>
                                            <Select
                                                defaultValue={defaulRoleValue}
                                                placeholder='تعیین نقش'
                                                options={Roles()}
                                                key={defaulRoleValue}
                                                isClearable={true}
                                                menuShouldScrollIntoView={false}
                                                onChange={(e: any) => {


                                                    setuserRole([e.value])


                                                }

                                                }

                                            />


                                        </div>



                                        {check === true ?
                                            <div className="col-lg-4 col-md-4 col-sm-11 mb-4">
                                                <label >سازمان</label>
                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    value={OrganizationItem()}
                                                    options={OrganizationId()}
                                                    onChange={(e: any) => setOrganizationId(e.value)}
                                                />
                                            </div> : ''}
                                        <div className='col-12 textOnInputForGrp mb-3 '><input type='checkbox' checked={show} onChange={showHandler} /> تغییر رمز عبور </div>



                                        <div className="col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >رمز عبور</label>
                                            <Field type={passwordType} className="form-control opacityForInput float-left " placeholder="*******" name="password" validate={validatPassword} value={password} onChange={(e: any) => {
                                                setPassword(e.target.value)
                                            }} />
                                            {passwordType === 'password' ? <AiOutlineEye onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-6%', cursor: 'pointer', color: 'gray', marginTop: '2.5%' }} /> : <AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-6%', cursor: 'pointer', color: 'gray', marginTop: '2.5%' }} />}
                                        </div>

                                        <div className=" col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                                            <label >تکراررمز عبور</label>
                                            <input type={passwordType} className="form-control opacityForInput float-left  " placeholder="*******" value={passwordConfirm || ""} onChange={(e: any) => {
                                                setPasswordConfirm(e.target.value)
                                            }} />
                                            {passwordType === 'password' ? <AiOutlineEye onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-6%', cursor: 'pointer', color: 'gray', marginTop: '2.5%' }} /> : <AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-6%', cursor: 'pointer', color: 'gray', marginTop: '2.5%' }} />}
                                        </div>

                                        {password !== passwordConfirm && show ?
                                            <p className="d-block text-danger">رمز عبور برابر نیست</p> : ''}


                                        {userRole.includes(2) ? <div className="form-group mb-4 mt-3 label  textOnInput col-lg-12 rounded border  border-dark ">
                                            <label> راههای ارتباطی</label>
                                            {phoneBook.length > 0 ? <table className="table table-striped  text-center ">

                                                <thead >
                                                    <tr className="text-center">

                                                        <th>نام </th>
                                                        <th>شماره </th>
                                                        <th>نوع </th>
                                                        <th>توضیحات </th>

                                                        <th>ویرایش</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border">
                                                    {
                                                        phoneBook.map((item: any, index: number) => (

                                                            <tr key={index}>

                                                                <td>{item.name}</td>
                                                                <td>{item.phone}</td>
                                                                <td>{PhoneTypes.filter((i: any) => i.id === item.phoneTypeId).map((i: any) => i.name)[0]}</td>
                                                                <td>{item.description}</td>
                                                                <td> <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                                                                    title="ویرایش"
                                                                    onClick={() => openOtherPhones(item)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
                                                                        viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-edit-2">
                                                                        <path
                                                                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                    </svg>
                                                                </button></td>

                                                            </tr>

                                                        ))
                                                    }
                                                </tbody>



                                            </table> : <div className="d-flex justify-content-center mt-3">
                                                <p>اطلاعاتی موجود نیست</p>

                                            </div>}
                                            <button style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'white' }} className=" border-0 Attachment   float-right " title="افزودن شماره" onClick={() => openOtherPhones(0)}>
                                                <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                    className="bi bi-plus-circle" viewBox="0 0 17 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path
                                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>

                                            </button>
                                        </div> : ''}

                                        {userRole.includes(2) ? <div className="form-group mb-4 mt-3 label textOnInput col-lg-12 rounded   border-dark ">
                                            <label> شرکت های دارای دسترسی </label>
                                            <table className="table  text-center table-striped ">

                                                <thead >
                                                    <tr className="text-center">

                                                        <th>نام شرکت</th>
                                                        <th>نام گروه</th>
                                                        <th>ویرایش</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border">
                                                    {
                                                        EntityAccesses.map((item: any, index: number) => (

                                                            <tr key={index}>

                                                                <td>{item.companyName}</td>
                                                                <td>{item.groupName}</td>
                                                                <td> <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                                                                    title="ویرایش"
                                                                    onClick={() => openModalAccess(item)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
                                                                        viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-edit-2">
                                                                        <path
                                                                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                    </svg>
                                                                </button></td>

                                                            </tr>

                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            <button style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'white' }} className=" border-0 Attachment   float-right " title="افزودن دسترسی" onClick={() => openModalAccess(null)}>
                                                <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                    className="bi bi-plus-circle" viewBox="0 0 17 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path
                                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>

                                            </button>
                                        </div> : ''}

                                        <div className="col-12">
                                            <div className='row'>
                                                <div className='col-6  mb-1 '>
                                                    {show === true ?
                                                        <button className="btn btn-success  " disabled={password !== passwordConfirm || !loading ? false : true} onClick={submit} >تایید<ClipLoader

                                                            loading={loading}
                                                            color="#ffff"
                                                            size={15}
                                                        /></button> :
                                                        <button className="btn btn-success  " disabled={!loading ? false : true} onClick={submit}>تایید
                                                            <ClipLoader

                                                                loading={loading}
                                                                color="#ffff"
                                                                size={15}
                                                            />
                                                        </button>}
                                                </div>
                                                <div className='col-6 mb-1'>
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
            <EntityAccessModal companies={companies} modalIsOpen={accessOpen} closeModal={CloseModalAccess} groups={groupsForAccess()} entityId={params.id} entityTypeId={1} currentItem={item} />
            <OtherPhones modalIsOpen={OtherPhoneOpen} closeModal={CloseModalOtherPhones} entityId={params.id} entityTypeId={1} currentItem={CurenntPhone} IsClient={false} />
        </div>
    )
}
export default EditUserInfo