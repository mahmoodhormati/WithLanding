import React,{useState,useEffect} from 'react'
import { PaymentStructureEnums } from './../../Enums/PaymentStructureEnums';
import  Modal  from 'react-modal';
import  Select  from 'react-select';
import  DatePicker,{DateObject}  from 'react-multi-date-picker';
import  persian  from 'react-date-object/calendars/persian';
import  persian_fa  from 'react-date-object/locales/persian_fa';
import  {ClipLoader}  from 'react-spinners';
import { CreateInvoice } from '../../../services/invoiceService';
import { toast } from 'react-toastify';

const customStyles = {
  content: {

    inset: '50% auto auto 50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5%',
    border: '2px ridge black',
    maxHeight:'80vh'

  }

}
interface Props {
  closeModal: any,
  isOpenInvoice: any, orderId: any,defaultPaymentId:any,update:any
}
const InvoiceSetForOrder: React.FC<Props> = ({ closeModal, isOpenInvoice, orderId,defaultPaymentId,update }) => {

  const [loading, setLoading] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<any>(0);
  const [installmentStartDate, setInstallmentStartDate] = useState<any>('');
  const [installmentPeriod, setInstallmentPeriod] = useState<any>(null);
  const [installmentOccureCount, setInstallmentOccureCount] = useState<any>(null);
  const [comment, setComment] = useState<any>(null);



  
  const handelStartDate = (value:any) => {
    if (value === null) {
        setInstallmentStartDate('')
    }
    //تغییرات روی تاریخ رو اینجا اعمال کنید
    if (value instanceof DateObject) {
        setInstallmentStartDate(new Date(value.toDate()))



    }
}

useEffect(()=>{
  setDefault()


},[isOpenInvoice])
const setDefault=()=>{

  if(defaultPaymentId().length>0){

    if(defaultPaymentId().length===1){
    
      setPaymentMethodId(defaultPaymentId()[0].payments?defaultPaymentId()[0].payments:2)
      setInstallmentOccureCount(defaultPaymentId()[0].installmentOccureCount)
      setInstallmentPeriod(defaultPaymentId()[0].installmentPeriod)
      setInstallmentStartDate(new Date(defaultPaymentId()[0].installmentStartDate))
    
    
    
    
    }
    else if(defaultPaymentId().length>1){
  let newPayments:any=[]

  newPayments=[...new Set(defaultPaymentId().map((i:any)=>i.payments!==undefined?i.payments:i.payments=2))]


  

  
  if(newPayments.length>1){

    setPaymentMethodId(null)
  }
  else{
    let newArray:any= defaultPaymentId().filter((i:any)=>i.payments===newPayments[0])

    
    
    if(newArray.length>1){
      setPaymentMethodId(newArray[0].payments)
      setInstallmentOccureCount(newArray[0].installmentOccureCount)
      setInstallmentPeriod(newArray[0].installmentPeriod)

      
      
    }
      else{
        setPaymentMethodId(2)
      }
       
  }



    }
    
    
    }
}


  const paymentMethodIDs = () => {
    return (PaymentStructureEnums.filter((item:any)=>item.id===2||item.id===4).map((data: any) => ({ label: data.name, value: data.id })))
  }

const handelSubmit=async()=>{
  setLoading(true)
  const body={
    entityTypeId:10,
    entityId: orderId,
    paymentMethodId,
    installmentStartDate:paymentMethodId!==4?null:installmentStartDate,
    installmentPeriod:installmentPeriod!==0 && paymentMethodId === 4?Number(installmentPeriod):null,
    installmentOccureCount:installmentOccureCount!==0 && paymentMethodId === 4?Number(installmentOccureCount):null,
    comment
  }
try {
  
  const {data,status}=await CreateInvoice(body)
  if(status===200){
    toast.success(`فاکتور با شناسه ${data.result.invoiceId} ثبت شد`, {
      position: "top-right",
      closeOnClick: true
  });
  update()
  }
  setLoading(false)

} catch (error) {
  console.log(error);
  setLoading(false)

}
  closeModal()
  setLoading(false)

}


  return (
    <Modal
      isOpen={isOpenInvoice}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Selected Option"
      ariaHideApp={false}>
      <div style={{ height: 'fit-content', width: '20rem' }}>

        <div className='form-row textOnInput'>
          <div className='col-lg-12 mb-4 '>
            <div className=" form-control-sm">
              <label> نحوه پرداخت </label>

              {paymentMethodId!==0?<Select
                      menuShouldScrollIntoView ={false}
              value={paymentMethodIDs().filter((i:any)=>i.value===paymentMethodId).map((i:any)=>i)}
                placeholder=' پرداخت '
                options={paymentMethodIDs()}

                onChange={(e: any) => {

                  setPaymentMethodId(e.value)

                }}
              />: 
              
              <Select placeholder=' پرداخت '
              options={paymentMethodIDs()}
                      menuShouldScrollIntoView ={false}
              onChange={(e: any) => {

                setPaymentMethodId(e.value)

              }}/>}
            </div>
          </div>
          {paymentMethodId === 4 ?
            <div className="row">
              <div className='col-lg-12 col-sm-12 mb-4 mt-4'>
                <div className=" form-control-sm">
                  <label className="date-piker-form" > تاریخ پرداخت </label>
                  <div className='form-group  '>
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                      value={installmentStartDate}
                      onChange={handelStartDate}
                    />

                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-sm-12 mb-4 mt-4'>
                <label> بازه </label>

                <input className="form-control opacityForInput  mb-4" type="text"
                  placeholder=" بازه "
                  value={installmentPeriod} onChange={(e: any) => setInstallmentPeriod(e.target.value)} />
              </div>
              <div className='col-lg-6 col-sm-12 mb-4 mt-4'>
                <label>  تعداد اقساط</label>

                <input className="form-control opacityForInput  mb-4" type="text"
                  placeholder=" تعداد اقساط "
                  value={installmentOccureCount} onChange={(e: any) => setInstallmentOccureCount(e.target.value)} />
              </div></div> : null}
          <div className="col-12  mt-4">
            <div className="form-group mb-4 textOnInput">
              <label >توضیحات</label>

              <textarea className="form-control opacityForInput " rows={4} placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) =>
                setComment(e.target.value)
              } />

            </div>
          </div>
          <div className='col-12'>
            <div className='row'>
              <div className='col-6'>
                <button className="btn btn-success float-right "
                  disabled={loading} onClick={handelSubmit}>تایید

                  <ClipLoader

                    loading={loading}
                    color="#ffff"
                    size={15}
                  /></button>
              </div>
              <div className='col-6'>
                <button className="btn btn-danger " onClick={closeModal}> بازگشت</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InvoiceSetForOrder