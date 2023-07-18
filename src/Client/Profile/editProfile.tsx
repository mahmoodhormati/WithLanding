import React, { useRef, useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerInfo } from "../../services/customerService";
import { toast } from "react-toastify";
import { GetUserInfo } from "../../services/userService";
import { GetAllProvince, SetAddress } from "../../services/addressService";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
  validatAlpha,
  validateEmail,
  validatmin10,
  validatPassword,
} from "../../Utils/validitionParams";
import { RootState } from "../../store";
import { FintotechCheck } from "../../services/outScopeService";
import { ClipLoader } from "react-spinners";
import {
  DeleteAttachments,
  GetAttachments,
} from "../../services/attachmentService";
import QueryString from "qs";
import { TiPencil } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import ImageFileUploader from "../../Utils/ImageFileUploader";
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { GetPhoneBook } from "../../services/phoneService";
import { PhoneTypes } from "../../Common/Enums/PhoneTypes";
import OtherPhones from "../../Common/Shared/Common/OtherPhones";

const attachmetURL = (window as any).globalThis.stie_att;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const userinfo = useSelector((state: RootState) => state.user);
  const roles = useSelector((state: RootState) => state.roles);
  const [firstName, setfirstName] = useState(userinfo.firstName);
  const [lastName, setlastName] = useState(userinfo.lastName);
  const [nationalCode, setnationalCode] = useState(userinfo.nationalCode);
  const [email, setemail] = useState(userinfo.email);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [attachments, Setattachments] = useState([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const [CurenntPhone, SetCurrentPhone] = useState<any>(0)
  const [phoneBook, SetphoneBook] = useState<any>([])
  const [OtherPhoneOpen, SetOtherPhoneOpen] = useState(false)
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)



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




  const GetPhones = async () => {


    let config = {

      headers: { 'Content-Type': 'application/json' },

      params: {
        EntityTypeId: 1,
        EntityId: Number(localStorage.getItem('connect')),



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
  const dispatch = useDispatch();
  const togglePassword = (e: any) => {
    e.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handelGetAttachment = async () => {
    let config = {
      headers: { "Content-Type": "application/json" },
      params: {
        entityTypeId: 1,
        entityId: Number(localStorage.getItem("connect")),
        attachmentTypeId: 3,
      },
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params);
      },
    };
    try {
      const { data, status } = await GetAttachments(config);
      if (status === 200) {
        Setattachments(data.result.attachments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const user = {
    id: userinfo.id,
    userName: userinfo.userName,
    email,
    firstName,
    lastName,
    requireInfo: false,
    nationalCode,
    organizationId: userinfo.organizationId,
    password,
    active: true,
    companyId: userinfo.companyId,
  };

  const getCurrentUser = async () => {
    const { data, status } = await GetUserInfo();
    if (status === 200) {
      setfirstName(data.result.customer.firstName);
      setlastName(data.result.customer.lastName);
      setnationalCode(data.result.customer.nationalCode);
      setemail(data.result.customer.email);
    }
  };

  useEffect(() => {
    getCurrentUser();
    handelGetAttachment();
    GetPhones()
  }, [updateValue]);
  const openModalUpload = () => {
    setModalOpen(true);
  };


  const HandelDeleteAttachment = async (id: number) => {
    try {
      const { data, status } = await DeleteAttachments(id);
      if (status === 200) {
        toast.success("ویرایش با موفقعیت انجام شد", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }

    ForceUpdate()
  };
  const showHandler = () => {
    setShow(!show);
  };
  const handelSetCustomer = async () => {
    setLoading(true);

    if(roles.includes(1)){
    try {
      const body = {
        customerId: userinfo.id,
        nationalCode,
      };

      const { data, status } = await FintotechCheck(body);

      if (status === 200) {
        try {
          const { data, status } = await setCustomerInfo(user);
          if (status === 200) {
            toast.success(
              " اطلاعات با موفقیت ثبت شد لطفا منتظر تایید ادمین باشد",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            );
          }
          setLoading(false);

        } catch (error) {
          console.log(error);
          setLoading(false);

        }
        getCurrentUser();
        setLoading(false);

      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
    setLoading(false);
  }
  else{
    try {
      const { data, status } = await setCustomerInfo(user);
      if (status === 200) {
        toast.success(
          " اطلاعات با موفقیت ثبت شد  ",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          }
        );
      }
      setLoading(false);
      getCurrentUser();
      navigate('/client')

    } catch (error) {
      console.log(error);
      setLoading(false);

    }
    setLoading(false);

  }
  };
  const backHandel = (e: any) => {
    e.preventDefault();

    navigate(-1);
  };
  const CloseModalUpload = () => {
    setModalOpen(false);
  };
  let newAttachment: any = [];
  newAttachment = attachments.filter(
    (item: any) => item.deleted === false && item.attachmentTypeId === 3
  );
  return (
    <div className="  layout-px-spacing">
      <div className="page-header">
        <div className="page-title">
          <h3>ویرایش اطلاعات</h3>
        </div>
      </div>

      <div className="mt-5 mx-auto p-5 dashboard-widget  rounded row d-flex justify-content-center col-12">

        {roles.includes(1) ? (
          <div className="text-center  rounded border-bottom border-danger">
            <h6 className="text-danger ">
              *لطفا جهت استفاده از سایر امکانات سامانه اطلاعات کاربری خود را
              تکمیل کنید*
            </h6>
          </div>
        ) : (
          ""
        )}
        <div className="col-lg-12 mb-4">
          {newAttachment.length === 0 ? (
            <div className="text-center ">
              <img src="/assets/img/avatar.svg" />
              <button
                onClick={() => openModalUpload()}
                className="border-0 bg-transparent non-hover"
              >
                <TiPencil size="1.5rem" color="blue" />
              </button>
            </div>
          ) : (
            <div className="text-center user-info">
              <img
                src={`${attachmetURL}${newAttachment[0].path}`}
                className="rounded-circle "
                alt={`${user.firstName} ${user.lastName}`}
                style={{ height: "80px", width: "80px" }}
              />
              <button
                onClick={() =>
                  HandelDeleteAttachment(newAttachment[0].id)
                }
                className="border-0 bg-transparent non-hover"
              >
                <ImCross size="1rem" color="red" title="حذف عکس" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-5 col-md-8 col-xs-12">
          <Formik
            initialValues={{
              id: userinfo.id,
              userName: userinfo.userName,
              email,
              firstName,
              lastName,
              requireInfo: false,
              nationalCode,
              organizationId: null,
              password,
              active: true,
              companyId: userinfo.companyId,
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // same shape as initial values

            }}
          >
            {({
              errors,
              touched,
              validateField,
              validateForm,
              setFieldValue,
              handleChange,
              values,
            }) => (
              <Form className="row">

                <div className="col-lg-6 form-group  mb-4  textOnInput  align-content-between">
                  <label>نام</label>
                  <Field
                    type="text"
                    className="form-control opacityForInput"
                    placeholder="نام"
                    name="firstName"
                    validate={validatAlpha}
                    value={firstName}
                    onChange={(e: any) => {
                      setfirstName(e.target.value);
                    }}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="text-danger">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-lg-6 form-group mb-4 textOnInput">
                  <label>نام خانوادگی</label>
                  <Field
                    type="text"
                    className="form-control opacityForInput"
                    placeholder="نام خانوادگی"
                    name="lastName"
                    validate={validatAlpha}
                    value={lastName}
                    onChange={(e: any) => setlastName(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 form-group mb-4 textOnInput">
                  <label>کد ملی</label>
                  <Field
                    type="text"
                    className="form-control opacityForInput"
                    placeholder="0070090602"
                    name="nationalCode"
                    validate={validatmin10}
                    value={values.nationalCode}
                    onChange={(e: any) => setnationalCode(e.target.value)}
                  />
                  {errors.nationalCode && touched.nationalCode && (
                    <div className="text-danger">{errors.nationalCode}</div>
                  )}
                </div>

                <div className="col-lg-6 form-group mb-4 textOnInput">
                  <label>ایمیل</label>
                  <Field
                    type="text"
                    className="form-control opacityForInput"
                    placeholder="email@example.com"
                    name="email"
                    validate={validateEmail}
                    value={values.email}
                    onChange={(e: any) => setemail(e.target.value)}
                  />
                  {errors.email && touched.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>
                <div className="col-12">
                  <input type="checkbox" checked={show} onClick={showHandler} />{" "}
                  تغییر رمز عبور{" "}
                </div>
                {show === true ? (
                  <div className="col-12">
                    <div className="row">

                      <div className="col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                        <label >رمز عبور</label>
                        <Field type={passwordType} className="form-control opacityForInput float-left " placeholder="*******" name="password" validate={validatPassword} value={password} onChange={(e: any) => {
                          setPassword(e.target.value)
                        }} />
                        {passwordType === 'password' ? <AiOutlineEye onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-8%', cursor: 'pointer', color: 'gray', marginTop: '3.5%' }} /> : <AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-8%', cursor: 'pointer', color: 'gray', marginTop: '3.5%' }} />}
                      </div>

                      <div className=" col-6 mb-5 mt-4 textOnInputForGrp rounded" hidden={!show}>
                        <label >تکراررمز عبور</label>
                        <input type={passwordType} className="form-control opacityForInput float-left  " placeholder="*******" value={passwordConfirm || ""} onChange={(e: any) => {
                          setPasswordConfirm(e.target.value)
                        }} />
                        {passwordType === 'password' ? <AiOutlineEye onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-8%', cursor: 'pointer', color: 'gray', marginTop: '3.5%' }} /> : <AiOutlineEyeInvisible onClick={togglePassword} size={'1.2rem'} id="togglePassword" style={{ marginRight: '-8%', cursor: 'pointer', color: 'gray', marginTop: '3.5%' }} />}
                      </div>
                      {password !== passwordConfirm ? (
                        <span className="text-danger ">
                          رمز عبور برابر نیست
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {!roles.includes(1) ? <div className="form-group mb-4 mt-3 label  textOnInput col-lg-12 rounded border  border-dark ">
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
                <div className="col-12">
                  <div className="row justify-content-between mt-4">
                    <div>
                      <button type="button" className="btn btn-success" onClick={handelSetCustomer}>
                        درخواست بررسی اطلاعات
                      </button>
                      <ClipLoader loading={loading} color="#ffff" size={15} />
                    </div>
                    <div>
                      <button onClick={backHandel} className="btn btn-primary">
                        بازگشت
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <ImageFileUploader
          closeModal={CloseModalUpload}
          modalIsOpen={ModalOpen}
          comment={"بارگزاری عکس پروفایل"}
          EntityTypesId={1}
          EntityId={user.id}
          AttchmentTypeId={3}
       
        />
            <OtherPhones modalIsOpen={OtherPhoneOpen} closeModal={CloseModalOtherPhones} entityId={userinfo.id} entityTypeId={1} currentItem={CurenntPhone}  IsClient={true}/>

      </div>
    </div>
  );
};
export default EditProfile;
