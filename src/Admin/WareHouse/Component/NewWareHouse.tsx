import React, { useEffect, useState, } from "react";
import { GetAllWareHouse, SetWareHouses } from "../../../services/wareHouseService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NavLink, useParams } from "react-router-dom";
import Select from 'react-select'
import { SetAttributeValues } from "../../../services/attributeService";
import { GetAttributeValues } from '../../../services/attributeService';
import { GetGroupsForEntity, GetGroupWithCompany } from '../../../services/GroupService';
import { ClipLoader } from "react-spinners";
import { GetCompanyChild } from '../../../services/companiesService';
import { Field, Form, Formik } from "formik";
import { validatAlpha, validateRequired, validatNumber } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from "../../../store";
import { GetAllProvince } from '../../../services/addressService';

const NewWareHouse: React.FC = () => {
   
    const [address, setAddres] = useState('');
    const [name, Setname] = useState('');
    const [wareGid, setWareGId] = useState(0)
    const [wareHouseT, SetWarehouseT] = useState<any>([]);
    const [groupId, setGroupId] = useState(0);
   
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(true);

    let [companyId, SetcompanyId] = useState()
    let [companyName, SetCompanyName] = useState()
    const[capacity,SetCapacity]=useState(0)
    const [province, setProvince] = useState([]);
    const[provinceId,setProvinceId]=useState(0);
    const[ostanId,setostanId]=useState(0);

    const companies = useSelector((state: RootState) => state.companies)
  
    const navigator = useNavigate();
    const test = {

        "wareHouse": {
       
            name:name,
            groupId, companyId, companyName, active,address,capacity:Number(capacity),provinceId
        }

    }
  

    const GetWareHouseTypes = async (companyId:any) => {
        if (companies.length === 1) {
            try {

                const { data, status } = await GetGroupWithCompany(4, companies[0].id);
                SetWarehouseT(data.result.groups)

            } catch (error) {

            }

        }
        else {
            try {
                const { data, status } = await GetGroupWithCompany(4, companyId);
                SetWarehouseT(data.result.groups)

            } catch (error) {

            }

        }






    }
    useEffect(() => {
   
       
        GetWareHouseTypes(companyId)
  
        
      }, [companyId])
  

    const getProvince = async () => {

        const { data, status } = await GetAllProvince();
        setProvince(data.result.provinces);

    }


    const inputwareHouseT = () => {
        return (wareHouseT.map((data: any) => ({ label: data.name, value: data.id })))
    }
    let defaultwareValue: any = inputwareHouseT().filter((item: any) => item.value === groupId)


    const handelSubmit = async () => {
        setLoading(true)
        try {
            const { data, status } = await SetWareHouses(test);
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

                navigator('/admin/warehouselist')
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)

        }
    }

    useEffect(() => {
   
       
        getProvince()

      
    }, [])
 

    const Allcities = province.filter((data:any) => data.parentId !== null);
    const cities =Allcities.filter((data:any)=>data.parentId===ostanId)
  
    const ostan = province.filter((data:any) => data.parentId === null);
    const ProvincerenderList = () => {
        return (ostan.map((data:any) => ({ label: data.name, value: data.id })))
    
    }
    const CitiesrenderList = () => {
    
        return (cities.map((data:any)=> ({ label: data.name, value: data.id })))
    }
    const provinceOstan=()=>{
        let currentostanId=Allcities.filter((i:any)=>i.id===provinceId).map((i:any)=>i.parentId)
        setostanId(currentostanId[0])
        return(ProvincerenderList().filter((i:any)=>i.value===currentostanId[0])[0])
    }
    const companys = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }

    let defaultValue: any = companys().filter((item: any) => item.value === companyId)
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویریش انبار</h5>
                    <p>در این بخش می توانید انبار را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-md-8 col-xs-12 m-2'>


                    <Formik
                        initialValues={{
                            name,
                            groupId,
                            companyId,
                            companyName,
                            address,
                           capacity,
                            active,provinceId
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit()
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (

                            <Form className='' >                
                                    <div className='row'>

                                <div className=" col-lg-6 col-sm-12 mb-4 textOnInput">
                                    <label >انبار</label>
                                    <Field type="text" className="form-control opacityForInput" placeholder="انبار" aria-describedby="basic-addon1" value={name} name="name" onChange={(e: any) => Setname(e.target.value)} />
                                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}


                                </div>
                                <div className=" col-lg-6 col-sm-12  mb-4 textOnInput">


                                    <label>ظرفیت</label>

                                    <Field name="attValuehajm" validate={capacity} type="text" className="form-control opacityForInput" placeholder="انبار" aria-describedby="basic-addon1" value={capacity} onChange={(e: any) => SetCapacity(e.target.value)} />

                                    {errors.capacity && touched.capacity && <div className="text-danger">{errors.capacity}</div>}




                                </div>
                                {companies.length > 1 ?
                                    <div className=" col-lg-6 col-sm-12 mb-4 textOnInput ">

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


                                    </div> : ''}
                                <div className="col-lg-6 col-sm-12 mb-4 textOnInput ">

                                    <label>گروه انبار</label>


                                    <Select
                                        menuShouldScrollIntoView ={false}
                                        defaultValue={defaultwareValue}
                                        key={defaultwareValue}
                                        options={inputwareHouseT()}
                                        onChange={(e: any) => setGroupId(e.value)}
                                    />

                                   


                                </div>
                                
                                    <div className="form-group col-md-6 textOnInput">
                                        <label>استان</label>
                                        
                                        
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            placeholder='استان'
                                            options={ProvincerenderList()}
                                            onChange={(e:any)=>{setostanId(e.value)
                                            }}
                                        />
                                        
                                        {ostanId ===0 ?<span className="text-danger">استان خود را انتخاب کنید</span> :null }

                                    </div>
                                    <div className="form-group col-md-6 textOnInput">

                                        <label >شهر</label>
                                       
                                        
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            placeholder='شهر'
                                            options={CitiesrenderList()}
                                            className='form-group'
                                            onChange={(e:any)=>setProvinceId(e.value)}
                                            />
                                        
                                        {provinceId ===0 ?<span className="text-danger">شهر خود را انتخاب کنید</span> :null }

                                    </div>
                                <div className='col-lg-12 col-sm-12 mb-4 textOnInput'>
                                    <label>آدرس</label>
                                    <Field name="Addres" validate={validateRequired} as="textarea" className="form-control opacityForInput " rows='4' placeholder='آدرس انبار' value={address} onChange={(e: any) => {
                                        setAddres(e.target.value)

                                    }} />
                                    {errors.address && touched.address && <div className="text-danger">{errors.address}</div>}

                                </div>
                               < div className='col-lg-12 col-sm-12 '>
                                <div className='row '>
                                    <div className='col-6  '>
                                        <button  disabled={loading} className="btn btn-success float-right"  onClick={handelSubmit} >ثبت<ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>
                                    </div>
                                    <div className='col-6  '>
                                        <NavLink to='/admin/warehouselist' className="btn btn-danger ">بازگشت</NavLink>
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
export default NewWareHouse