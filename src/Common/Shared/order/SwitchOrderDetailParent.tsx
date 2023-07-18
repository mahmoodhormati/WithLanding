import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ClipLoader } from 'react-spinners'
import { formatter } from '../../../Utils/Formatter'
import { GetAllProductWithSearch, GetProductSupply } from '../../../services/productSupplyService'
import QueryString from 'qs';
import Select from 'react-select'
import { PaymentStatusEnums } from '../../Enums/PaymentStatus'
import { PaymentStructureEnums } from '../../Enums/PaymentStructureEnums'
import { GetOrderDetailsForSwitch, SetSwitchOrderDetailParent, editOrderDetail } from '../../../services/orderService'
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

    modalIsOpen: any, closeModal: any, order: any, currentDetailId: any, update: any,isUser:any
}

const SwitchOrderDetailParent: React.FC<Props> = ({ currentDetailId, modalIsOpen, closeModal, order, update,isUser }) => {

    const [OrderDetails, SetOrderDetails] = useState([])
    const [checked, setChecked] = useState({ selectedValue: 0 })
    let [loading, setLoading] = useState(false);


    const submit=async()=>{
        if(checked.selectedValue!==0){
       setLoading(true)
       let body;
       try {
        
        if(isUser===false){
         body={
            "isAdmin": true,
            "orderDetailId": currentDetailId,
            "parentId": checked.selectedValue
          }
        }
        else{
            body={
                
                "orderDetailId": currentDetailId,
                "parentId": checked.selectedValue
              }
        }

          const{data,status}=await SetSwitchOrderDetailParent(body)
          if(status===200){
            toast.success("جزییات با موفقیت ویرایش شد", {
                position: "top-right",
                closeOnClick: true,
            });

            setLoading(false)

            closeModal()
            
            update()

          }


       } catch (error) {
        setLoading(false)
       }
    }
    }

    const GetOrderDetails = async () => {
        if (currentDetailId && currentDetailId !== 0 && modalIsOpen === true)
            try {

                const { data, status } = await GetOrderDetailsForSwitch(order.id)
                if (status === 200) {
                    SetOrderDetails(data.result.orderDetails)
                }
            } catch (error) {

            }
    }

    useEffect(() => {


        GetOrderDetails()
    }, [currentDetailId])

    const CheckedHadnler = (conditionId:any) => {


        setChecked({ selectedValue: conditionId })


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
                <div className="card-body p-0 containerT" style={{ maxWidth: '70vw' }} >

                    {OrderDetails.length > 0 ?

                        (<div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th> #</th>
                                        <th> کالا</th>
                                        <th>قیمت پایه</th>
                                        <th>وزن مانده </th>
                                        <th> ارزش کالا</th>
                                        <th> عرضه</th>
                                        <th>نحوه پرداخت</th>
                                        <th>بازه پرداخت</th>
                                        <th> تاریخ</th>
                                        <th>توضیحات</th>
                                        <th>انتخاب</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {OrderDetails.map((item: any) => (

                                        <tr key={item.id}>
                                            <td data-th="  #" className="text-center">
                                                {item.id}
                                            </td>
                                            <td
                                                data-th="  نام کالا"
                                                className="text-center"
                                            >
                                                {item.product.name}
                                            </td>
                                            <td
                                                data-th="  قیمت پایه"
                                                className="text-center"

                                            >


                                                {formatter.format(item.basePrice)}

                                            </td>
                                            <td
                                                data-th="  وزن مانده"
                                                className="text-center"

                                            >


                                                {formatter.format(item.quantity)}

                                            </td>
                                            <td

                                                className="text-center"
                                            >
                                                {formatter.format(item.priceIncludingTax)}
                                            </td>
                                            <td className="text-center">
                                                {item.productSupplyId
                                                    ? item.productSupplyId
                                                    : ""}
                                            </td>
                                            <td

                                                className="text-center"
                                            >
                                                {item.paymentMethodId
                                                    ? PaymentStructureEnums.filter(
                                                        (x) => x.id === item.paymentMethodId
                                                    ).map((q) => q.name)
                                                    : order.paymentMethodId ? PaymentStructureEnums.filter(
                                                        (x) => x.id === order.paymentMethodId
                                                    ).map((q) => q.name) : 'نقدی'}
                                            </td>
                                            <td

                                                className="text-center"
                                            >
                                                {item.paymentMethodId && item.paymentMethodId === 4
                                                    ? `${item.installmentOccureCount} قسط ${item.installmentPeriod} روزه`
                                                    : ""}
                                            </td>
                                            <td data-th=" تاریخ" className="text-center">
                                                {new Date(item.createDate).toLocaleDateString(
                                                    "fa-IR"
                                                )}
                                            </td>
                                            <td>{item.comment}</td>
                                            <td><input type="radio" checked={item.id===checked.selectedValue?item.id:false } name={item.id}  onChange={(e) => CheckedHadnler(item.id)} /></td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>


                            <div className="text-center mt-4">
                            <button className=" btn btn-success" disabled={loading} onClick={submit}>ثبت </button>
                            </div>
                        
                            

                        </div>)

                        : <div className='text-center'>
                            
                            <p>جزییات سفارش  فاقد تخصیص وجود ندارد.</p>
                            </div>}


                </div>
            </div>


        </Modal>
    )
}

export default SwitchOrderDetailParent