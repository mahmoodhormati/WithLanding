import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, Fragment, useReducer } from "react";
import { GetOrder, GetOrderDetails } from "../../../services/orderService";
import { NavLink } from "react-router-dom";
import {
  GetAllOrganisation,
  GetAllOrganisationCode,
  GetOrganisationByIdAdmin,
} from "../../../services/organisationService";
import { GetAddress } from "../../../services/addressService";
import {
  GetShoppingContracts,
  GetShoppings,
  GetShoppingsAdmin,
} from "../../../services/ShippingService";
import { GetAttachments } from "../../../services/attachmentService";
import ImagePreviewer from "../../../Utils/ImagePreviewer";
import ExcelFileUploader from "../../../Utils/ExcelFileUploader";
import { UpdateShippingReport } from "../../../services/outScopeService";
import ProgressBar from "../../../Utils/progressBar";
import OrderAddress from "../../../Common/Shared/order/orderAddress";
import OrderWayBill from "../../../Common/Shared/order/OrderWayBill";
import OrderAttachment from "../../../Common/Shared/order/OrderAttachment";
import OrderInfo from "../../../Common/Shared/order/orderInfo";
import OrderCustomerInfo from "../../../Common/Shared/order/OrderCustomerInfo";
import OrderAdminDetail from "../../../Common/Shared/order/OrderAdminDetail";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";
import { OrderStatusEnumsProgressBar } from "../../../Common/Enums/OrderStatusEnumsProgressBar";
import FadeLoader from "react-spinners/FadeLoader";
import { GetOrderDetailsAdmin } from "../../../services/orderService";
import InvoicesForOrder from "../../../Common/Shared/order/InvoicesForOrder";
import OrderDeviationAdmin from "./OrderDeviationAdmin";
import QueryString from "qs";
import DuplicationOrderModal from "./DuplicationOrderModal";
import OrderConfirmation from "../../../Common/Shared/order/orderConfirmation";

const OrderDetailTest: React.FC = () => {
  const params = useParams();

  const [modalIsOpenUpload, setIsOpenUpload] = useState(false);
  const [modalIsOpenUploadExcel, setIsOpenUploadExcel] = useState(false);
  const [order, setOrder] = useState<any>([]);
  const [orderForSarak, setOrderForSarak] = useState<any>([])
  const [orderPaymentStatusId, setorderPaymentStatusId] = useState<any>();
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<any>([]);
  const [product, setProduct] = useState([]);
  const [ShippingInformation, SetShippingInformation] = useState([]);
  const [organization, setOrganization] = useState<any>({});
  let [Detail, setDetail] = useState<any>([]);
  const [Shipping, SetShipping] = useState([]);
  const [modalSarakOpen, SetModalSarakOpen] = useState(false)
  const [modalDuplicatedOpen, SetmodalDuplicatedOpen] = useState(false)
  const [OrderWeight, SetOrderWeight] = useState(0);
  const [id, setId] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)


  const navigate=useNavigate()
  const GetShipping = async () => {
    try {
      const { data, status } = await GetShoppingsAdmin(params.id);
      SetShipping(data.result.shippings.values);
    } catch (e) {
      console.log(e);


    }
  }
  const openSarakModal = (order: any) => {
    setOrderForSarak(order)
    SetModalSarakOpen(true)
  }
  const CloseSarakModal = () => {

    SetModalSarakOpen(false)
  }
  const CloseDuplicateModal = () => {

    SetmodalDuplicatedOpen(false)
  }
  const openDuplicateModal = (order: any) => {
    setOrderForSarak(order)
    SetmodalDuplicatedOpen(true)
  }
  const closeModalForUpload = () => {
    setIsOpenUpload(false);
  };
  const closeModalIsOpenUploadExcel = () => {
    setIsOpenUploadExcel(false);
  };
  const openModalAddress = () => {
    setIsOpenAddress(true);
  };
  const closeModalAddress = () => {
    setIsOpenAddress(false);
  };
 

  const getOrder = async () => {
    try {
      const { data, status } = await GetOrder(Number(params.id));
      setCustomerDetail(data.result.order.customer);
      setOrder(data.result.order);
      setorderPaymentStatusId(data.result.order.paymentStatusId);
      

      if(data.result.order.customer.organizationId>0){
        const response= await GetOrganisationByIdAdmin(data.result.order.customer.organizationId);
        setOrganization(response.data.result.organization);
      }
    } catch (err) {
      console.log(err);
    }
  }

  let entityId = params.id


  const returnHavaleSum = () => {
    var sum = 0;

    if (Shipping) {
      Shipping.forEach((item: any) => (sum += item.plannedQuantity));
    }

    return sum;
  };

  const returnBarbariSum = () => {
    var sum = 0;

    if (Shipping) {
      Shipping.forEach((item: any) => (sum += item.shippedQuantity));
    }
    return sum;
  };

  const getOrderDetail = async () => {
    try {
      const { data, status } = await GetOrderDetailsAdmin(Number(params.id));
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
    getOrder();
   getOrderDetail();
    GetShipping();
    //getOrganizationName();
  }, [params.id,updateValue]);

  const customerName = () => {
    let fName = customerDetail.firstName;
    let lName = customerDetail.lastName;
    let OName;
    let fullname;
    if (customerDetail.organizationId > 0) {
      const {name} = organization
      fullname = `${name ? name : ""}`;
    } else {
      fullname = `${fName ? fName : ""} ${lName ? lName : ""}`;
    }

    return fullname;
  };
  const openModal = (id:any) => {
    setId(id)
    setIsOpen(true);
}
const closeModal = () => {
    getOrder()
    setIsOpen(false);
}

  const update = async () => {
    setLoading(true);
    try {
      const { data, status } = await UpdateShippingReport();
      if (status === 200) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);


    }
  }
  let orderDetailId;
  let measureUnitId;
  let detailAddress: any;
  var sumTakhsis = 0;

  if (Detail.length > 0) {
    let count = Detail.length;
    orderDetailId = Detail.filter((item: any) => item.addressId === null)[0]
      ? Detail.filter((item: any) => item.addressId === null)[0].id
      : Detail[count - 1].id;
    measureUnitId = Detail[0].measureUnitId;
    detailAddress = Detail;

    let newArr = Detail.filter((item: any) => item.addressId !== null);

    if (newArr.length > 0) {
      newArr.forEach((item: any) => (sumTakhsis += item.quantity));
    } else {
      sumTakhsis = 0;
    }
  }

  const number = OrderStatusEnumsProgressBar.filter(
    (item) => item.id === order.orderStatusId
  ).map((item) => item.number)[0];

  return (
    <Fragment>
      <div className=''>
        <div>
          <div className="statbox widget-content widget-content-area mb-2 border border-2" >
            <OrderCustomerInfo order={order} product={product} customerDetail={customerDetail} customerName={customerName} />
            {number !== 12 || number >= 4 ? <OrderInfo orderWeight={OrderWeight} TakhsisWeight={sumTakhsis} havalehWeight={returnHavaleSum()} barbariWeight={returnBarbariSum()} /> : ''}
            <div className="py-5 ">
           {(order.shippingStatusId===1 || order.shippingStatusId===2) && order.orderStatusId!==12 && order.orderStatusId!==9?   <button className="btn-danger   btn float-right m-1" onClick={()=>{openModal(13)}}>لغو سفارش </button>:''}
          {order.orderStatusId !== 13 && order.extId!==null ? <button className="btn btn-warning  float-right m-1 " disabled={order.duplicateId!==null} onClick={() => openDuplicateModal(order)}>
           سفارش تکراری
          </button> : ''}
          {order.orderStatusId === 12 ? <button className="btn btn-info  float-right m-1 " onClick={() => openSarakModal(order)}>
           کسری و سرک
          </button> : ''}
          { order.orderStatusId>=9 &&  order.orderStatusId!==13?   <button className="btn-success   btn float-right m-1" onClick={()=>{openModal(12)}}>تکمیل سفارش </button>:''}
          

           <button className="btn btn-primary  float-right m-1 " onClick={()=>navigate('/admin/orderList')}>
            بازگشت
          </button>
          
        </div>
          </div>
          <div className=" statbox widget-content widget-content-area text-dark mainMenu ">
            <ProgressBar number={number} id={order.orderStatusId} order={order} update={ForceUpdate} />
            {number === 12 || number < 4 ? <><OrderAdminDetail  order={order} orderDetail={Detail} update={ForceUpdate}/>
              <OrderAttachment order={order} params={params}
                closeModalForUpload={closeModalForUpload}
                modalIsOpenUpload={modalIsOpenUpload}
                setIsOpenUpload={setIsOpenUpload}
              />
            </> :
              (
                <>

                  <OrderAddress orderDetailsFunc={getOrderDetail} details={Detail} orderWeight={OrderWeight} TakhsisWeight={sumTakhsis} getOrder={getOrder} order={order} paymentStatus={orderPaymentStatusId} update={ForceUpdate}/>
                  <OrderWayBill loading={loading} idOrder={params.id}  update={ForceUpdate}/>

                 
                  <InvoicesForOrder Order={order} />
                  <OrderAttachment order={order} params={params}
                    closeModalForUpload={closeModalForUpload}
                    modalIsOpenUpload={modalIsOpenUpload}
                    setIsOpenUpload={setIsOpenUpload}

                  />

                </>)}


          </div>
        </div>
      
        <OrderDeviationAdmin modalIsOpen={modalSarakOpen} closeModal={CloseSarakModal } order={orderForSarak} />
          <DuplicationOrderModal modalIsOpen={modalDuplicatedOpen} closeModal={CloseDuplicateModal } order={orderForSarak} />
          <OrderConfirmation id={order.id} modalIsOpen={modalIsOpen} closeModal={closeModal} orderStatusId={id}  update={ForceUpdate}/>

        <ExcelFileUploader modalIsOpen={modalIsOpenUploadExcel} closeModal={closeModalIsOpenUploadExcel}
          EntityId={orderDetailId} EntityTypesId={11}
          comment={'لطفا فایل اکسل مطابق نمونه اطلاعات ارسال را بارگزاری کنید'} update={ForceUpdate} />
      </div>
    </Fragment>
  )
}
export default OrderDetailTest