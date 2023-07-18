import React, { useState } from 'react'
import Modal from 'react-modal'
import { ClipLoader } from 'react-spinners'
import { MergeExternalOrderWithInteral } from '../../../services/orderService'
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
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}


interface Props {
    baseId: any, modalIsOpen: any, closeModal: any
}
const MergeExternalOrderWithInteralOrder: React.FC<Props> = ({ baseId, modalIsOpen, closeModal }) => {

    const [loading, setLoading] = useState(false);
    const [orderWithExtId, setorderWithExtId] = useState<number>(0)



    const handleMergeSubmit = async () => {
        setLoading(true)
        const body = {

            "baseOrderId": orderWithExtId,
            "orderWithExtId": baseId
        }
        try {


            const { data, status } = await MergeExternalOrderWithInteral(body)

            if (status === 200) {
                toast.success(`سفارش ${orderWithExtId} با موفقیت با سفارش ${baseId} ادغام شد`, {
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
            setLoading(false)


        } catch (error) {

            console.log(error);
            closeModal()
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
            <div >
                <div className="card-body p-0 t" style={{ height: '10rem', width: '30rem', overflow: 'auto' }}>
                    <div className="mb-4 text-left">

                        <p className=''>
                            در نظر داشته باشید  که سفارش پایه <strong className='text-danger'>حتما</strong> با سفارش بازارگاهی از لحاظ جزییات سفارش یکی باشند(تعداد و وزن) و هر دو در وضعیتی قبل از <strong className='text-danger'> تایید درخواست</strong> توسط ادمین باشند.
                        </p>


                    </div>


                    <div>



                        <div className="col-lg-12 col-md-12  col-sm-12 textOnInput  mt-4">

                            <label className="" > شماره سفارش ثانویه  </label>
                            <input className='form-control' type='number' value={orderWithExtId} onChange={(e: any) => setorderWithExtId(e.target.value)} />

                        </div>







                    </div>
                </div>




                <div className='row '>

                    <div className='col-6 '>
                        <button className="btn btn-success float-left " disabled={loading || orderWithExtId <= 0}
                            onClick={handleMergeSubmit} >تایید
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


        </Modal >)
}

export default MergeExternalOrderWithInteralOrder