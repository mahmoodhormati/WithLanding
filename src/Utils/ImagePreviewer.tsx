import React from 'react'
import Modal from 'react-modal';
import { DeleteAttachments, SetAttachmentType } from "../services/attachmentService";
import { toast } from "react-toastify";
import { useState } from "react"
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatmin10, validatNumber } from "./validitionParams";
import { FiRotateCcw, FiRotateCw } from 'react-icons/fi';

const attachmet = (window as any).globalThis.stie_att
const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '3%',
        border: '2px ridge black',
        maxHeight:'80vh',
        maxWidth:'70vw'


    }

}

interface Props {

    modalIsOpen: any, closeModal: any, item: any, isUser: any, orderStatus: any
}


const ImagePreviewer: React.FC<Props> = ({ modalIsOpen, closeModal, item, isUser, orderStatus }) => {
    const [trackingCode, setTrackingCode] = useState(0)
    const [value, setValue] = useState(0)
    const [dueDate, setDueDate] = useState(item.dueDate)
    const [chacked, setchacked] = useState(false)
    const [open, setClose] = useState(false)
    let [loading, setLoading] = useState(false);
    const [rotate, setRotate] = useState(0)


    const rotateLeft = () => {

        setRotate(rotate => rotate + 90)
    }
    const rotateright = () => {

        setRotate(rotate => rotate - 90)
    }


    const openModelDelete = () => {
        setClose(true)
    }
    const closeModelDelete = () => {
        setClose(false)
    }

    const datas = {
        attachmentId: item.id,
        name: '',
        attachmentTypeId: 2,
        trackingCode,
        value,
        dueDate: new Date(),
    }

    const submitAttachment = async () => {
        setLoading(true)
        try {
            const { data, status } = await SetAttachmentType(datas)
            closeModal()

            if (status === 200) {
                toast.success("اطلاعات سند ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                window.location.reload()

            }
        } catch (e) {

            console.log(e)
        }
        setLoading(false)

    }
    const handelDelete = async (e: any) => {
        setLoading(true)
        e.preventDefault()
        try {

            const { data, status } = await DeleteAttachments(item.id)
            if (status === 200) {

                toast.success("ویرایش با موفقعیت انجام شد", {
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
        setLoading(false)
    }
    const handelStartDate = (value: any) => {
        if (value === null) {
            setDueDate('')

        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setDueDate(value.toDate())


        }
    }
    var formatter = new Intl.NumberFormat('fa-IR', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    return (

        <Modal

            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >

            <div className="d-block clearfix mb-2" onClick={closeModal}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x close"
                    data-dismiss="alert">
                    <line x1="18" y1="6"
                        x2="6"
                        y2="18"></line>
                    <line
                        x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <div className='m-auto' >

                <div className='text-center  containerTFull' style={{  zIndex:0}}>
                
                    <img style={{
                        maxWidth:  "100%",
                        maxHeight:  '100%',
                       
                        transform:`scale(0.8) rotate(${rotate}deg)`
                        
                        
                    }} src={`${attachmet}${item.path}`} className="img-fluid m-auto" alt={item.name} />

                    
                    
                </div>
                
                <Formik
                    initialValues={{
                        attachmentId: item.id,
                        name: '',
                        attachmentTypeId: 2,
                        trackingCode,
                        value,
                        dueDate: new Date(),
                    }}
                    enableReinitialize={true}
                    onSubmit={values => {
                        // same shape as initial values
                        submitAttachment()
                    }}>
                    {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                        <Form >
                            {!isUser ? <div className="row ">

                                {item.trackingCode || chacked === true ?
                                    <div className="col-12 text-center p-4">
                                        <div className="row  text-center form-row textOnInput">

                                            <div className="col-lg-3">
                                                <label>شماره چک</label>
                                                <Field validate={validatNumber} name="trackingCode" hidden={item.trackingCode} className="form-control opacityForInput  mb-4"
                                                    type="text" value={trackingCode}
                                                    onChange={(e: any) => {
                                                        setTrackingCode(e.target.value)
                                                    }} />
                                                {errors.trackingCode && touched.trackingCode && <div className="text-danger">{errors.trackingCode}</div>}

                                                {item.trackingCode ? <p className=" img-caption p-3 border">{item.trackingCode}</p> : null}

                                            </div>
                                            <div className="col-lg-3">
                                                <label>مبلغ چک</label>
                                                <Field validate={validatNumber} name="value" hidden={item.value} className="  form-control opacityForInput  mb-4"
                                                    type="text" value={value} onChange={(e: any) => {
                                                        setValue(e.target.value)
                                                    }} />
                                                {errors.value && touched.value && <div className="text-danger">{errors.value}</div>}
                                                {item.value ? <p className=" img-caption p-3 border">{formatter.format(item.value)}</p> : null}
                                            </div>

                                            <div className="col-lg-3">

                                                <label style={{
                                                    position: 'absolute',
                                                    zIndex: '1',
                                                    top: '-15px',
                                                    right: '10px',
                                                    background: 'none',
                                                    padding: '0 8px'
                                                }}>موعد چک</label>
                                                {item.dueDate ? <p className=" img-caption p-3 border">{new Date(item.dueDate).toLocaleDateString('fa-IR')}</p> : <div className='form-group  '>
                                                    <DatePicker
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                        value={dueDate}
                                                        onChange={handelStartDate}
                                                    />

                                                </div>}
                                            </div>

                                            {item.trackingCode ? null : <div className="col-3 text-center">
                                                <button type="submit" disabled={loading} className="btn btn-success  float-right" >ثبت سند
                                                    مالی
                                                    <ClipLoader

                                                        loading={loading}
                                                        color="#ffff"
                                                        size={15}
                                                    />
                                                </button>
                                            </div>}
                                        </div>

                                    </div>
                                    : ""}
                            </div>
                                : null}

                        </Form>
                    )}
                </Formik>
                <div className=' d-block   '>
                    <div className='m-1'>
                        <button disabled={chacked || loading} hidden={isUser && orderStatus >= 3} onClick={() => openModelDelete()
                        }
                            className="btn btn-danger float-left">حذف
                            <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                    </div>

                    <div className='m-1'>
                        <button onClick={() => closeModal()} className="btn btn-primary float-right">بازگشت</button>
                    </div>
                </div>
            </div>

           
            <Modal

                isOpen={open}
                onRequestClose={closeModelDelete}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >
                <div>آیا مایلید تصویر را حذف کنید؟</div>
                <div className=' d-block   '>
                    <div className='m-1'>
                        <button disabled={chacked || loading} hidden={isUser && orderStatus >= 3} onClick={handelDelete}
                            className="btn btn-success float-left">حذف
                            <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                    </div>

                    <div className='m-1'>
                        <button onClick={() => closeModelDelete()} className="btn btn-danger float-right">خیر</button>
                    </div>
                </div>
            </Modal>
            <div className='d-flex justify-content-around m-2' style={{zIndex:1000}}>
            <FiRotateCw size={'1.5rem'} onClick={rotateLeft} />
                <FiRotateCcw size={'1.5rem'} onClick={rotateright} />
              
                </div>
        </Modal>
    )


}

export default ImagePreviewer