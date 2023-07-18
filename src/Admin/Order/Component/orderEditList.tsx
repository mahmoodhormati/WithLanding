import { ChangeOrderStatus, editOrder, GetOrder, GetOrderDetails } from "../../../services/orderService";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { OrderStatus } from "../../../Common/Enums/OrderStatusEnums";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { PaymentStatusEnums } from '../../../Common/Enums/PaymentStatus';
import { ShippingStatusEnums } from '../../../Common/Enums/ShippingStatusEnums';
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
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}
interface Props{
    id:any, modalIsOpen:any, closeModal:any,updateParent:any
}
const OrderEditList:React.FC<Props> = ({ id, modalIsOpen, closeModal,updateParent }) => {

    const [order, setOrder] = useState([])
    const [loading, setLoading] = useState(false);

    const [orderStatusId, setOrderStatusId] = useState(0)
    const [paymentStatusId, setpaymentStatusId] = useState(0)
    const [shippingStatusId, setshippingStatusId] = useState(0)


    
    const getOrder = async () => {
        if(id>0){
        try {
            const { data, status } = await GetOrder(id)
            setOrder(data.result.order)
            setOrderStatusId(data.result.order.orderStatusId)
            setpaymentStatusId(data.result.order.paymentStatusId)
            setshippingStatusId(data.result.order.shippingStatusId)



        } catch (err) {
            console.log(err)
        }}
        
    }

    useEffect(() => {
        getOrder()
    }, [modalIsOpen])


    const OrderStatusID = () => {
        return (OrderStatus.map(data => ({ label: data.name, value: data.id })))
    }
    const PaymentStatusID = () => {
        return (PaymentStatusEnums.map(data => ({ label: data.name, value: data.id })))
    }
    const PaymentStatusId = () => {
        return (PaymentStatusEnums.filter(item => item.id === paymentStatusId).map(data => ({ label: data.name, value: data.id })))
    }
    const ShippingStatusID = () => {
        return (ShippingStatusEnums.map(data => ({ label: data.name, value: data.id })))
    }
    const ShippingStatusId = () => {
        return (ShippingStatusEnums.filter(item => item.id === shippingStatusId).map(data => ({ label: data.name, value: data.id })))
    }
    const OrderStatusId = () => {
        return (OrderStatus.filter(item => item.id === orderStatusId).map(data => ({ label: data.name, value: data.id })))
    }
    const handleEditFormSubmit = async (e:any) => {
        setLoading(true)
        e.preventDefault();

        const datas = {

            "order": { ...order, paymentStatusId, orderStatusId, shippingStatusId }

        }
        try {
            const { data, status } = await editOrder(datas)

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

            updateParent()

            closeModal()
        }
        catch (e) {
            setLoading(false)

            console.log(e)
            updateParent()
        }
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
                <div className="card-body p-0" style={{ height: '14rem', width: '40rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">تغییر وضعیت سفارش </h5>
                    </div>
                    <div className="form-row mt-4 textOnInputForGrp ">
                        <div className="  form-group col-md-4 col-xs-4  textOnInput">

                            <label>وضعیت سفارش </label>


                            <Select
                                menuShouldScrollIntoView ={false}
                                value={OrderStatusId()}
                                placeholder="وضعیت سفارش"
                                options={OrderStatusID()}

                                onChange={(e:any) => setOrderStatusId(e.value)}
                                maxMenuHeight={120}
                            />

                        </div>
                        <div className="  form-group col-md-4 col-xs-4    selectIndex">

                            <label>وضعیت پرداخت </label>


                            <Select
                                menuShouldScrollIntoView ={false}
                                value={PaymentStatusId()}
                                placeholder="وضعیت پرداخت"
                                options={PaymentStatusID()}

                                onChange={(e:any) => setpaymentStatusId(e.value)}
                                maxMenuHeight={120}
                            />

                        </div>
                        <div className="  form-group col-md-4 col-xs-4   ">

                            <label>وضعیت ارسال </label>


                            <Select
                                menuShouldScrollIntoView ={false}
                                value={ShippingStatusId()}
                                placeholder="وضعیت ارسال"
                                options={ShippingStatusID()}

                                onChange={(e:any) => setshippingStatusId(e.value)}
                                maxMenuHeight={120}
                            />

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
export default OrderEditList