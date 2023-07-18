import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {GetSupportRequestMessages, SetSupportRequestMessage} from "../../services/TicketService";
import {Button, Card} from "react-bootstrap";

const ChatBox = ({id}) => {
    let userName = localStorage.getItem("connect")
    const user = useSelector(state => state.user);
    const [newMessage ,setNewMessage]=useState("")
    const [getmessage , setGetMessage] = useState([])

    const showMessage = async () => {
        if(id!==null){
        try {
            const {data, status} = await GetSupportRequestMessages(id)
            setGetMessage(data.result.supportRequestMessages.values)

        } catch (err) {
            console.log(err)
        }}
    }
    useEffect(() => {
        showMessage()
    }, [id])
    const messageInfo={
        "supportRequestMessageDto": {
            supportRequestId:id,
            creatorId:user.id?user.id:localStorage.getItem('connect'),
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
    const interHandler = (e) => {
        if (e.key=== 'Enter'){
            sendMessages()
        }
    }
if (getmessage){


    return (
        <div className='  chat-box' >


        <div className="chat-box-inner">
            <div className="chat-conversation-box"  >
                <div id="chat-conversation-box-scroll" className="chat-conversation-box-scroll">


                    <div className="chat" data-chat={id}>
                        {getmessage.sort((a, b) => new Date(a.createDate) -new Date( b.createDate)).map( (item , index) =>
                            <div key={item.id}>
                        <div style={{display : index === 0 ?"block":"none"}} className="conversation-start">
                            <span>{ new Date(item.createDate).toLocaleDateString('fa-IR')}</span>
                        </div>
                        {item.message ?<>
                        <div title={new Date(item.createDate).toLocaleTimeString('fa-IR')} className={item.creatorId === Number(userName) ?"bubble me": " bubble you"}>
                            {item.message}
                            
                        </div>
                        
                        </> :  null }
                       
                            </div>
                            )}
                    </div>



                </div>
                </div>

                <div className="chat-footer">
                    <div className="chat-input">
                        <form className="chat-form" action="javascript:void(0);">

                        <Button className=" btn-chat " onClick={sendMessages}> ارسال پیام</Button>


                            <input
                    class="mail-write-box form-control"
                    type="text"
                    placeholder="پیام..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={interHandler}
                />

                {/*<input type="file" disabled/>*/}
                            </form>
            </div>
            </div>


        </div>
    </div>

            )}else{ return (
    <div className='  chat-box' >
        <div className="chat-not-selected">
            <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"
                     className="feather feather-message-square">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                روی کاربر برای نمایش تیکت کلیک کنید
            </p>
        </div>
    </div>
)}
}
export default ChatBox