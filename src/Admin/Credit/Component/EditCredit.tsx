import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';

import { validatAlpha, validateRequired, validatNumber } from "../../../Utils/validitionParams";
import { Field, Form, Formik } from "formik";
import { CreateCredit, GetCreditById } from "../../../services/creditService";
import Select from 'react-select';
import { PriceUnitEnums } from './../../../Common/Enums/PriceUnit';
const EditCredit: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);
    const [priceUnitId, setpriceUnitId] = useState(0)
    const [value, SetValue] = useState<any>('')
    const [comment, Setcomment] = useState('')


    const param = useParams()

    const getCredit = async () => {

        try {
            const { data, status } = await GetCreditById(param.id)
            if (status === 200) {

                setName(data.result.credit.name)
                setpriceUnitId(data.result.credit.priceUnitId)
                SetValue(data.result.credit.value)
                Setcomment(data.result.credit.comment)
            }

        } catch (error) {
            console.log(error);

        }


    }

    useEffect(()=>{

        getCredit()

    },[])


    const submit = async () => {

        const body = {

            id: param.id,
            name,
            priceUnitId,
            value,
            comment:comment



        };
        setLoading(true)
        try {
            const { data, status } = await CreateCredit(body);
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
                navigate('/admin/Credits')

            }


        }

        catch (error) {
            console.log(error);
        }

        setLoading(false)
    };

    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    const units = () => {

        return (PriceUnitEnums.map((item: any) => ({ label: item.name, value: item.id })))

    }
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5>تعریف گروه اعتباری</h5>
                    <p>در این بخش می توانید گروه اعتباری جدید تعریف کنید</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-md-8 col-xs-12 m-2'>
                    <Formik
                        initialValues={{
                            id: null,
                            name,
                            value, priceUnitId, comment
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit()
                        }}>

                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                            <Form >
                                <div className="n-chk d-flex  mb-4">

                                    <div>

                                    </div>


                                </div>


                                <div className="form-group mb-4 textOnInput">
                                    <div className='form-row'>
                                        <div className='col-4 '>
                                            <label >  نام </label>
                                            <Field validate={validatAlpha} name="name" type="text" className="form-control opacityForInput" value={name} onChange={(e: any) => {
                                                setName(e.target.value)

                                            }} />
                                            {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                        </div>

                                        <div className="col-4">
                                            <label >میزان اعتبار</label>
                                            <Field validate={validatNumber} name="quantity" type="text" className="form-control opacityForInput" value={formatter.format(value)}
                                                   onChange={(e: any) => {
                                                       SetValue(Number(e.target.value.replaceAll(",", "")))

                                                   }} />
                                            {errors.value && touched.value && <div className="text-danger">{String(errors.value)}</div>}
                                        </div>


                                        <div className="col-4 " >
                                            <label>واحد</label>

                                            {priceUnitId === 0 ? (
                                                <>

                                                    <Select
                                                        placeholder='واحد'


                                                        options={units()}
                                                        onChange={(e: any) => {
                                                            setpriceUnitId(e.value)

                                                        }}
                                                    />
                                                    <p style={{ color: 'red' }}>لطفا این فیلد را پر کنید</p>

                                                </>
                                            ) : ( <Select
                                                placeholder='واحد'

                                                value={units().filter((i:any)=>i.value===priceUnitId).map((i: any) => i)}
                                                options={units()}
                                                onChange={(e: any) => {
                                                    setpriceUnitId(e.value)

                                                }}
                                            />)}
                                        </div>
                                    </div></div>

                                <div className="form-group mb-4 textOnInput" style={{ position: 'relative' }}>


                                </div>
                                <div className="form-group mb-4 textOnInput">
                                    <label >توضیحات</label>

                                    <Field name="comment" as="textarea" className="form-control opacityForInput " rows='4' placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) => {
                                        Setcomment(e.target.value)

                                    }} />
                                    {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                </div>



                                <div className='row justify-content-between'>
                                    <div className='col-6  '>
                                        <button type="submit" disabled={loading} className="btn btn-success float-right" onClick={submit} >ثبت<ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>                                </div>
                                    <div className='col-6  '>
                                        <NavLink to='/admin/Credits' className="btn btn-danger ">بازگشت</NavLink>
                                    </div>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>

    );
}
export default EditCredit