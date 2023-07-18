import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { FiAlertOctagon } from 'react-icons/fi';
import { GetUndecidedPayments } from '../../../services/reportService';


const GetUndesidedPayments:React.FC = () => {
const[Ids,setIds]=useState<any>([])
const[Count,setCount]=useState<any>(0)

let d = new Date();
d.setTime(d.getTime() +  (60 * 1000));
let expires =  d.toUTCString();
let undeciededPayments = {
    expiresAt: expires,
    Ids,
    Count
}
 function GetundeciededPayments(){
    let items = JSON.parse(String(sessionStorage.getItem('undeciededPayments')));
    return items ? items : []
 }

    const getUndecieded=async()=>{

        try {
            const {data,status}=await GetUndecidedPayments()

            if(status===200){
                setIds(data.result.unDecidedPayments)
                setCount(data.result.unDecidedPayments.length)
                undeciededPayments.Ids=data.result.unDecidedPayments
                undeciededPayments.Count = data.result.unDecidedPayments.length
                sessionStorage.setItem('undeciededPayments', JSON.stringify(undeciededPayments));
                
            }
        } catch (error) {
            
        }
    }

   
useEffect(()=>{
        if (GetundeciededPayments().expiresAt < new Date().toUTCString()){

            sessionStorage.removeItem("dataOverDuePaymentsByAttachments")


        }
        if (!GetundeciededPayments().expiresAt){

            
            getUndecieded()

        }

    },[])
    if(Ids.length > 0 ){
  return (
    
    <div className="w-100 bg-danger p-2 rounded" >
    <div className="row">
        <div className="col-lg-6 ">
            <div className="float-left">
                <FiAlertOctagon size='2rem' className="m-2"/>
            <span style={{color:"white"}}>
              {`تعداد ${GetundeciededPayments().Count} پرداخت در وضعیت تصمیم گیری نشده یافت شد.`}
            </span>
            </div>
        </div>
        <div className="col-lg-6 m-auto">

            <div className="float-right ">
            <Link onClick={getUndecieded} to="/admin/PaymentLists" state="fromDashboard" className="text-light" >  مشاهده پرداخت ها 
                <BsArrowLeftCircle size="1.5rem" className="mx-2" style={{position: 'relative',animation: "changeRight 1s infinite"}}/>
                </Link>
            </div>
        </div>
    </div>
</div>
   )}
   else{
    return null
   }
  
}

export default GetUndesidedPayments