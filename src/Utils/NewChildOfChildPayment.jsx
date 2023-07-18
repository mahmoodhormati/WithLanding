import React, { useState } from 'react'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import DatePicker from 'react-multi-date-picker'
import Select from 'react-select'
import { data } from '../Common/Shared/Chart/chartPie'
import { ImCross } from 'react-icons/im'
import { formatter } from './Formatter'
import { toast } from 'react-toastify'
import { AiFillPicture, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import './styleForInput.css'

const NewChildOfChildPayment = ({ currentPayment, id, childOFchildPayment, setChildOfChildPayment, setPays, pay}) => {



    const [children, setChidren] = useState([{
        
        id:id
        ,price: 0, trackingCode: '',
        date: currentPayment[0].shouldAnnounceDueDate ? new Date() : null,
        file: [],
        disable: false,
        show: true
    }
    ])



    const submit=(item)=>{


setPays([...pay,item])

    }

    const remove=(id)=>{

setPays([...pay.filter(i=>i.id!==id)])

    }

    return (
        <>
            {children.filter(i => i.show === true).map((item, index) => (
                <div className='border m-1' key={index+2000}>


                    <div className='row m-auto   col-12'>

                        <div className="col-md-3 mt-4 mb-4 textOnInput">
                            <label>مبلغ</label>
                            <input

                                value={formatter.format(item.price)}
                                type='text'
                                name="price"

                                disabled={item.disable}
                                className="form-control"
                                onChange={
                                    (e) => setChidren([{ ...item, price: Number(e.target.value.replaceAll(",", "")) }])

                                    
                               
                                }

                            />


                        </div>
                        <div className={currentPayment[0].shouldAnnounceDueDate ? "col-md-2 mt-4 mb-4 textOnInput" : "col-md-3 mt-4 mb-4 textOnInput"}>
                            <label>شماره پیگیری</label>

                            <input

                                name="trackingCode"
                                type="text"
                                className="form-control opacityForInput"
                                disabled={item.disable}
                                value={item.trackingCode}
                                onChange={e => setChidren([{ ...item, trackingCode: e.target.value  }])}
                            />
                            {item.trackingCode === '' ? <p className='text-center text-danger'>وارد کردن شماره پیگیری الزامیست</p> : ''}
                        </div>

                        {currentPayment[0].shouldAnnounceDueDate ?
                            <div className="col-md-3 mt-4 mb-4 textOnInput">


                                <label className="date-piker-form">سررسید</label>
                                <div className="  ">
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{
                                            height: "45.39px",
                                            width: "100%",
                                            textAlign: "center",
                                        }}
                                        disabled={item.disable}
                                        value={item.date}
                                        onChange={e => setChidren([{ ...item, date: new Date(e.toDate()).toJSON()  }])}

                                    />
                                </div>
                            </div>
                            : ''}



                        <div className="col-md-3 m-auto text-center">

                            <div className='row'>
                                <div className=''>
                                    <div className='col-12 text-center'>
                                        {item.file.length > 0 ? item.file.map(i => (

                                            <img
                                                src={URL.createObjectURL(i[0])}
                                                className="img-fluid image-hover rounded text-center"
                                                style={{ width: '15vw', maxHeight: '10rem' }}
                                            />



                                        ))


                                            : ''}

                                    </div>
                                </div>
                                <div className='col-12 '>
                                    {item.file.length === 0 ? <>


                                        <label className='btn btn-warning  w-20 '>آپلود تصویر <AiFillPicture /><input type="file" id="upload" accept='image/jpeg, image/png' style={{ visibility: 'hidden' }} onChange={
                                            e => {
                                                let ext = e.target.files[0].type;
                                                switch (ext) {
                                                    case 'image/jpeg':
                                                    case 'image/jpg':
                                                    case 'image/png':
                                                    case 'image/webp':
                                                    case 'image/apng':
                                                    case 'image/svg+xml':

                                                        setChidren([{ ...item, file: [e.target.files] }])

                                                        break;

                                                    default:

                                                        toast.warning('فایل بارگزاری شده حتما باید عکس باشد', {
                                                            position: "top-right",
                                                            closeOnClick: true
                                                        });
                                                }
                                            }

                                        } />

                                        </label>

                                    </>


                                        :

                                        <div className='text-center'>


                                            <button

                                                onClick={() => setChildOfChildPayment([{ ...childOFchildPayment, ...item, file: [] }])}
                                                className="border-0 bg-transparent non-hover"
                                            >
                                                <ImCross size="1rem" color="red" title="حذف عکس" />
                                            </button>
                                        </div>}
                                </div>

                            </div>
                        </div>
                        <div className="col-md-5 m-auto">

                        </div>


                        <div className="col-md-5 m-auto">

                        </div>
                    </div>
                    <div className='d-flex justify-content-center mb-2'>

                        <button type='button' className='btn btn-sm btn-success m-1 ' title='ذخیره تغییرات' disabled={item.disable|| item.file.length===0 ||item.trackingCode===''} onClick={() => {
                            setChidren([{ ...item, disable: true }])

                            submit(item)
                           
                        }}>تایید</button>
                        <button type='button' className='btn btn-sm btn-danger m-1 ' title='حذف' onClick={() =>{ setChidren([{ ...item, show: false }])
                        remove(item.id)
                    }} >حذف</button>


                    </div>

                </div>))
            }




        </>
    )
}

export default NewChildOfChildPayment