import React, { useState, useEffect, useReducer } from 'react'
import { GetOrganisationById, GetOrganisationByIdAdmin, SetOrganisation } from '../../../services/organisationService';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { Formik, Form, Field } from 'formik';
import { validatAlpha, validatmin10, validatNumber } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { GetGroupWithCompany } from '../../../services/GroupService';
import { GetCompanyEntityAccess } from '../../../services/companiesService';
import QueryString from 'qs';
import EntityAccessModal from '../../User/Component/EntityAccessModal';
import { GetPhoneBook } from '../../../services/phoneService';
import { PhoneTypes } from '../../../Common/Enums/PhoneTypes';
import OtherPhones from '../../../Common/Shared/Common/OtherPhones';
import { TiPencil } from 'react-icons/ti';
import { ImCross } from 'react-icons/im';
import { DeleteAttachments, GetAttachments } from '../../../services/attachmentService';
import ImageFileUploader from '../../../Utils/ImageFileUploader';
const attachmetURL = (window as any).globalThis.stie_att;

const EditOrganizaion: React.FC = () => {
    const [name, setName] = useState('');
    const [companyRegister, setcompanyRegister] = useState('');
    const [nationalId, SetnationalId] = useState('');
    const [loading, setLoading] = useState(false);
    const companies = useSelector((state: RootState) => state.companies)
    const [OrganizGroups, setOrganizGroup] = useState([])
    const [EntityAccesses, SetEntityAccesses] = useState<any>([])
    const [EntityAccessesCompanies, SetEntityAccessesCompanies] = useState<any>([])
    const [phoneBook, SetphoneBook] = useState<any>([])
    const [accessOpen, SetAccessOpen] = useState(false)
    const [OtherPhoneOpen, SetOtherPhoneOpen] = useState(false)
    const [item, SetItem] = useState<any>(0)
    const [CurenntPhone, SetCurrentPhone] = useState<any>(0)
    const [attachments, Setattachments] = useState([]);
  const [ModalOpen, setModalOpen] = useState(false);
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)




    const navigate = useNavigate();
    const params = useParams();
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
                SetEntityAccessesCompanies(data.result.companyEntityAccesses.map((item:any)=>item.companyId))
            }

        } catch (error) {

            console.log(error);

        }


    }
    const GetPhones = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                EntityTypeId: 3,
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

    const openModalUpload = () => {
        setModalOpen(true);
      };
      const CloseModalUpload = () => {
        setModalOpen(false);
      };
    

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
    const getOrganization = async () => {
        try {
            const { data, status } = await GetOrganisationByIdAdmin(params.id);
            if (status === 200) {
                setName(data.result.organization.name);
                setcompanyRegister(data.result.organization.registrationNumber);
                SetnationalId(data.result.organization.nationalId)
            }
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        getOrganization()
        
        entityAccess()
        GetPhones()
        handelGetAttachment()
       
        
    }, [params.id,updateValue])

    useEffect(() => {
       
        getGroupsWithCompanies()
        
    }, [EntityAccessesCompanies,updateValue])



    const handelGetAttachment = async () => {
        let config = {
          headers: { "Content-Type": "application/json" },
          params: {
            entityTypeId: 3,
            entityId: Number(params.id),
           
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
    const handelSubmit = async () => {
        setLoading(true)

        const body = {
            "organization": {
                id: 0,
                name:name,
                nationalId:nationalId,
                registrationNumber: companyRegister,
                parentId: 0,
                groupId: null
            }
        }
        try {
            const { data, status } = await SetOrganisation(body)
            if (status === 200) {
                setLoading(false)
                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

                navigate(-1)

            }
        } catch (error) {
            console.log(error)
            setLoading(false)

        }
        setLoading(false)

    }
    const getGroupsWithCompanies = async () => {

        let groups: any = []

        for (let i = 0; i < EntityAccessesCompanies.length; i++) {

            try {
                const { data, status } = await GetGroupWithCompany(1, EntityAccessesCompanies[i]);
                groups.push(...data.result.groups)

            } catch (error) {
                console.log(error);

            }



        }
        setOrganizGroup(groups)

    }


    const openModalAccess = (item: any) => {
        if (item !== 0) {
            SetItem(item)
        }
        SetAccessOpen(true)
    }
    const CloseModalAccess = () => {

        SetAccessOpen(false)
        SetItem(null)
        entityAccess()
    }

    
    const groupsForAccess: any = () => {
        if (OrganizGroups) {
            return (OrganizGroups.map((item: any) => ({ label: item.name, companyId: item.companyId, companyName: item.companyName, value: item.id })))
        }
    }

    let newAttachment: any = [];
  newAttachment = attachments.filter(
    (item: any) => item.deleted === false 
  );
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش سازمان  </h5>
                    <p>در این بخش می توانیداطلاعات سازمان را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-lg-8 col-sm-12 m-2'>


                    <Formik
                        initialValues={{
                            id: 0,
                            name,
                            nationalId,
                            registrationNumber: companyRegister,
                            parentId: 0,
                            groupId: 0
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values

                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (

                            <Form className="row "   >
                                <div className="col-lg-12 mb-4">
                                    {newAttachment.length === 0 ? (
                                        <div className="text-center ">
                                            <img src="/assets/img/company.png"  style={{ height: "8rem", width: "8rem" }}/>
                                            <button
                                                onClick={() => openModalUpload()}
                                                className="border-0 bg-transparent non-hover"
                                            >
                                                <TiPencil size="1.5rem" color="blue" title='اضافه کردن لوگو سازمان' />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center user-info">
                                            <img
                                                src={`${attachmetURL}${newAttachment[0].path}`}
                                                className=" "
                                                alt={`${name} `}
                                                style={{ height: "8rem", width: "8rem" }}
                                            />
                                            <button
                                                onClick={() =>
                                                    HandelDeleteAttachment(newAttachment[0].id)
                                                }
                                                className="border-0 bg-transparent non-hover"
                                            >
                                                <ImCross size="1rem" color="red" title="حذف لوگو" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className=" col-lg-6 col-sm-12 textOnInput mb-4  ">

                                    <label >شماره ملی شرکت</label>
                                    <div className='form-row justify-content-center'>
                                        <Field validate={validatNumber} type="text" className="form-control opacityForInput col" name="nationalId" value={nationalId} onChange={(e: any) => { SetnationalId(e.target.value); }} placeholder="12345678912" />


                                    </div>
                                    {errors.nationalId && touched.nationalId && <div className="text-danger">{errors.nationalId}</div>}



                                </div>
                                <div className="col-lg-6 col-sm-12  mb-4 textOnInput ">
                                    <label >نام شرکت</label>
                                    <Field validate={validatAlpha} name="name" type="text" className="form-control opacityForInput" value={name}
                                        onChange={(e: any) => {
                                            setName(e.target.value)

                                        }} placeholder="نام شرکت" />

                                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                </div>

                                <div className="col-lg-12 col-sm-12  mb-4 textOnInput ">
                                    <label >شماره ثبت</label>
                                    <Field validate={validatNumber} name="registrationNumber" type="text" className="form-control opacityForInput" value={companyRegister} onChange={(e: any) => {
                                        setcompanyRegister(e.target.value)

                                    }} placeholder="شماره ثبت" />
                                    {errors.registrationNumber && touched.registrationNumber && <div className="text-danger">{errors.registrationNumber}</div>}


                                </div>

                                <div className="form-group mb-4 mt-3 label textOnInput col-lg-12 rounded border  border-dark ">
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
                                </div>

                                <div className="form-group mb-4 mt-3 label textOnInput col-lg-12 rounded border  border-dark ">
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
                                    <button style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'white' }} className=" border-0 Attachment   float-right " title="افزودن دسترسی" onClick={() => openModalAccess(0)}>
                                        <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                            className="bi bi-plus-circle" viewBox="0 0 17 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path
                                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>

                                    </button>
                                </div>


                                <EntityAccessModal companies={companies} modalIsOpen={accessOpen} closeModal={CloseModalAccess} groups={groupsForAccess()} entityId={params.id} entityTypeId={1} currentItem={item} />
                                <OtherPhones modalIsOpen={OtherPhoneOpen} closeModal={CloseModalOtherPhones} entityId={params.id} entityTypeId={3} currentItem={CurenntPhone} IsClient={false} />

                                <div className='col-6 '>
                                    <button type="submit" disabled={loading} className="btn btn-success float-right" onClick={handelSubmit}  >
                                        تایید

                                        <ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        />
                                    </button>
                                </div>
                                <div className='col-6 ' >
                                    <NavLink to='/admin/organizationlist' className="btn btn-danger">بازگشت</NavLink>
                                </div>





                            </Form>
                        )}
                    </Formik>
                </div >

                <ImageFileUploader
          closeModal={CloseModalUpload}
          modalIsOpen={ModalOpen}
          comment={" بارگزاری عکس سازمان"}
          EntityTypesId={3}
          EntityId={params.id}
          AttchmentTypeId={0}
         
        />
            </div >

        </div>
    )
}

export default EditOrganizaion