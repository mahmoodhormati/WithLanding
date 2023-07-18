import QueryString from 'qs';
import { useEffect, useState } from 'react';
import { FaHandHoldingMedical, FaShoppingBasket } from 'react-icons/fa';
import { SlSupport } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { GetDataWithSearchOrder } from '../../services/orderService';
import { GetAllProductSupplyBord } from '../../services/productSupplyService';
import { GetSupportRequesstsUser } from '../../services/TicketService';
import { RootState } from '../../store';

interface Props{

  setLoading:any
}

const BlockReport:React.FC <Props>= ({setLoading}) => {
    const [order, setOrder] = useState([])
    const [ticket , setTicket]=useState([])
    const [productSupply, setProductSupply] = useState([])
    const userId=localStorage.getItem('connect')

    const getProductSupply = async () => {
        try {
            const { data, status } = await GetAllProductSupplyBord();

            setProductSupply(data.result.productSupplies.values)

        } catch (error) {
            console.log(error);
        }

        setLoading(false)
    }
    const getTicket = async () => {

        let config = {
    
          headers: {'Content-Type': 'application/json'},
    
          params: {
            PageSize:100000000,
          },
          paramsSerializer: (params:any) => {
    
            return QueryString.stringify(params)
          }
    
    
        };
    
        try {
          
            const {data , status}= await GetSupportRequesstsUser(userId , config)
            setTicket(data.result.supportRequests.values)
    
          
        } catch (error) {
          console.log(error);
        }
      }
    const GetOrders = async () => {
        let userName = localStorage.getItem("mobile")
    
        let config = {
    
          headers: { 'Content-Type': 'application/json' },
          params: {
            UserName: userName,
           
          }
          ,
          paramsSerializer: (params:any) => {
    
            return QueryString.stringify(params)
          }
    
    
        };
    
        try {
         
            const { data, status } = await GetDataWithSearchOrder(config);
         
    
          setOrder(data.result.orderList.values)
    
          }
          
    
        catch (err) {
          console.log(err)
        }
    
      }
      useEffect(()=>{
        GetOrders()
        getTicket()
        getProductSupply()
      },[])

return(<div className="  dashboard-widget" >
    <div className='row p-4 justify-content-center'>
    <div className='col-lg-3 dashboard-item   m-2 text-center  rounded '>
        <FaShoppingBasket size="4rem"/>
<p>تعداد سفارشات </p>
        <p>{order ? order.length :"0"}</p>
    </div>
    <div className='col-lg-3 dashboard-item   m-2 text-center  rounded '>
        <SlSupport size="4rem"/>
<p>تعداد تیکت ها</p>
        <p>{ticket ? ticket.length :"0"}</p>
    </div>
    <div className='col-lg-3 dashboard-item  m-2 text-center  rounded '>
        <FaHandHoldingMedical size="4rem"/>
<p>تعداد عرضه </p>
        <p>{productSupply ? productSupply.length :"0"}</p>
    </div>
    </div>
</div>)
}
export default BlockReport