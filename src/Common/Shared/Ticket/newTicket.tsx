import {useState , useRef} from "react";
import {useSelector} from "react-redux";
import {setSupportRequessts, SetSupportRequestMessage} from "../../../services/TicketService";
import {NavLink, useNavigate} from "react-router-dom";
import {ClipLoader} from "react-spinners";
import {Field, Form, Formik} from "formik";
import {validateRequired, validatNumber} from "../../../Utils/validitionParams";
import { RootState } from "../../../store";

const NewTicket:React.FC = () => {
    const user = useSelector((state:RootState) => state.user);
    const [loading, setLoading] = useState(false);


    const Navigate=useNavigate()

    const [title , setTitle]=useState("")
    const [message ,setMessage]=useState("")
    let supportRequestId=0

    const sendTicket = {
        "supportRequestDto":{
            title,
    creatorId:user.id,
    onlineChat: false,
            createDate :new Date(),
           

        }

}


    const sendMessage =async () => {
        const messageInfo={
            "supportRequestMessageDto": {
                supportRequestId,
                creatorId:user.id?user.id:localStorage.getItem('connect'),
                message,
                createDate:new Date()
            }

        }
        try {
            const {data , status}=await SetSupportRequestMessage(messageInfo)

        }catch (err){
            console.log(err)
        }
    }
    const sendTicketHandler = async () => {
        setLoading(true)

        const {data , status} = await setSupportRequessts(sendTicket)
        if (status === 200) { supportRequestId=(data.result.supportRequestId); }
        setLoading(false)

        await sendMessage()
    }
    const submit = () => {

        sendTicketHandler()
        Navigate("/admin/ticket")
    }
    return(
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تعریف تیکت جدید</h5>
                    <p>در این بخش می توانید تیکت جدید تعریف  کنید.</p>
                    
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' box  col-md-4 col-xs-12'>

                    <Formik
                        initialValues={{
                            title,
                            creatorId:user.id,
                            onlineChat: false,
                            createDate :new Date(),
                            supportRequestId,
                            message,
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit()
                        }}>
                        {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (



                            <Form  className="col" >
                        
                        <div className="form-group mb-4 textOnInput  align-content-between">

                            <label >عنوان</label>
                            <Field  validate={validateRequired} name="title"  type="text" className="form-control opacityForInput" placeholder="عنوان " value={title}
                                   onChange={(e:any) => {
                                       setTitle(e.target.value)
                                   }} />
                            {errors.title && touched.title && <div className="text-danger">{errors.title}</div>}

                        </div>
                        <div className="form-group mb-4 textOnInput">
                            <label >پیام</label>
                            <Field  validate={validateRequired} name="message"   as="textarea" rows={10} className="form-control opacityForInput" placeholder="پیام " value={message}
                                        onChange={(e:any) => {
                                            setMessage(e.target.value)
                                        }} />
                            {errors.message && touched.message && <div className="text-danger">{errors.message}</div>}

                        </div>
                        <div className='row'>
                            <div className='col-6 '>
                                <button disabled={loading} type="submit" className="btn btn-success float-left"  >تایید  <ClipLoader

                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                /></button>                            </div>
                            <div className='col-6 '>
                                <NavLink to='/admin/ticket' className="btn btn-danger float-right">بازگشت</NavLink>
                            </div>
                        </div>




                            </Form>
                        )}
                    </Formik>
                </div >
            </div >
        </div>

    )
}
export default NewTicket