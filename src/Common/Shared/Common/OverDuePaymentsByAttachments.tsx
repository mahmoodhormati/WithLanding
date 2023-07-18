import {useEffect, useState} from "react";
import {HasOverDuePaymentsByAttachments} from "../../../services/orderService";
import {Link, useNavigate} from "react-router-dom";
import {FiAlertOctagon} from "react-icons/fi"
import {BsArrowLeftCircle} from "react-icons/bs"
const OverDuePaymentsByAttachments:React.FC = () => {
    const navigate = useNavigate()

  const [checked , setChecked]= useState(getDataOverDuePaymentsByAttachments().checked)
    let d = new Date();
    d.setTime(d.getTime() +  (60 * 1000));
    let expires =  d.toUTCString();

    const dataOverDuePaymentsByAttachments = {
        expiresAt: expires,
        checked
    }
    function getDataOverDuePaymentsByAttachments() {
        let items = JSON.parse(String(sessionStorage.getItem('dataOverDuePaymentsByAttachments')));
        return items ? items : false


    }

    const data = async () => {
        try {
            const {data , status} = await HasOverDuePaymentsByAttachments()
            if (data.result.hasOverDueAttachments === true){
                setChecked(true)
                dataOverDuePaymentsByAttachments.checked=true
                setChecked(dataOverDuePaymentsByAttachments.checked)
                sessionStorage.setItem('dataOverDuePaymentsByAttachments', JSON.stringify(dataOverDuePaymentsByAttachments));

            }

        }catch (e) {
            console.log(e)
        }

    }

    useEffect(()=>{

        if (getDataOverDuePaymentsByAttachments().expiresAt < new Date().toUTCString()){

            sessionStorage.removeItem("dataOverDuePaymentsByAttachments")


        }
        if (!getDataOverDuePaymentsByAttachments().expiresAt){

            data()


        }

    },[])

    if (checked ){
        return(
        <Link to="/admin/orderList" state="fromDashboard" className="text-light alert" >
        <div className="w-100 bg-danger p-2 rounded" >
        <div className="row">
            <div className="col-lg-6 ">
                <div className="float-left">
                    <FiAlertOctagon size='2rem' className="m-2"/>
                <span style={{color:"white"}}>
                    موعد سررسید چند سفارش رسیده
                </span>
                </div>
            </div>
            <div className="col-lg-6 m-auto">

                <div className="float-right ">
                    <Link to="/admin/orderList" state="fromDashboard" className="text-light" >  مشاهده بیشتر</Link>
                    <BsArrowLeftCircle size="1.5rem" className="mx-2" style={{position: 'relative',animation: "changeRight 1s infinite"}}/>

                </div>
            </div>
        </div>
    </div>
        </Link>)}else {
        return null
    }

}
export default OverDuePaymentsByAttachments