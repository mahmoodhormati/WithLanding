import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate,useParams } from 'react-router-dom';
import { GetGroupById, SetGroup } from '../../../services/GroupService';
import {ClipLoader} from "react-spinners";
import {Field, Form, Formik} from "formik";
import {validatAlpha} from "../../../Utils/validitionParams";



const EditWareHouseType:React.FC = () => {
    const navigate=useNavigate();
    const params=useParams();
    const [name, Setname] = useState('')
    const [loading, setLoading] = useState(false);

    const getGroup=async()=>{

        try {
            const{data,status}=await GetGroupById(params.id);
            if(status===200){
                Setname(data.result.group.name)
            }
           
        } catch (error) {
            
        }
    }
  
   useEffect(()=>{
    getGroup()
   },[])

    const handelSubmit = async () => {
        setLoading(true)

        try {
            const body={
            group:{
                id:params.id,
                entityTypeId:4,
                name:name,
            }
        }

        const {data,status}=await SetGroup(body)
        if(status===200){
            toast.success('گروه جدید ایجاد شد',
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined
            })
            navigate('/admin/EditWareHouseTypeName')
        }
        setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)

        }
        setLoading(false)


    }
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش گروه انبار</h5>
                    <p>در این بخش می توانید گروه را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='widget box shadow col-md-4 col-xs-12'>


                    <Formik
                        initialValues={{
                            id:params.id,
                            entityTypeId:4,
                            name,
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit()
                        }}>
                        {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (

                            <Form className='form-group col-md-10' >
                                <div className='form-group '>

                                    <div className="input-group  mb-3">
                                        <Field validate={validatAlpha}  name="name" type="text" className="form-control opacityForInput" placeholder="گروه" aria-describedby="basic-addon1" value={name} onChange={(e:any) => Setname(e.target.value)} />

                                        {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                    </div>
                                    <div className='row '>
                                        <div className='col-6 '>
                                            <button type="submit" disabled={loading} className="btn btn-success float-left"  >
                                                ثبت
                                                <ClipLoader

                                                    loading={loading}
                                                    color="#ffff"
                                                    size={15}
                                                /></button>                                </div>
                                        <div className='col-6 '>
                                            <NavLink to='/admin/warehousetypes' className="btn btn-danger float-right">بازگشت</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default EditWareHouseType