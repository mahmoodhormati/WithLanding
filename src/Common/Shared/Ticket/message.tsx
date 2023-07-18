import {useEffect, useState} from "react";
import {GetSupportRequestMessages, SetSupportRequestMessage} from "../../../services/TicketService";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {Card ,Button} from "react-bootstrap";
import { RootState } from "../../../store";

const Message:React.FC = () => {
    let userName = localStorage.getItem("connect")

    const user = useSelector((state:RootState) => state.user);
const [newMessage ,setNewMessage]=useState<any>("")
    const params = useParams()
    const [getmessage , setGetMessage] = useState<any>([])
   
    const showMessage = async () => {
        try {
            const {data, status} = await GetSupportRequestMessages(params.id)
            setGetMessage(data.result.supportRequestMessages.values)

        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        showMessage()
    }, [])
    const messageInfo={
        "supportRequestMessageDto": {
            supportRequestId:params.id,
            creatorId:user.id ,
            message:newMessage,
            createDate: new Date()
        }

    }
    const sendMessages =async () => {
      try {
          const {data , status}=await SetSupportRequestMessage(messageInfo)
          setNewMessage([]);
          showMessage()

      }catch (err){
          console.log(err)
      }
    }
    const interHandler = (e:any) => {
        if (e.key=== 'Enter'){
sendMessages()
        }
    }
    
    return (<div className='  user-progress' >
        <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                <h5 >عنوان تیکت:{params.title}
                </h5>
            </div>
        </div>

        <div className="p-3 user-list-box">
            <div className="people  ps--active-y clearfix" id="chat-content"  >

                {getmessage.map((item:any) =>
                    <div className={item.creatorId === Number(userName) ? " col-lg-8 col-md-8 col-sm-8 col-xs-8 p-3 m-2 float-left d-grid" : "col-lg-8 col-md-8 col-sm-8 col-xs-8 p-3 m-2 float-right d-grid"} key={item.id}>


                            <Card border={ item.creatorId === Number(userName) ?"primary":"success"} text="dark" color="dark" className="d-block"  >

                                <Card.Header className="p-2 " ><Card.Text>{item.creatorName}</Card.Text>
                                    <time style={{float:'left' , color: 'black'}}>{  new Date(item.createDate).toLocaleDateString('fa-IR')}</time></Card.Header>
                                <hr style={{color: item.creatorId === Number(userName) ?"primary": "forestgreen", borderTop: item.creatorId === Number(userName) ? '2px solid blue':'2px solid forestgreen'}}/>
                                <Card.Body>
                                    <Card.Text>
                                        {item.message}
                                    </Card.Text>

                                </Card.Body>
                            </Card>

                        </div>

                )}
                <div className="ps__rail-x" style={{left: '0px', bottom: '-600px'}}>
                    <div className="ps__thumb-x"  style={{left: '0px', width: '0px'}}></div>
                </div>
                <div className="ps__rail-y" style={{top: "600px", height: "99px" ,right: "318px"}}>
                    <div className="ps__thumb-y"  style={{top: '56px', height: '9px'}}></div>
                </div>
            </div>

            <div className="publisher bt-1 border-light">

                <input
                    className="publisher-input w-50"
                    type="text"
                    placeholder="پیام..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={interHandler}
                />
<input type="file" disabled/>
                <Button className=" " onClick={sendMessages}> ارسال پیام</Button>
            </div>
        </div>
    </div>)
}
export default Message