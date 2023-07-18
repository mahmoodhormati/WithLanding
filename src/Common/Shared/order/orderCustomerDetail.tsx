import { useEffect, useReducer, useState } from "react";
import { GetAllProductSupply } from "../../../services/productSupplyService";
import { PaymentStructureEnums } from "../../Enums/PaymentStructureEnums";
import './style.css'
import InvoiceCreator from "../../../Utils/invoiceCreator";
import Modal from "react-modal";
import ImageFileUploader from "../../../Utils/ImageFileUploader";
import { OrderStatus } from "../../Enums/OrderStatusEnums";
import { ChangeOrderStatus, editOrder } from '../../../services/orderService';
import { toast } from 'react-toastify';
import config from "../../../services/config.json"
import { Link } from "react-router-dom";
import { GetAttachments } from "../../../services/attachmentService";
import QueryString from 'qs';
import { formatter } from '../../../Utils/Formatter';

const customStyles = {
    content: {
        position: 'fixed',
        inset: '-50px',
        backgroundColor: 'transparent',
        height: '100%',
        overflow: 'none',
        maxHeight: '80vh'


    }


}
interface Props {
    orderDetail: any, order: any, params: any,UpdateParent:any
}
const OrderCustomerDetail: React.FC<Props> = ({ orderDetail, order, params,UpdateParent }) => {
    const [cottageCode, setcottageCode] = useState('');
    const [idEdit, setIdEdit] = useState(0);
    const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
    const [attachments, Setattachments] = useState([])
    const [modalIsOpenUpload, setIsOpenUpload] = useState(false);
    const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)



    
    let entityId = params.id

    const handelGetAttachment = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                entityTypeId: 10,
                entityId: entityId,

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }
        };
        try {
            const { data, status } = await GetAttachments(config)
            if (status === 200) {

                Setattachments(data.result.attachments)
            }

        } catch (error) {

            console.log(error);
        }


    }
    useEffect(() => {

        handelGetAttachment()
    }, [updateValue])
    const closeModalForUpload = () => {
        setIsOpenUpload(false)
    }
    const OpenModalForUpload = () => {
        setIsOpenUpload(true)
    }


    useEffect(() => {
        // getSupplyCode()
    }, [orderDetail])
    const openModalEdit = (id: any) => {
        setIdEdit(id)
        setIsOpenEdit(true);
    }
    const closeModalEdit = () => {
        setIsOpenEdit(false);
    }
    const handelSubmit = async (e: any) => {
        e.preventDefault()

        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                entityTypeId: 10,
                entityId: entityId,

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }
        };
        try {
            const { data, status } = await GetAttachments(config)
            if (status === 200) {

                Setattachments(data.result.attachments.filter((item: any) => item.deleted === false))
                if (data.result.attachments.filter((item: any) => item.deleted === false).length > 0) {

                    const body = {
                        orderId: order.id,
                        orderStatusId: 5,
                        paymentStatusId: null,
                        conditionalPaymentTypeId: null,
                        conditionPaymentComment: null,
                        isAdmin: null

                    }
                    try {
                        const response = await ChangeOrderStatus(body)

                        if (response.status === 200) {
                            toast.success("درخواست با موفقیت ارسال شد", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined
                            });


                            UpdateParent()
                        }
                    } catch (error) {

                    }
                    
                }
                else{
                    toast.warning(" جهت ثبت درخواست بررسی بارگزاری تصویر پیش فاکتور تایید شده الزامی می باشد", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                }
            }

        } catch (error) {

            console.log(error);
        }


    }
    return (
        <div>
            <div className="form-group mb-4 textOnInput col-lg-12 rounded border  border-dark mt-4   ">
                <label>درخواست شما </label>
                <div className="table-responsive p-2 mb-5">
                    <table className="table responsive table-bordered table-hover table-striped  mt-2  mb-4">
                        <thead className='text-center'>
                            <tr className="">
                                <th> شماره عرضه</th>

                                <th> نام کالا</th>
                                <th>وزن</th>
                                <th> فی</th>
                                <th> نوع پرداخت</th>
                                <th> مبلغ کل</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetail.map((item: any) =>
                                <tr className="" >
                                    <td aria-label="شماره عرضه" className="">{item.productSupplyId}</td>

                                    <td aria-label="نام کالا" className="">{item.product.name}</td>
                                    <td aria-label="وزن " className="">{formatter.format(item.quantity)}</td>
                                    <td aria-label=" فی" className="">{formatter.format(item.basePrice)}</td>
                                    <td aria-label="نوع پرداخت" className="">{order.paymentMethodId?PaymentStructureEnums.filter(i => i.id === order.paymentMethodId).map(i => i.name)[0]:'نقدی'}</td>
                                    <td aria-label=" مبلغ کل" className="">{formatter.format(item.priceIncludingTax)}</td>
                                    <td aria-label=" وضعیت" className="">{OrderStatus.filter(i => i.id === order.orderStatusId).map(i => i.name)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {order.orderStatusId !== 13 ? <div className=" buttons   text-end  p-2 mt-4" >

                    <Link to={`/client/consular-invoice/${order.id}`} className  = "btn-success   btn m-1"  hidden={order.orderStatusId === 1}  >دریافت پیش فاکتور</Link>
                    <button className="btn btn-info m-1" hidden={order.orderStatusId === 4  ? false : true} onClick={OpenModalForUpload}>بارگزاری پیش فاکتور تایید شده</button>
                    <button className="btn-warning  m-1 btn " hidden={order.orderStatusId !== 4 ? true : false} onClick={handelSubmit}>درخواست بررسی اسناد ارائه شده </button>
                </div> : ''}
                <ImageFileUploader modalIsOpen={modalIsOpenUpload} closeModal={closeModalForUpload} EntityId={params.id} EntityTypesId={10} comment={'لطفا فایل  مورد نظر را بارگزاری کنید.'} AttchmentTypeId={1} />
            </div>

        </div>)
}
export default OrderCustomerDetail