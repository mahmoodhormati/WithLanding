import {PaymentStructureEnums} from "../../Enums/PaymentStructureEnums";
import {useEffect, useState} from "react";
import {GetAllProductSupply, GetAllProductWithSearch} from "../../../services/productSupplyService";
import OrderEdit from "../../../Admin/Order/Component/orderEdit";
import OrderConfirmation from "./orderConfirmation";
import Modal from "react-modal";
import InvoiceCreator from "../../../Utils/invoiceCreator";
import {Link} from "react-router-dom";
import ReserveOrder from "./ReserveOrder";
import MergeExternalOrderWithInteralOrder from "./MergeExternalOrderWithInteralOrder";
import QueryString from "qs";
const customStyles = {
    content: {
        position:'fixed',
        inset: '-50px',
        backgroundColor:'transparent',
        height:'100%',
        overflow:'none',
        maxHeight:'80vh'


    }



}

interface Props{

    orderDetail:any ,order:any ,update:any

}
const OrderAdminDetail:React.FC<Props> = ({orderDetail ,order ,update}) => {
    const [productSupplis, setproductSupplis] = useState<any>([]);
    const [idEdit, setIdEdit] = useState(0);
    const [id, setId] = useState(0);
    const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
    const[mergeModalOpen,SetmergeModalOpen]= useState(false);
    const [modalIsOpeninvoice, setIsOpeninvoice] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
  const [orderCondition, setOrderCondition] = useState<any>([]);

   
    const getSupplyCode = async () => {
        let productSupplyids: any = [...new Set(orderDetail.filter((item: any) => item.productSupplyId !== null).map((item: any) => item.productSupplyId))]

   
   

        if (productSupplyids.length > 0) {
          try {
    
    
    
            let configs = {
              headers: { "Content-Type": "application/json" },
              params: {
    
                IsAdmin: true,
                Ids: productSupplyids,
                PageNumber: 0,
                PageSize: 100000
    
    
              },
              paramsSerializer: (params: any) => {
                return QueryString.stringify(params);
              },
            };
    
            const { data, status } = await GetAllProductWithSearch(configs)
            
                setproductSupplis(data.result.productSupplies.values)
        getOrderDetailCondition(data.result.productSupplies.values)

           
        }
        catch(e){
            console.log(e)
        }
    }

else{
    setproductSupplis([])
    getOrderDetailCondition([])
}
    }

    const getOrderDetailCondition = (cottageCode: any) => {

       
        if (orderDetail.filter((item: any) => item.productSupplyConditionId !== null).length > 0) {
    
       
    
    
    
          let condition = cottageCode.filter((item: any) => item.productSupplyConditions.length > 0).map((item: any) => item.productSupplyConditions)[0]
    
          if (condition) {
            const Newrename = condition.map(({ id: conditionId, ...condition }: any) => ({
              conditionId,
              ...condition,
            }));
    
            condition=Newrename
          }
    
    
         
          
    
          let mergeById = (a1: any, a2: any) =>
    
            a1.map((itm: any) => ({
              ...a2.find((item: any) => (item.conditionId === itm.productSupplyConditionId) && item),
              ...itm
            }));
    
    
    
    
    
          let arr: any = mergeById(orderDetail, condition)
    
    
    
    
    
    
          setOrderCondition(arr)
    
         
    
    
        }
        else{
          setOrderCondition(orderDetail)
    
        
        }
      }



      console.log(orderCondition);
      
    useEffect(()=>{
        getSupplyCode()
    },[orderDetail])
    const openModalEdit = (id:any) => {
        setIdEdit(id)
        setIsOpenEdit(true);
    }
    const OpenMergModal = (id:any) => {
      
        SetmergeModalOpen(true);
    }
    const CloseMergModal = (id:any) => {
      
        SetmergeModalOpen(false);
       
    }
    const closeModalEdit = () => {
        setIsOpenEdit(false);
       
    }
    const openModalinvoice = (id:any) => {
        setIdEdit(id)
        setIsOpeninvoice(true);
    }
    const closeModalinvoice = () => {
        setIsOpeninvoice(false);
      
    }
    const openModal = (id:any) => {
        setId(id)
        setIsOpen(true);
    }
    const closeModal = () => {
     
        setIsOpen(false);
    }
    var formatter = new Intl.NumberFormat('fa-IR', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    return(
        <div>
            <div  className="form-group mb-4 textOnInput col-lg-12 rounded border  border-dark mt-4   ">
                <label>ثبت و صدور پیش فاکتور بر اساس درخواست </label>
                <div className="table-responsive p-2 mb-5">
                    <table  className="table responsive table-bordered reponsive table-hover table-striped  mt-2  mb-4">
                        <thead className='text-center'>
                        <tr className="">
                            <th>  عرضه</th>
                            <th>شماره کوتاژ</th>
                            <th> نام کالا</th>
                            <th>وزن</th>
                            <th> فی</th>
                            <th> نوع پرداخت</th>
                            <th> مبلغ کل</th></tr>
                        </thead>
                        <tbody>
                        {orderCondition.map((item:any)=>
                            <tr key={item.id} className="" >
                                <td aria-label=" عرضه" className="">{productSupplis?productSupplis.filter((i:any)=>i.id===item.productSupplyId).map((a:any)=>(`#${a.id} ${a.name} `))[0]:''}</td>
                                <td aria-label="شماره کوتاژ" className="">{productSupplis?productSupplis.filter((i:any)=>i.id===item.productSupplyId).map((a:any)=>a.cottageCode)[0]:''}</td>
                                <td aria-label=" نام کالا"  className="">{item.product.name}</td>
                                <td aria-label="وزن" className="">{formatter.format(item.quantity)}</td>
                                <td aria-label=" فی" className="">{formatter.format(item.basePrice)}</td>
                                <td aria-label="نوع پرداخت" className="">{item.productSupplyId?PaymentStructureEnums.filter((i:any)=> i.id === item.paymentMethodId).map((i:any)=> i.name)[0]:PaymentStructureEnums.filter((i:any)=> i.id === order.paymentMethodId).map((i:any)=> i.name)[0]}</td>
                                <td aria-label=" مبلغ کل" className="">{formatter.format(item.priceIncludingTax)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="  buttons  text-end  p-2 mt-5">
                        
                    <button className="btn-danger   btn m-1" onClick={()=>{openModal(13)}}>رد درخواست </button>
                    {order.extId!==null?<button className="btn btn-info m-1" onClick={OpenMergModal}>ادغام سفارش</button>   :''}
                    <button className={ order.orderStatusId === 5?"btn-primary   btn m-1 ":"btn-success   btn m-1 "} onClick={()=>openModalEdit(order.id)}>صدور پیش فاکتور </button>
                    <Link  to={`/admin/invoiceAdmin/${order.id}`} className= "btn-primary   btn m-1" hidden={order.orderStatusId ===  1?true:false } >دریافت پیش فاکتور</Link>
                    <button className="btn btn-warning"  disabled={order.reserved===true?true:false} hidden={order.orderStatusId===4?true:false} onClick={()=>openModalinvoice(order.id)}>رزرو سفارش</button>
                    <button className="btn-success  m-1 btn "hidden={order.orderStatusId===5?false:true} onClick={()=>{openModal(8)}}>تایید درخواست </button>
                </div>
            </div>

            <OrderConfirmation id={order.id} modalIsOpen={modalIsOpen} closeModal={closeModal} orderStatusId={id} update={update}/>
            <OrderEdit id={order.id} closeModal={closeModalEdit} modalIsOpen={modalIsOpenEdit} update={update} />
            <ReserveOrder id={order.id} closeModal={closeModalinvoice} modalIsOpen={modalIsOpeninvoice}  expireDate={null}/>
            <MergeExternalOrderWithInteralOrder baseId={order.id} modalIsOpen={mergeModalOpen} closeModal={CloseMergModal}/>


        </div> )
}
export default OrderAdminDetail