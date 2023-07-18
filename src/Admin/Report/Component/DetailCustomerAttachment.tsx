import {useParams} from "react-router-dom";
import {GetAttachments} from "../../../services/attachmentService";
import QueryString from "qs";
import {useEffect, useState} from "react";
import ImageFileUploader from "../../../Utils/ImageFileUploader";
import ImagePreviewer from "../../../Utils/ImagePreviewer";

const DetailCustomerAttachment:React.FC = () => {
  const attachmet=(window as any).globalThis.stie_att
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState({})

  const params = useParams()
const [data , setData] = useState<any>()
const getAtt = async () => {

  let config = {

    headers: {'Content-Type': 'application/json'},
    params: {

      entityTypeId: 1,
      entityId: params.id,
      attachmentTypeId : 2,
      InProccess:true,
      isAdmin: true
    }
    ,
    paramsSerializer: (params:any) => {

      return QueryString.stringify(params)
    }
  };
 try {
const {data , status} = await GetAttachments(config)
   setData(data.result.attachments)
 }catch (e) {
   console.log(e)
}}
  useEffect(()=>{
    getAtt()
  },[])
  const handelPreview = (item:any) => {
    setImage(item)
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false);
  }
  let formatter = new Intl.NumberFormat('fa-IR', {

    maximumFractionDigits: 0,
    minimumFractionDigits: 0,


  });
  return(<div>

    <div  className="statbox widget-content widget-content-area rounded">

      <div className="text-center">
        <div className=" row text-center">
          {data && data.length > 0?


              (data.map((item:any , index:number) =>
                  <div key={index} onClick={() => handelPreview(item)} className={item.attachmentTypeId ===2 ?" img col-md-2 col-sm-12" :"  col-md-2 col-sm-12"} >
                    <img src={`${attachmet}${item.path}`} className={item.attachmentTypeId ===2 ?"img-thumbnail border-danger":" img-thumbnail"} alt={item.name}  />
                    {item.attachmentTypeId ===2 ?  <div className="detial-img">
                      <div className="text">
                        <p >مبلغ چک : {formatter.format(item.value) }</p>
                        <p >شماره چک : { item.trackingCode}</p>
                        <p >موعد چک : { new Date(item.dueDate).toLocaleDateString("fa-IR")}</p></div>

                    </div>:null}
                  </div>
              )):
              <div className="text-center col-md-12 ">
                <h5> تصویری موجود نیست</h5>
              </div>

          }
        </div>

      </div>

    </div>
    <ImagePreviewer modalIsOpen={isOpen} closeModal={closeModal} item={image} isUser={false}  orderStatus={null}/>

  </div> )
}
export default DetailCustomerAttachment