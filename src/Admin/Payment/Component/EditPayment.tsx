import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { EditPaymentService } from '../../../services/paymentsService';
import { toast } from 'react-toastify';




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
        border: '2px ridge black',maxHeigth:'80vh'
    }

}
interface Props {
    modalIsOpen: any, closeModal: any, Item: any, reload: any
}

const EditPayment: React.FC<Props> = ({ closeModal, modalIsOpen, Item, reload }) => {


    const [loading, setLoading] = useState(false);

    const [paymentId, SetpaymentId] = useState<any>()
    const [price, SetPrice] = useState<any>('')
    const [dueDate, SetdueDate] = useState<any>()
    const [trackingCode, SettrackingCode] = useState<any>('')
    const [comment, Setcomment] = useState<any>('')
    const [paymentMethodId, SetpaymentMethodId] = useState<any>()
    const [additionalDaysOverDueDate, SetadditionalDaysOverDueDate] = useState<any>(0)

    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    

    const setDefault = () => {
        SetpaymentId(null)
        SetPrice('')
        SetdueDate('')
        SettrackingCode('')
        Setcomment('')

        if (Item) {
            const { id, price, paymentDueDate, trackingCode, comment, paymentMethodId, additionalDaysOverDueDate } = Item

            SetpaymentId(id)
            SetPrice(price)
            SetdueDate(paymentDueDate ? new Date(paymentDueDate) : null)
            SettrackingCode(trackingCode)
            Setcomment(comment?comment:'')
            SetpaymentMethodId(paymentMethodId)
            SetadditionalDaysOverDueDate(additionalDaysOverDueDate === null ? 0 : additionalDaysOverDueDate)


          
        }
    }


    useEffect(() => {
        setDefault()
    }, [Item])
    const handelStartDate = (value: any) => {

        if (value === null) {
            SetdueDate(null)
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetdueDate(new Date(value.toDate()).toJSON())



        }
    }
    const handleEditFormSubmit = async () => {

        setLoading(true)
        const body = {
            paymentId, price, dueDate, trackingCode:trackingCode, comment:comment, additionalDaysOverDueDate
        }


        try {

            const { data, status } = await EditPaymentService(body)
            if (status === 200) {
                toast.success(" پرداخت با موفقیت تغییر کرد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });

                closeModal()
                reload()

            }


        } catch (error) {

        }
        setLoading(false)
        closeModal()
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
            <div>
                <div className="card-body p-0" style={{ height: '25rem', width: '40rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">ویرایش پرداخت شماره {paymentId}</h5>
                    </div>
                    <div className="form-row mt-4 textOnInputForGrp ">
                        <div className="  form-group col-md-6 col-xs-6  textOnInput">

                            <label>مبلغ</label>

                            <input className='form-control' value={formatter.format(price)}
                                onChange={(e: any) => {
                                    SetPrice(Number(e.target.value.replaceAll(",", "")))

                                }} />



                        </div>
                        <div className="  form-group col-md-6 col-xs-6    ">

                            <label>کد پیگیری </label>
                            <input className='form-control' value={trackingCode} onChange={(e: any) => SettrackingCode(e.target.value)} />





                        </div>

                        {paymentMethodId === 4 ? <div className="  form-group col-md-6 col-xs-6   ">

                            <label className="" > تاریخ سررسید  </label>
                            <div className='form-group  '>
                                <DatePicker

                                    calendar={persian}
                                    locale={persian_fa}
                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                    value={dueDate}
                                    onChange={handelStartDate}
                                />

                            </div>


                        </div> : ''}

                        <div className="   col-md-6 col-xs-6  mb-4">
                            <div className='input-group'>
                                <label>مهلت مازاد بر موعد پرداخت</label>
                                <input className='form-control opacityForInput rounded' type='number' value={additionalDaysOverDueDate} onChange={(e: any) => SetadditionalDaysOverDueDate(e.target.value)} min={0} max={30} />
                                {additionalDaysOverDueDate > 30 || additionalDaysOverDueDate < 0 ? <p className='text-danger'>مهلت مازاد بر موعد پرداخت باید بین 0 روز تا سی روز باشد</p> : ''}

                                <div className="input-group-append ">
                                    <span className="input-group-text"> روز </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 textOnInput'>
                        <label>توضیحات</label>
                        <textarea className='form-control' rows={4} value={comment} onChange={(e: any) => Setcomment(e.target.value)} />

                    </div>
                    <div className='row mt-4 text-center'>

                        <div className='col-12 '>
                            <button className="btn btn-success  "
                                disabled={loading || additionalDaysOverDueDate > 30 || additionalDaysOverDueDate < 0} onClick={handleEditFormSubmit}>تایید
                                <ClipLoader

                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                /></button>

                        </div>

                    </div>
                </div>
            </div>


        </Modal>


    )
}

export default EditPayment