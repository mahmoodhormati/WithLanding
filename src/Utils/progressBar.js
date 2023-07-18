
import './style.css'

import {OrderStatusEnumsProgressBar} from "../Common/Enums/OrderStatusEnumsProgressBar";
import { ChangeOrderStatus } from '../services/orderService';
import { decryptStirng } from './DecryptionUtill';
import { toast } from 'react-toastify';



const ProgressBar = ({id ,number,order,update}) => {
  const role=decryptStirng(localStorage.getItem('rd'))


const handelClick=async(stepNumber,currentId)=>{

if(stepNumber===2 && role.some((item) => item > 2 && currentId>id) ){
const body=
  {
    "orderId": order.id,
    "orderStatusId": 4,
    "paymentStatusId": order.paymentStatusId,
    "isAdmin": true
  }

  try {
    
    const{data,status}=await ChangeOrderStatus(body)
    if(status===200){
      toast.success('تغییرات با موفقیت ثبت شد', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      
      update()

    }
  } catch (error) {
    console.log(error);
  }
}

else if(stepNumber===3 && role.some((item) => item > 2 ) && currentId>id){
  const body=
  {
    "orderId": order.id,
    "orderStatusId": 5,
    "paymentStatusId": order.paymentStatusId,
    "isAdmin": true
  }

  try {
    const{data,status}=await ChangeOrderStatus(body)
    if(status===200){
      toast.success('تغییرات با موفقیت ثبت شد', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      
     update()

    }
  } catch (error) {
    console.log(error);
    
  }

}

else{
return(null)
}

}

    return(
      <div  className="form-group mb-5 textOnInput col-lg-12 rounded border  border-dark  m-auto p-2  text-center">
          <label> وضعیت سفارش</label>
      <div className="container-fluid">
        <br/><br/>
          {id?
          id === 13 ? <h4 className="mb-4"><b className="bold text-danger" >سفارش لغو شد</b> </h4>:
            <ul className= { "list-unstyledr multi-stepss"}>
                 {
                     OrderStatusEnumsProgressBar.sort((a, b) => (a.number > b.number ? 1 : -1)).map(item =>
                   item.id !== 13 ?  <li key={item.id} id={`step-${item.id}`} 
                            className={item.id === id ? 'is-active' : ''}>{role.some((item) => item > 2)?<button  className={item.id === id?'border-0 bg-transparent non-hover ':'border-0 bg-transparent non-hover text-muted'} onClick={(e)=>handelClick(item.number,item.id)}>{item.name}</button>:<div >{item.name}</div>}
                            {item.id !== 12 ? <div className={"progress-bars progress-bars--success"}>
                                <div className={item.number >= number ? "progress-bars__bars" : ''}></div>
                            </div> : ""}
                        </li>: ''
                    )
                }


        </ul>:''}

      </div>
      </div>
  )
}
export default ProgressBar