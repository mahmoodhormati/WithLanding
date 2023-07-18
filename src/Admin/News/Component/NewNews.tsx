import {useState} from "react";
import {useSelector} from "react-redux";
import {SetNews} from "../../../services/newsService";
import {toast} from "react-toastify";
import Select from "react-select";
import {NavLink,useNavigate} from "react-router-dom";
import {ClipLoader} from "react-spinners";
import {validateRequired} from "../../../Utils/validitionParams";
import {Field, Form, Formik} from "formik";
import { RootState } from "../../../store";

const NewNews:React.FC = () => {
    const user=useSelector((state:RootState)=>state.user);
    const companies = useSelector((state: RootState) => state.companies)
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [active , setActive]=useState(true)
    let [companyId, SetcompanyId] = useState<any>(null)
    let [companyName, SetCompanyName] = useState<any>()

        const navigator=useNavigate();
    const creatorId= user.id
const setNews = {
    news:{
        title:title.trim(),
        message:message.trim(),
        creatorId,
        active,companyId,companyName
    }
}
const addNews = async ()=>{
        setLoading(true)
   try {
       const {data , status}= await SetNews(setNews)
    if (status === 200) {
        toast.success("اطلاعات با موفقیت ثبت شد", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
        });
        navigator('/admin/user-news')

        setLoading(false)

    }

} catch (error) {
        console.log(error)
       setLoading(false)

   }
    setLoading(false)
}
const submit=()=>{
        addNews()
}

const CompaniesIDs = () => {
   return( companies.map((data: any) => ({ label: data.name, value: data.id })))
    
}
return(
    <div className='user-progress' >
        <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                <h5 >تعریف اعلان جدید</h5>
                <p>در این بخش می توانید اعلان جدید تعریف  کنید.</p>
            </div>
        </div>
        <div className='row d-flex justify-content-center '>
            <div className=' box  col-lg-4'>


                <Formik
                    initialValues={{
                        title,
                        message,
                        creatorId,
                        active
                    }}
                    enableReinitialize={true}
                    onSubmit={values => {
                        // same shape as initial values
                    
                    }}>
                    {({ errors, touched, validateField, validateForm,setFieldValue ,handleChange,values}) => (



                        <Form  className="col" >

                        <div className="n-chk d-flex  mb-4">

                        <div>
                            <label className="mr-2"> فعال  </label>

                            <input type="checkbox" defaultChecked={active}  onChange={(e:any)=>setActive(e.checked)} />

                        </div>
                    </div>
                    {companies.length > 1 ?
                                    <div className=" mb-4  form-group textOnInput">

                                        <label> شرکت</label>
                                        <Select
                                        value={CompaniesIDs().filter((i:any)=>i.value===companyId).map((i:any)=>i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder=' لطفا نام شرکت را انتخاب کنید'
                                            options={CompaniesIDs()}


                                            isClearable={true}
                                            onChange={(e: any) => {


                                                SetcompanyId(e.value)
                                                SetCompanyName(e.label)

                                            }

                                            }

                                        />


                                    </div> : ''}
                    <div className="form-group mb-4 textOnInput  align-content-between">

                        <label >عنوان</label>
                        <Field  validate={validateRequired} name="title" type="text" className="form-control opacityForInput" placeholder="عنوان اعلان" value={title} onChange={(e:any) => setTitle(e.target.value)} />
                        {errors.title && touched.title && <div className="text-danger">{errors.title}</div>}

                    </div>
                    <div className="form-group mb-4 textOnInput">
                        <label >متن</label>
                        <Field  validate={validateRequired} name="message"   as="textarea"  className="form-control opacityForInput" placeholder="متن اعلان" value={message} onChange={(e:any) => setMessage(e.target.value)}  rows='10'/>
                        {errors.message && touched.message && <div className="text-danger">{errors.message}</div>}

                    </div>
                    <div className='row'>
                        <div className='col-6 '>
                            <button disabled={loading} type="button" onClick={submit} className="btn btn-success float-left"  >تایید  <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                        </div>
                        <div className='col-6 '>
                            <NavLink to='/admin/user-news' className="btn btn-danger float-right">بازگشت</NavLink>
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
export default NewNews