import Modal from "react-modal";

import { useEffect, useState } from "react";
import { SetOrderReserve } from "../../../services/orderService";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { CreateInvoice } from '../../../services/invoiceService';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}

interface Props {
    id: any, modalIsOpen: any, closeModal:any, expireDate:any
}
const ReserveOrder: React.FC<Props> = ({ id, modalIsOpen, closeModal,expireDate }) => {
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('')
    const [reservationExpireDate, setreservationExpireDate] = useState<any>(new Date(expireDate?expireDate:''))

    const handelStartDate = (value: any) => {
    
        if (value === null) {
            setreservationExpireDate(null)
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setreservationExpireDate(new Date(value.toDate()).toJSON())



        }
    }
    const handleEditFormSubmit = async () => {
        setLoading(true)
        const datas = {
            "orderId": id,
            "reservationExpireDate": reservationExpireDate ? reservationExpireDate : null
        }

        try {
            const { data, status } = await SetOrderReserve(datas)
            if (status === 200) {
                toast.success('رزرو با موفقیت انجام شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }
            closeModal()
        } catch (e) {


            console.log(e)
            closeModal()

        }
        setLoading(false)
    }
    return (
        <Modal

            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >
            <div className="d-block clearfix mb-2" onClick={closeModal}><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x close"
                data-dismiss="alert"><line x1="18" y1="6"
                    x2="6"
                    y2="18"></line><line
                        x1="6" y1="6" x2="18" y2="18"></line></svg></div>
            <div >  
                <div className="card-body p-0 t" style={{ height: '28rem', width: '30rem' ,overflow:'auto'}}>
                    <div className="mb-4 text-left">

                        <p>در نظر داشته باشید با تغییر نوع سفارش به رزرو ، مبلغ تمام شده سفارش بر اساس تخصیص به آن سفارش ارزیابی خواهد شد و صدور صورتحساب بر اساس هر تخصیص امکان پذیر می باشد.
                            </p>

<p>همچنین پیشنهاد میگردد به دلیل جلوگیری از بروز هرگونه مشکل نسبت به تعهد صورت گرفته، تاریخ انقضا آن نظر بگیرید تا از ثبت آدرس توسط مشتری پس از تاریخ اعتبار تعهد جلوگیری گردد.
                            در صورتی که تاریخ انقضاتعهد تعیین نگردد، مشتری تا آخرین میزان توافق شده امکان ثبت آدرس را خواهد داشت</p>
                    </div>


                    <div>



                        <div className="col-lg-12 col-md-12  col-sm-12 textOnInput  mt-4">

                            <label className="" > تاریخ انقضا  </label>
                            <div className='form-group  '>
                                <DatePicker

                                    calendar={persian}
                                    locale={persian_fa}
                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                    value={reservationExpireDate}
                                    onChange={handelStartDate}
                                />

                            </div>
                        </div>







                    </div>
                </div>



           
            <div className='row '>

                <div className='col-6 '>
                    <button className="btn btn-success float-left "
                        onClick={handleEditFormSubmit} >تایید
                        <ClipLoader

                            loading={loading}
                            color="#ffff"
                            size={15}
                        /></button>
                </div>
                <div className='col-6 '>
                    <button className="btn btn-danger float-right "
                        onClick={function () {
                            closeModal()
                        }}>انصراف
                    </button>
                </div>
            </div>
        </div >


        </Modal >


    )
}
export default ReserveOrder