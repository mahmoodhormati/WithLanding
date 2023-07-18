import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import { toast } from 'react-toastify';
import { SetShippingReport } from '../../../services/ShippingService';




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
    modalIsOpen: any, closeModal: any, Item: any, reload: any
}




const AddShippingIdModal: React.FC<Props> = ({ modalIsOpen, closeModal, Item, reload }) => {
    const [shippingId, SetShippingId] = useState<any>()
    const [Loading, setLoading] = useState<any>(false)
    const [Id, setId] = useState<any>()
    const [report, setreport] = useState<any>()


    const setDefault = () => {
        if (Item) {

            setreport(Item)
            const { shippingNumber,shippingId } = Item
            setId(shippingNumber)
            SetShippingId(shippingId)
        }
    }

    useEffect(() => {
        setDefault()
    }, [Item])

    const handleEditFormSubmit = async () => {


        const body = { "report": { ...report, shippingId: shippingId } }

        try {
            setLoading(true)
            const { data, status } = await SetShippingReport(body)
            if (status === 200) {
                setLoading(false)
                toast.success('وضعیت گزارش با موفقیت تغییر کرد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined

                    })
                closeModal()
                reload()
            }


        } catch (error) {
            console.log(error);
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
                <div className="card-body p-0" style={{ height: '15rem', width: '20rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">ویرایش  بارنامه {Id}</h5>
                    </div>
                    <div className="form-row mt-4 textOnInputForGrp ">

                        <div className="  form-group col-md-12 col-xs-12    ">

                            <label> شناسه حواله </label>
                            <input className='form-control' value={shippingId} onChange={(e: any) => SetShippingId(Number(e.target.value))} />





                        </div>




                    </div>

                    <div className='row mt-4 text-center'>

                        <div className='col-12 '>
                            <button className="btn btn-success  "
                                disabled={Loading} onClick={handleEditFormSubmit}>تایید
                                <ClipLoader

                                    loading={Loading}
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

export default AddShippingIdModal