import {GetSupportRequesstsAdmin, GetSupportRequesstsUser} from "../../../services/TicketService";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ChatBox from "./chatBox";
import QueryString from "qs";
import { RootState } from "../../../store";

const ListTicketForAdmin:React.FC = () => {
  const roles = useSelector((state:RootState) => state.roles)
  const user=useSelector((state:RootState)=>state.user);
  const Navigate=useNavigate()
  const [PageNumber, setPageNumber] = useState( 0)

  const [totalCount , setTotalCount]=useState(0) ;
  const [ticket , setTicket]=useState([])
  const [id , setId]=useState<any>(null)
  const [open, setOpen] = useState(false);



  useEffect(()=>{

    getDataBySearch()
  },[])

  const getDataBySearch = async () => {

    let config = {

      headers: {'Content-Type': 'application/json'},

      params: {
        PageNumber:0,
        PageSize:100000000,
        isAdmin:true
      },
      paramsSerializer: (params:any) => {

        return QueryString.stringify(params)
      }


    };

    try {
   
        const {data , status}= await GetSupportRequesstsAdmin(config)
        setTicket(data.result.supportRequests.values)
     
    } catch (error) {
      console.log(error);
    }
  }
//   useEffect(()=>{
//     function reveal() {
//       let ticket = document.querySelectorAll(".people");
//        let elemHeight = ticket[0].offsetHeight;
//       for (let i = 0; i < ticket.length; i++) {
//         let windowHeight = window.innerHeight;
//         let elementbottom = ticket[i].getBoundingClientRect().bottom;
//         let elementTop = ticket[i].getBoundingClientRect().top;
//         let elementVisible = 150;
//
//         if (elementbottom > elemHeight) {
//           ticket[i].classList.add("active");
// // setPageNumber(PageNumber + 1)
// //           getDataBySearch()
//         }
//         else  {
//             ticket[i].classList.remove("active");
//         }
//       }
//     }
//
//     document.getElementsByClassName("people")[0].addEventListener("scroll", reveal);
//   },[window])

 

  

  const handelClick=(id:any)=>{
    setId(id)
    setOpen(false)
  }

  console.log(id);
  

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
              <div key={item.id} onClick={
           ()=>handelClick(item.id)
              } className="person" data-chat={item.id}>
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
                    <span className="preview text-info text-left ">{item.latestMessage}</span>
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
export default  ListTicketForAdmin
