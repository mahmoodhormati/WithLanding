import { useEffect, useState } from "react";
import { ChangeOrderStatus, GetOrder } from "../../../services/orderService";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Select from "react-select";
import { PaymentStatusEnums } from "../../Enums/PaymentStatus";
import { ConditionalPaymentTypes } from "../../Enums/ConditionalPaymentTypes";
import { PaymentFinancialConfirmtion } from "../../Enums/paymentFinancialConfirmtion";
import {ClipLoader} from "react-spinners";
import { SetConditionalPay } from '../../../services/orderService';

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
interface Props{

    id:number,modalIsOpen:any, closeModal:any
}
const FinancialConfirmation:React.FC<Props> = ({ id, modalIsOpen, closeModal }) => {
    const [StatusId, setId] = useState(0)
    const [conditionPaymentComment, SetconditionPaymentComment] = useState('')
    let paymentStatusId = 0
    let conditionalPaymentTypeId:any = 0
    let [loading, setLoading] = useState(false);


    const handleEditFormSubmit = async () => {
        setLoading(true)
       if (StatusId === 2) {
           
            conditionalPaymentTypeId = 1


        } if (StatusId === 3) {
         
            conditionalPaymentTypeId = 2


        }


        const datas = {

            orderId: id,
            conditionalPaymentTypeId,
            conditionPaymentComment: StatusId === 2 ? conditionPaymentComment : null,
            
        }

        try {
            const { data, status } = await SetConditionalPay(datas)

            if (status===200) {
                toast.success('تایید با موفقیت انجام شد', {
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
            setLoading(false)

            console.log(e)
            closeModal()

        }
        setLoading(false)
    }
    const PaymentStatus = () => {
        return (PaymentFinancialConfirmtion.map(data => ({ label: data.name, value: data.id })))
    }

    return (
        <Modal

            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}>
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
                <div className="mt-4" style={{ height: '14rem', width: '20rem' }}>

                    <div className="row">

                        <div className="col-lg-12 col-md-12  col-sm-12    textOnInput form-group  " style={{ marginBottom: "4rem" }}>
                            <div className=" form-control-sm">
                                <label>نوع تایید</label>

                                <Select
                                    menuShouldScrollIntoView ={false}
                                    placeholder='نوع تایید'
                                    options={PaymentStatus()}
                                    onChange={(e:any) => { setId(e.value) }}
                                />
                            </div>
                        </div>



                    </div>


                    {StatusId === 2 ?
                        <div className="form-group  textOnInput">
                            <label >توضیحات</label>

                            <textarea  className="form-control opacityForInput " rows={4} placeholder='توضیحات تکمیلی' value={conditionPaymentComment} onChange={(e:any) => {
                                SetconditionPaymentComment(e.target.value)

                            }} />

                        </div>
                        : null}
                </div>
                <div className='row  '>

                    <div className='col-6 '>
                        <button className="btn btn-success  "
                           disabled={loading} onClick={handleEditFormSubmit} >تایید
                            <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                    </div>
                    <div className='col-6 '>
                        <button className="btn btn-danger float-right"
                            onClick={function () {
                                closeModal()
                            }}>انصراف
                        </button>
                    </div>
                </div>
            </div>


        </Modal>


    )
}
export default FinancialConfirmation