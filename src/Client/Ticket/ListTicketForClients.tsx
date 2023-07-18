import {GetSupportRequesstsAdmin, GetSupportRequesstsUser} from "../../services/TicketService";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ChatBox from "./chatBox";
import QueryString from "qs";
import { RootState } from "../../store";

const ListTicketForClients:React.FC = () => {
  const roles = useSelector((state:RootState) => state.roles)
  const user=useSelector((state:RootState)=>state.user);
  const userId=localStorage.getItem('connect')
  const Navigate=useNavigate()
  const [PageNumber, setPageNumber] = useState( 0)

  const [totalCount , setTotalCount]=useState(0) ;
  const [ticket , setTicket]=useState([])
  const [id , setId]=useState<any>(null)
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    getTicket()
  },[])

  
  const getTicket= async () => {
  
      const {data , status}= await GetSupportRequesstsUser(user.id?user.id:localStorage.getItem('connect'))
      setTicket(data.result.supportRequests.values)
      setTotalCount(data.result.supportRequests.totalCount)

    
  }

 

  
if (ticket){
  return(
    <div className="chat-system">
      <div className="hamburger" onClick={()=>setOpen(!open)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"
             className="feather feather-menu mail-menu d-lg-none">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
      <div className={open ? "user-list-box user-list-box-show  " :"user-list-box"}>
        <div className="people">
          {ticket && ticket.map((item:any) =>
              <div key={item.id} onClick={()=> {
                setId(item.id)
                setOpen(false)
              }} className="person" data-chat={item.id}>
                <div className="user-info">
                  <div className="f-head">
                    {/*<img src="assets/img/90x90.jpg" alt="avatar"/>*/}
                  </div>
                  <div className="f-body">
                    <div className="meta-info">
                      <span className="user-name" data-name={item.creatorName}>{item.creatorName}</span>
                      <span className="user-meta-time">{new Date(item.createDate).toLocaleString("fa-IR")}</span>
                    </div>
                    <span className="preview">{item.title}</span>
                    <span className="preview text-info text-left " title={item.latestMessage}>{item.latestMessage.length>20?item.latestMessage.subString(0,20):item.latestMessage}</span>

                  </div>
                </div>
              </div> )}
        </div>
      </div>
      <ChatBox id={id}/>
    </div>
)
}else {
  return(
      <div className="chat-system">

        <h4 className="text-center m-auto p-5 border border-dark bg-light">تیکت یافت نشد</h4>
      </div>
  )
}

}
export default  ListTicketForClients
