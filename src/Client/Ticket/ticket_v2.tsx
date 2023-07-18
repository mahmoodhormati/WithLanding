
import {useNavigate} from "react-router-dom";
import ListTicketForClients from './ListTicketForClients';

const Ticket:React.FC = () => {
  const Navigate=useNavigate()

  const newTicket = () => {
    Navigate("/client/newTicket")
  }
  return(
      <div className="chat-section layout-top-spacing">
        <div className="row">
        <button className="btn btn-primary m-3"  onClick={newTicket}>ثبت تیکت جدید</button>

          <div className="col-xl-12 col-lg-12 col-md-12">


<ListTicketForClients/>

  </div>
  </div>
  </div>
  )
}
export default Ticket