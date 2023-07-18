import {useParams} from "react-router-dom";
import {useEffect, useState, Fragment, useReducer} from "react";
import {GetOrder, GetOrderDetails} from "../../../services/orderService";
import {NavLink} from "react-router-dom";
import {GetAllOrganisationCode} from "../../../services/organisationService";
import {GetAddress} from "../../../services/addressService";
import {GetShoppingContracts, GetShoppings} from "../../../services/ShippingService";
import {GetAttachments} from "../../../services/attachmentService";
import ImagePreviewer from "../../../Utils/ImagePreviewer";
import AddAdressCustomerForOrder from "../../../Common/Shared/Common/addAdressCustomerForOrder";
import ExcelFileUploader from "../../../Utils/ExcelFileUploader";
import {UpdateShippingReport} from "../../../services/outScopeService";
import ProgressBar from "../../../Utils/progressBar";
import OrderAddress from "../../../Common/Shared/order/orderAddress";
import OrderWayBill from "../../../Common/Shared/order/OrderWayBill";

import OrderInfo from "../../../Common/Shared/order/orderInfo";
import OrderCustomerInfo from "../../../Common/Shared/order/OrderCustomerInfo";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { DeliveryMethods } from '../../../Common/Enums/DeliveryMethodsEnums';
import OrderCustomerDetail from "../../../Common/Shared/order/orderCustomerDetail";
import { OrderStatusEnumsProgressBar } from '../../../Common/Enums/OrderStatusEnumsProgressBar';
import OrderWayBillForClients from './OrderWayBillForClients';
import OrderAddressForClient from './OrderAddressForClient';
import OrderDeviationClient from "./OrderDeviationClient";
import QueryString from "qs";
import CustomerAttachment from "./CustomerAttachment";



const OrderDetailTest:React.FC = () => {
    const params = useParams()
   
    const [modalIsOpenUpload, setIsOpenUpload] = useState(false);
    const [modalIsOpenUploadExcel, setIsOpenUploadExcel] = useState(false);
    const [order, setOrder] = useState<any>([])
    const [isOpenAddress, setIsOpenAddress] = useState(false)
    const [orderPaymentStatusId, setorderPaymentStatusId] = useState<any>()

    const [customerDetail, setCustomerDetail] = useState<any>([])
    const [product, setProduct] = useState([])
    const [ShippingInformation, SetShippingInformation] = useState([]);
    const [organization, setOrganization] = useState([]);
    let [Detail, setDetail] = useState<any>([]);
    const [Shipping, SetShipping] = useState([])
    const [ShippingContracts, SetShippingContracts] = useState([])
    const [OrderWeight,SetOrderWeight]=useState(0)
  const [modalSarakOpen, SetModalSarakOpen] = useState(false)
  const [orderId, setOrderId] = useState(0)
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)


    let [loading, setLoading] = useState(false);

    const GetShipping = async () => {
        try {
            const {data, status} = await GetShoppings(params.id)
            SetShipping(data.result.shippings.values)

        } catch (e) {
            console.log(e)
        }
    }
   
    const openSarakModal = (id: any) => {
        setOrderId(id)
        SetModalSarakOpen(true)
      }
      const CloseSarakModal = () => {
    
        SetModalSarakOpen(false)
      }
    

    const closeModalForUpload = () => {
        setIsOpenUpload(false)
    }
    const closeModalIsOpenUploadExcel = () => {
        setIsOpenUploadExcel(false)
    }
    const openModalAddress = () => {
        setIsOpenAddress(true);
    }
    const closeModalAddress = () => {
        setIsOpenAddress(false);
    }
    const getOrganizationName = async () => {
        try {
            const {data, status} = await GetAllOrganisationCode();
            if (status === 200) {
                setOrganization(data.result.organizationLists.values)
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const getOrder = async () => {
        try {
            const {data, status} = await GetOrder(params.id)
            setCustomerDetail(data.result.order.customer)
            setorderPaymentStatusId(data.result.order.paymentStatusId)

            setOrder(data.result.order)
            
        } catch (err) {
            console.log(err)
        }
    }
  
    const returnHavaleSum=()=>{
        var sum=0

        if(Shipping){
            Shipping.forEach((item:any)=>sum+=item.plannedQuantity)
        }
        return sum
    }

    const returnBarbariSum=()=>{
        var sum=0

        if(Shipping){
            Shipping.forEach((item:any)=>sum+=item.shippedQuantity)
        }
        return sum
    }




    const getOrderDetail = async () => {
        try {
          const { data, status } = await GetOrderDetails(Number(params.id));
          if (status === 200) {
            setDetail(  data.result.orderDetails)
            setProduct(data.result.orderDetails[0].product);
    
           
    
            var sum = 0;
            data.result.orderDetails.forEach((item: any) => (sum += item.quantity));
            SetOrderWeight(sum);
          }
        } catch (err) {
          console.log(err);
        }
      };
    useEffect(() => {
        getOrder()
        getOrderDetail()
        GetShipping()
}, [updateValue])

    const customerName = () => {
        let fName = customerDetail.firstName;
        let lName = customerDetail.lastName;
        let OName;
        if (customerDetail.organizationId > 0) {

            OName = organization.filter((item:any) => item.id === customerDetail.organizationId).map((item:any) => item.name)
        }
        let fullname = `${fName ? fName : ''} ${lName ? lName : ''} ${OName ? OName : ''}`;
        return (fullname)
    }

   
    const update = async () => {
        setLoading(true)
        try {
            const {data, status} = await UpdateShippingReport()
            if (status === 200) {
                setLoading(false)
            }
        } catch (e) {
            console.log(e)
        }
    }
    let orderDetailId;
    let measureUnitId;
    let detailAddress;
    var sumTakhsis=0


    if(Detail.length>0){
        let count=Detail.length
        orderDetailId=(Detail.filter((item:any)=>item.addressId===null)[0]?Detail.filter((item:any)=>item.addressId===null)[0].id:Detail[count-1].id)
        measureUnitId=Detail[0].measureUnitId
        detailAddress=Detail


        let newArr= Detail.filter((item:any)=>item.addressId!==null)

        if(newArr.length>0){

            newArr.forEach((item:any)=>sumTakhsis+=item.quantity)
        }
        else{
            sumTakhsis=0
        }
    }


    const number = OrderStatusEnumsProgressBar.filter((item:any)=> item.id === order.orderStatusId).map((item:any)=> item.number)[0]


    return (
        <Fragment>
            <div className='user-progress'>
                <div>
                    <div className="shadow border border-2" >
                        <OrderCustomerInfo  order={order} product={product} customerDetail={customerDetail} customerName={customerName}/>
                        {number !== 12 || number > 4   ?   <OrderInfo orderWeight={OrderWeight} TakhsisWeight={sumTakhsis} havalehWeight={returnHavaleSum()} barbariWeight={returnBarbariSum()}/>:''}
                    </div>
                    <div className=" statbox widget-content widget-content-area text-dark mainMenu">
                        <ProgressBar  number={number} id={order.orderStatusId} order={order}  update={ForceUpdate}/>
                        { number === 12 || number < 4 ? <><OrderCustomerDetail  params={params} order={order}  orderDetail={Detail}  UpdateParent={ForceUpdate}/>
                               <CustomerAttachment order={order} params={params} 
                                                                  closeModalForUpload={closeModalForUpload}
                                                                  modalIsOpenUpload={modalIsOpenUpload}
                                                                  setIsOpenUpload={setIsOpenUpload}
                                                                 
                                                                  />
                            </>
                            :
                            (
                                <><OrderAddressForClient   details={Detail}  orderWeight={OrderWeight} TakhsisWeight={sumTakhsis} getOrder={getOrder} order={order} paymentStatus={orderPaymentStatusId} update={ForceUpdate} />
                                    <OrderWayBillForClients loading={loading} idOrder={params.id}/>
                                   <CustomerAttachment  order={order} params={params} 
                                                                     closeModalForUpload={closeModalForUpload}
                                                                     modalIsOpenUpload={modalIsOpenUpload}
                                                                     setIsOpenUpload={setIsOpenUpload}
                                                                     /></>)}

                    </div>
                </div>
                <div className="py-5 ">
                    <button className="btn btn-danger  float-right m-1 ">
                        <NavLink className="text-light" to='/client/orderList'>بازگشت</NavLink>
                    </button>
                    {order.orderStatusId === 12 ? <button className="btn btn-info  float-right m-1 " onClick={() => openSarakModal(order.id)}>
                    مشاهده کسری و سرک
          </button> : ''}
          <OrderDeviationClient modalIsOpen={modalSarakOpen} closeModal={CloseSarakModal } id={orderId} />
                </div>
               
                <ExcelFileUploader modalIsOpen={modalIsOpenUploadExcel} closeModal={closeModalIsOpenUploadExcel}
                                   EntityId={orderDetailId} EntityTypesId={11}
                                   comment={'لطفا فایل اکسل مطابق نمونه اطلاعات ارسال را بارگزاری کنید'} update={ForceUpdate}/>
            </div>
        </Fragment>
    )
}
export default OrderDetailTest