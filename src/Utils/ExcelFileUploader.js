import Modal from 'react-modal';

import { useState } from 'react';
import { attachmentUpload } from '../services/attachmentService';
import { toast } from 'react-toastify';
import { GetPreviewAddress } from '../services/orderService';
import { Fragment } from 'react';
import ExcelFilePreviewer from './ExcelFilePreviewer';
import file from "../Admin/Order/Component/addressFile.xlsx";
import { ClipLoader } from "react-spinners";
import { Link } from 'react-router-dom';

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5%',
        border: '2px ridge black'
    }

}


const ExcelFileUploader = ({ EntityTypesId, EntityId, modalIsOpen, closeModal, comment, update }) => {
    const [files, setFiles] = useState('')
    const [filename, setFileName] = useState('انتخاب فایل')
    const [model, SetModel] = useState([])
    const [loading, setLoding] = useState(false)
    const [ShowResultModal, setShowResultModal] = useState(false)

    const closeModalIsOpenUploadExcel = () => {
        setShowResultModal(false)
    }

    const handelSubmit = async (e) => {

        e.preventDefault()
        const formData = new FormData()
        formData.append('Files', files)
        formData.append('EntityTypeId', EntityTypesId)
        formData.append('EntityId', EntityId)

        try {
            const { data, status } = await attachmentUpload(formData)
            setLoding(true)

            if (status === 200) {

                let address = data.result.result[0]
                if (address.filePath && address.filePath !== '') {
                    const response = await GetPreviewAddress(address.filePath)

                    if (response.status === 200) {
                        SetModel(response.data.result.data)
                        setLoding(false)
                        setShowResultModal(true)

                    }
                }
                else {

                    toast.warning('فایل بارگزاری شده معتبر نیست', {
                        position: "top-right",
                        closeOnClick: true
                    });
                    setLoding(false)
                    setShowResultModal(false)
                }
            }
        } catch (error) {
            console.log(error);
        }




    }

    let data = [];
    if (model.length > 0) {
        data = model
    }


    const handelCancel = () => {

        setFiles('')
        setFileName('انتخاب فایل')
        closeModal()

    }


    const onchange = (e) => {
        let ext = e.target.files[0].type;
        console.log(ext);
        switch (ext) {
            case 'csv':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':

                setFiles(e.target.files[0])
                setFileName(e.target.files[0].name)

                break;

            default:

                toast.warning('فایل بارگزاری شده حتما باید اکسل باشد', {
                    position: "top-right",
                    closeOnClick: true
                });
        }



    }

    return (
        <Fragment>
            <Modal

                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >
                <div className="d-block clearfix mb-2" onClick={closeModal}><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x close"
                    data-dismiss="alert"><line x1="18" y1="6"
                        x2="6"
                        y2="18"></line><line
                            x1="6" y1="6" x2="18" y2="18"></line></svg></div>

                <div className="card-body" style={{ height: '15rem', width: '20rem' }}>



                    <p className='text-center'>{comment}</p>

                    <div className="text-primary  text-center  " style={{ cursor: "pointer" }}> <a className="text-primary  text-center  " style={{ fontSize: "15px", textAlign: "center" }} href={file} download>نمونه فایل اکسل</a></div>

                    <div className="form-group mt-5  ">
                        <div className='form-row mb-5'>
                            <div className="col-12 ">

                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' onChange={onchange} />
                                    <label className="custom-file-label" for="customFile">{filename}</label>
                                </div>

                            </div>

                        </div>


                    </div>
                    <div className='row'>

                        <div className='col-lg-6  col-sm-6'>
                            <button disabled={loading || files.length < 1 ? true : false} onClick={handelSubmit} className="btn btn-success float-left " >بارگزاری<ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                        </div>
                        <div className='col-lg-6 '>
                            <button onClick={closeModal} className="btn btn-danger float-right ">انصراف</button>
                        </div>

                    </div>

                </div>

            </Modal>

            <ExcelFilePreviewer modalIsOpen={ShowResultModal} data={data} closeModal={setShowResultModal} scondeModalClose={closeModal} orderDetailId={EntityId} update={update} />
        </Fragment>
    )
}

export default ExcelFileUploader