import React, { useState, useEffect } from 'react'
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { GetSupplier, SetSupplier } from '../../../services/supplyService';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatAlpha } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Select from 'react-select';




const EditSupplier: React.FC = () => {
    const [name, Setname] = useState('');
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const companies = useSelector((state: RootState) => state.companies)
    const [companyId, setCompanyId] = useState<any>(0)
    const [companyName, setCompanyName] = useState('')

    const getSupplierbyId = async () => {

        try {
            const { data, status } = await GetSupplier(params.id);
            if (status === 200) {

                Setname(data.result.supplier.name);
                setCompanyId(data.result.supplier.companyId)
                setCompanyName(data.result.supplier.companyName)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getSupplierbyId();
    }, [])

    const handelSubmit = async () => {
        setLoading(true)
        try {
            const supplier = {
                'supplier': {
                    id: Number(params.id),
                    name:name,
                    groupId: null,
                    companyId, companyName
                }
            }
            const { data, status } = await SetSupplier(supplier);

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


                navigate('/admin/supplierList')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

            console.log(error);
        }
        setLoading(false)

    }
    const CompaniesIDs = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش تامین کننده</h5>
                    <p>در این بخش می توانید تامین کننده را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='col-lg-6 col-xs-12 m-2'>
                    <Formik
                        initialValues={{
                            id: Number(params.id),
                            name,
                            groupId: null,
                            companyId, companyName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit()
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                            <Form>
                                <div className='form-group'>
                                    <div className='row'>
                                        <div className={companies.length > 1?"col-lg-6 col-md-6 col-sm-11 mb-3  textOnInput":"col-lg-12 col-md-12 col-sm-11 mb-3  textOnInput"}>
                                            <label >نام </label>
                                        <Field name="name" validate={validatAlpha} type="text" className="form-control opacityForInput" placeholder="نام تامیین کننده" aria-describedby="basic-addon1" value={name} onChange={(e: any) => Setname(e.target.value)} />
                                            {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}


                                        </div>
                                        {companies.length > 1 ? <div className="col-lg-6 col-md-6 col-sm-11 mb-3   textOnInput form-group "
                                            style={{ marginBottom: "3rem" }}>
                                            <div className=" form-control-sm">
                                                <label> نام شرکت </label>

                                                {companyId && companyId === null ?
                                                    <Select
                                                        menuShouldScrollIntoView ={false}
                                                        options={CompaniesIDs()}
                                                        onChange={(e: any) => {
                                                            setCompanyId(e.value)
                                                        }}
                                                    /> : <Select
                                                        value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                                        menuShouldScrollIntoView ={false}
                                                        placeholder='نام شرکت'
                                                        options={CompaniesIDs()}
                                                        onChange={(e: any) => {
                                                            setCompanyId(e.value)
                                                            setCompanyName(e.lable)
                                                            console.log(e);

                                                        }}
                                                    />}
                                                {companyId === 0 ? <span className="text-danger">یک شرکت را انتخاب کنید</span> : ''}

                                            </div>
                                        </div> : ''}
                                    </div>

                                    <div className='row mt-4 '>
                                        <div className='col-6 '>
                                            <button type="submit" disabled={loading} className="btn btn-success float-right"  >ثبت<ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>
                                        </div>
                                        <div className='col-6 '>
                                            <NavLink to='/admin/supplierList' className="btn btn-danger float-left">بازگشت</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </Form>)}</Formik>
                </div>
            </div>
        </div>

    )
}

export default EditSupplier