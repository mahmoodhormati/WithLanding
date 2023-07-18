import React, { useState } from 'react'
import { SetOrganisation } from '../../../services/organisationService';
import { useNavigate,NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import {ClipLoader} from "react-spinners";
import { Formik, Form, Field } from 'formik';
import {validatAlpha, validatmin10, validatNumber} from "../../../Utils/validitionParams";

const NewOrganizaion:React.FC = () => {
    const [companyName, setcompanyName] = useState('');
    const [companyRegister, setcompanyRegister] = useState('');
    const [nationalId, SetnationalId] = useState('');
    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);

    const handelSubmit = async ( ) => {
        setLoading(true)
const organisation = {
    organization:{
        id:0,
        name: companyName.trim(),
        nationalId,
        registrationNumber: companyRegister,
        parentId: 0,
        groupId: 0
    }

}
        try {
            const { data, status } = await SetOrganisation(organisation)
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
setLoading(false)
                navigate('/admin/organizationlist')

            }
        } catch (error) {
            setLoading(false)

            console.log(error)
        }
        setLoading(false)

    }
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تعریف سازمان جدید </h5>
                    <p>در این بخش می توانید سازمان جدید تعریف کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='col-lg-8 col-sm-12 m-2'>


                    <Formik
                        initialValues={{
                            id:0,
                            name: companyName,
                            nationalId,
                            registrationNumber: companyRegister,
                            parentId: 0,
                            groupId: 0
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit( )
                        }}>
                        {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (

                            <Form className="row"  >
                        <div className="n-chk">


                            {/* <label className="form-check-label mb-3">
                        <input type="checkbox" className="form-check-input" onChange={e => setChek(e.target.checked)} />
                        شخص حقوقی هستم
                    </label> */}
                        </div>

                        <div className=" col-lg-6 col-sm-12 form-group mb-4 textOnInput ">

                                    <label >شماره ملی شرکت</label>
                                    <div className='form-row justify-content-center'>
                                        <Field validate={validatNumber} type="text" className="form-control opacityForInput col" name="nationalId" value={nationalId} onChange={(e:any) => { SetnationalId(e.target.value); }} placeholder="12345678912" />


                                    </div>
                                    {errors.nationalId && touched.nationalId && <div className="text-danger">{errors.nationalId}</div>}



                                </div>
                                <div className="col-lg-6 col-sm-12 form-group mb-4 textOnInput ">
                                    <label >نام شرکت</label>
                                    <Field validate={validatAlpha} name="name" type="text" className="form-control opacityForInput" value={companyName}
                                           onChange={(e:any) => {
                                            setcompanyName(e.target.value)

                                           }} placeholder="نام شرکت" />

                                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                </div>

                                <div className="col-lg-12 col-sm-12 form-group mb-4 textOnInput ">
                                    <label >شماره ثبت</label>
                                    <Field validate={validatNumber} name="registrationNumber" type="text" className="form-control opacityForInput"  value={companyRegister} onChange={(e:any) => {
                                        setcompanyRegister(e.target.value)

                                    }} placeholder="شماره ثبت" />
                                    {errors.registrationNumber && touched.registrationNumber && <div className="text-danger">{errors.registrationNumber}</div>}


                                </div>




                                
                                    <div className='col-6 '>
                                        <button type="submit" disabled={loading} className="btn btn-success float-right"  >
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
            </div >
        </div>
    )
}

export default NewOrganizaion