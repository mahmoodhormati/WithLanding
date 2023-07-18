import React, { useEffect, useState } from 'react'
import { GetAttribute } from '../../../services/attributeService';
import { NavLink } from 'react-router-dom';
import { SetAttribute } from '../../../services/attributeService';
import { toast } from 'react-toastify';
import { useNavigate,useParams } from 'react-router-dom';
import { GetGroupById, SetGroup } from '../../../services/GroupService';
import {ClipLoader} from "react-spinners";
import { GetCompanyChild } from '../../../services/companiesService';
import  Select  from 'react-select';
import {Field, Form, Formik} from "formik";
import {validatAlpha} from "../../../Utils/validitionParams";


const EditProductGroup:React.FC = () => {
    const navigate=useNavigate();
    const params=useParams();
    const [name, Setname] = useState('')
    const [loading, setLoading] = useState(false);

      const [userCompanies, setUserCompanies] = useState([])
    let [companyId, SetcompanyId] = useState()
    let [companyName, SetCompanyName] = useState()


    
const getCompanies = async () => {
    try {
        const { data, status } = await GetCompanyChild()
        setUserCompanies(data.result.companies)
        SetcompanyId(data.result.companies[0].id)
        SetCompanyName(data.result.companies[0].name)


    } catch (error) {

    }

}
    const getGroup = async () => {

        try {
            const { data, status } = await GetGroupById(params.id)
            Setname(data.result.group.name)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getCompanies()

        getGroup();
    }, [])
    const handelSubmit = async () => {
        
        setLoading(true)

        try {
            const body={
            group:{
                id:params.id,
                entityTypeId:2,
                name:name, companyId
                ,companyName
            
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
            navigate('/admin/productgroup')
        }
            setLoading(false)

        } catch (error) {
            setLoading(false)

            console.log(error);
        }

        setLoading(false)

    }
    const companys = () => {
        return (userCompanies.map((item:any) => ({ label: item.name, value: item.id })))

    }
    let defaultValue:any = companys()[0]
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش گروه کالا</h5>
                    <p>در این بخش می توانید گروه را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-md-8 col-xs-12 m-2'>
                    <Formik
                        initialValues={{
                            id: 0,
                            entityTypeId: 2,
                            name
                            ,companyId
                            ,companyName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit()
                        }}>
                        {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (

<Form  >
<div className='row'>

<div className=" col-lg-6 input-group mb-4">
<Field  validate={validatAlpha} name="name" type="text" className="form-control opacityForInput" placeholder="گروه" aria-describedby="basic-addon1" value={name} onChange={(e:any) => Setname(e.target.value)} />


</div>
    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

    {userCompanies?
<div className="col-lg-6 form-group mb-3  textOnInput">

<label> شرکت</label>
<Select
    menuShouldScrollIntoView ={false}
    defaultValue={defaultValue}
    placeholder='نام شرکت'
    options={companys()}
    key={defaultValue}
    isClearable={true}
    onChange={e => {


        SetcompanyId(e.value)
        SetCompanyName(e.label)


    }

    }

/>


</div>:''}
<div className='col-12 '>
<div className='row '>
<div className='col-6 '>
    <button type="submit" disabled={loading} className="btn btn-success float-right"  >ثبت<ClipLoader

        loading={loading}
        color="#ffff"
        size={15}
    /></button>
</div>
<div className='col-6 '>
    <NavLink to='/admin/productgroup' className="btn btn-danger float-left">بازگشت</NavLink>
</div>
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

export default EditProductGroup