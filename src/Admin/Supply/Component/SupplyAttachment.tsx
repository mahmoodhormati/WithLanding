import { useEffect, useState, useRef } from "react";
import ImageFileUploader from "../../../Utils/ImageFileUploader";
import QueryString from "qs";
import { GetAttachments } from "../../../services/attachmentService";
import { IoIosArrowUp } from "react-icons/io";
import { GridLoader } from "react-spinners";
import ImagePreviewer from "../../../Utils/ImagePreviewer";


const attachmet = (window as any).globalThis.stie_att

interface Props {
    order: any, params: any, modalIsOpenUpload: any, closeModalForUpload: any, setIsOpenUpload: any
}

const SupplyAttachment: React.FC<Props> = ({ order, params, modalIsOpenUpload, closeModalForUpload, setIsOpenUpload }) => {
    const [attachments, Setattachments] = useState([]);
    const [show, setShow] = useState(false);
    let [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState({});

    let newAttachment = attachments.filter((item: any) => item.deleted === false)


    let entityId = params.id;
   
    const handelGetAttachment = async () => {
        setLoading(true)
        let config = {
            headers: { "Content-Type": "application/json" },
            params: {
                entityTypeId: 6,
                entityId: entityId,
                isAdmin: true,
            },
            paramsSerializer: (params: any) => {
                return QueryString.stringify(params);
            },
        };
        try {
            const { data, status } = await GetAttachments(config);
            if (status === 200) {
                Setattachments(data.result.attachments);
                if (data.result.attachments.length > 0) {

                }

                setLoading(false)

            }
        } catch (error) {
            console.log(error);
            setLoading(false)

        }
    };


    const handelupload=()=>{
        setIsOpenUpload(true)
    }


    const showAtt = () => {
        setShow(!show);
        handelGetAttachment();

    };
    const CollapsAtt = () => {
        setShow(!show);
        handelGetAttachment();

    };
    const closeModal = () => {
        setIsOpen(false);
    };
    const handelPreview = (item: any) => {
        setImage(item);
        setIsOpen(true);
    };
   
    if (newAttachment.length > 0 && show) {


        return (
            <section className="mb-2  ">
                <div className=" mb-1    rounded ">
                    <div className="row p-3 itemA">
                        <div className=" col-6  ">
                            <span className="float-left">اسناد کوتاژ </span>


                        </div>
                        <div className="  col-6   ">
                            {show === true ? (
                                <IoIosArrowUp
                                    size="1.5rem"
                                    className="float-right up-svg"
                                    onClick={showAtt}
                                />
                            ) : (
                                <svg

                                    onClick={CollapsAtt}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="float-right feather feather-chevron-down"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            )}
                        </div>
                    </div>
                    {show === true && loading ? (
                        <div className="w-100">
                            {/* <div className=" m-auto"> */}
                            <GridLoader
                                loading={loading}
                                color="#4236d6"
                                className="m-auto GridLoader position-relative  "
                            />
                            {/* </div> */}
                        </div>
                    ) : (
                        <div className="info-Item">

                            <div className="form-group mb-4 textOnInput col-lg-12 rounded border text-center border-dark  mt-4 p-2">
                                <div className="text-center">
                                    <div className=" row text-center">
                                        {newAttachment.map((item: any) =>
                                            <div onClick={() => handelPreview(item)} className={item.attachmentTypeId === 2 ? " img col-md-2 col-sm-12 " : "  col-md-2 col-sm-12 "} >
                                                <img src={`${attachmet}${item.path}`} className=" img " alt={item.name} />
                                                <div className="detial-img ">
                                                    {item.attachmentTypeId === 2 ?
                                                        <>
                                                            <h4 className="">سند پرداخت</h4>
                                                            <p className="">شناسه پرداخت : {item.path.split('/')[2]}  </p>
                                                        </>
                                                        : item.attachmentTypeId === 1 ?
                                                            <>
                                                                <h4 className="">سند قرارداد</h4>
                                                                <p className="">  شناسه قراداد :{item.path.split('/')[2]}</p>
                                                            </>
                                                            : item.attachmentTypeId === 0 ?
                                                                <>
                                                                    <h4 className="text-dark">سند کوتاژ </h4>
                                                                </> :
                                                                ''}
                                                </div>

                                            </div>)}




                                    </div>

                                </div>
                                <div className='  '>

                                    <button type="button"  style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'white' }} className=" border-0 Attachment   float-right " title="افزودن تصویر" onClick={handelupload}>
                                        <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                            className="bi bi-plus-circle" viewBox="0 0 17 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path
                                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>

                                    </button>
                                    <ImageFileUploader modalIsOpen={modalIsOpenUpload} closeModal={closeModalForUpload} EntityId={params.id} EntityTypesId={6} comment={'لطفا فایل  مورد نظر را بارگزاری کنید.'} AttchmentTypeId={0} />
                                    <ImagePreviewer modalIsOpen={isOpen} closeModal={closeModal} item={image} isUser={false} orderStatus={null} />

                                </div>
                            </div>

                        </div>)}
                </div>
            </section>
        )
    } else {
        return (
            <section className="mb-2 mt-2">
                <div className=" mb-1    rounded ">
                    <div className="row p-3 itemA">
                        <div className=" col-6  ">
                            <span className="float-left">اسناد کوتاژ </span>
                        </div>
                        <div className="  col-6   ">
                            {show ? (
                                <IoIosArrowUp
                                    size="1.5rem"
                                    className="float-right up-svg"
                                    onClick={showAtt}
                                />
                            ) : (
                                <svg
                                    onClick={CollapsAtt}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="float-right feather feather-chevron-down"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            )}
                        </div>
                    </div>
                    {show ? (
                        <div className="info-Item">
                            <div className="form-group mb-4 textOnInput col-lg-12 rounded border text-center border-dark  mt-4 p-2 ">

                                <span className="text-center">
                                    اطلاعاتی برای نمایش موجود نیست
                                    <button  style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'none' }} className=" border-0 Attachment   float-right " title="افزودن تصویر" onClick={() => setIsOpenUpload(true)}>
                                        <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                            className="bi bi-plus-circle" viewBox="0 0 17 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path
                                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>

                                    </button>
                                </span>

                            </div>
                            <div className='  '>


                                <ImageFileUploader modalIsOpen={modalIsOpenUpload} closeModal={closeModalForUpload} EntityId={params.id} EntityTypesId={6} comment={'لطفا فایل  مورد نظر را بارگزاری کنید.'} AttchmentTypeId={0} />

                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        );
    }

}
export default SupplyAttachment