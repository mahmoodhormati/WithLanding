import { ChangeOrderStatus, editOrder, GetOrder, GetOrderDetails } from "../../../services/orderService";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { OrderStatus } from "../../../Common/Enums/OrderStatusEnums";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { PaymentStatusEnums } from '../../../Common/Enums/PaymentStatus';
import { ShippingStatusEnums } from '../../../Common/Enums/ShippingStatusEnums';
import { ChangePaymentStatus } from "../../../services/paymentsService";
// import { getOrder } from "../Service/EditOrder";

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
        border: '2px ridge black'
    }

}
interface Props {
    payment: any, modalIsOpen: any, closeModal: any,paymentStatus:any
}
const ChangePayment: React.FC<Props> = ({ payment, modalIsOpen, closeModal,paymentStatus }) => {


    const [loading, setLoading] = useState(false);


    const[paymentStatusId,setpaymentStatusId]=useState(0)
    const [confirmed, setconfirmed] = useState(false)
    const [paid, Setpaid] = useState(false)








    const PaymentStatusID = () => {
        return (PaymentStatusEnums.map(data => ({ label: data.name, value: data.id })))
    }

    const PaymentStatusId = () => {
        return (PaymentStatusEnums.filter(item => item.id ===paymentStatus).map(data => ({ label: data.name, value: data.id })))
    }

    const handleEditFormSubmit = async (e: any) => {
        setLoading(true)
        e.preventDefault();

        const datas = {


            "paymentId": payment.id,
            "paymentStatusId": paymentStatusId,
            "confirmed": confirmed,
            "paid": paid


        }
        try {
            const { data, status } = await ChangePaymentStatus(datas)

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
            setLoading(false)

            window.location.reload()

            closeModal()
        }
        catch (e) {
            setLoading(false)

            console.log(e)
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
                <div className="card-body p-0" style={{ height: '14rem', width: '40rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">تغییر وضعیت پرداخت </h5>
                    </div>
                    <div className="form-row mt-4  ">

                        <div className="  form-group col-md-4 col-xs-4 textOnInput   selectIndex">

                            <label>وضعیت پرداخت </label>


                            <Select
                                menuShouldScrollIntoView ={false}
                                value={PaymentStatusId()}
                                placeholder="وضعیت پرداخت"
                                options={PaymentStatusID()}

                                onChange={(e: any) => setpaymentStatusId(e.value)}
                                maxMenuHeight={120}
                            />

                        </div>
                        <div className="  form-group col-md-4 col-xs-4   ">

                            <label className=" checkbox-inline ml-3">

                                <input type="checkbox" className='' checked={confirmed} onChange={(e: any) => setconfirmed(e.target.checked)} /> تایید سند بارگزاری شده</label>


                        </div>
                        <div className="  form-group col-md-4 col-xs-4   ">

                            <label className=" checkbox-inline ml-3">

                                <input type="checkbox" className='' checked={paid} onChange={(e: any) => Setpaid(e.target.checked)} /> تایید  نهایی پرداخت</label>


                        </div>

                    </div>
                    <div className='row mt-4 text-center'>

                        <div className='col-12 '>
                            <button className="btn btn-success  "
                                disabled={loading} onClick={handleEditFormSubmit}>تایید
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
export default ChangePayment