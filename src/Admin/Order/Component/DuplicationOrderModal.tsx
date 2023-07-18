import React, { useState } from 'react'
import Modal from 'react-modal'
import { ClipLoader } from 'react-spinners'
import { editOrder } from '../../../services/orderService'
import { toast } from 'react-toastify'


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
        border: '2px ridge black', maxHeigth: '80vh'
    }

}
interface Props {
    closeModal: any, modalIsOpen: any, order: any
}
const DuplicationOrderModal: React.FC<Props> = ({ closeModal, order, modalIsOpen }) => {

    const [duplicateId, SetduplicateId] = useState<any>(null)
    const [loading, setLoading] = useState(false);

    const OnSubmit = async () => {

        setLoading(true)
        try {

            let body = {
                "order": {
                    ...order, duplicateId: Number(duplicateId),customer:null
                }
            }

            const { data, status } = await editOrder(body)
            if (status === 200) {
                toast.success(`این سفارش تکراری از سفارش ${duplicateId} شد`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
                closeModal()
                window.location.reload()

            }
        } catch (error) {
            setLoading(false)
        }


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
                <div className="card-body p-0" style={{ height: '20rem', width: '40rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">  ثبت سفارش تکراری </h5>

                        <p>ثبت سفارش به عنوان تکراری برای سفارش های جانبی در نظر گرفته شده است که پیش از دریافت سفارش از نرم افزار جانبی، اقدامات آن در سفارشی درون سیستم انجام شده است. با این کار سفارش فعلی برچسبی تحت عنوان تکراری از سفارش مورد نظر خواهد گرفت.


                        </p>
                        <strong className='text-danger'>در نظر داشته باشید که اگر سفارش فعلی ارزش عملیاتی ندارد، نسبت به لغو آن پس از ثبت برچسب تکراری اقدام نمایید.</strong>
                    </div>
                    <div className=" d-flex justify-content-center  ">


                        <div className="  form-group col-md-6 col-xs-6 textOnInput   ">

                            <label>شماره سفارش </label>
                            <input className='form-control' type='number' value={duplicateId} onChange={e => SetduplicateId(e.target.value)} />





                        </div>
                    </div>


                </div>
                <div className=" d-flex justify-content-center  ">
                    <button type='button' className='btn btn-success' onClick={OnSubmit} disabled={ duplicateId === null || loading}>تایید
                        <ClipLoader

                            loading={loading}
                            color="#ffff"
                            size={15}
                        /></button>
                </div>
            </div>

        </Modal>
    )
}

export default DuplicationOrderModal