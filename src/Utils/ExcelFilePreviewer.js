import React, { useState } from 'react'
import Modal from 'react-modal';
import { SplitSetAddressOrderDetails } from '../services/orderService';
import { toast } from 'react-toastify';


const customStyles = {
    content: {

        inset: '50% auto auto 46%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '3%',
        border: '2px ridge black',
        width: "85%"
    }

}


const ExcelFilePreviewer = ({ modalIsOpen, closeModal, data, scondeModalClose,orderDetailId,update }) => {
let [stateError,setStateError]=useState([]);
let isData=true;

    const handelSubmit = async (e) => {
        e.preventDefault();
        let newData=[]
        for (let i = 0; i < data.length; i++) {
            
let item={"bazargah":data[i]}
            newData.push(item)
        }

        if (window.confirm('آیا از درستی آدرس اطمینان دارید؟؟؟؟؟')) {
     
            const body={
                orderDetailId,
                model:newData
            }
          try {
            const response = await SplitSetAddressOrderDetails(body)

            if (response.status == 200 ) {

                toast.success(response.data.result.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                update()


            }
            else {
                
            }
            closeModal()
            scondeModalClose()

        }


            
           catch (err) {
        
            setStateError(err.response.data.result.errors)
           

          closeModal()
          scondeModalClose()


          }  
          

    }
    }

    return (

        <Modal

            isOpen={modalIsOpen}
            onRequestClose={closeModal}

            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >
            <div className="d-block clearfix mb-2" onClick={() => {
                closeModal()
                scondeModalClose()
            }}><svg
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
            <div className='m-auto'>

                <div  style={{ display: "block", overflowY: 'scroll', overflowX: 'hidden', height: '280px', width: "100%" }} >
                    <table className="table table-bordered table-hover table-striped  mt-2  mb-4"   >
                        <thead>
                            <tr>
                                <th>شناسه خرید</th>
                                <th>شناسه تخصیص</th>
                                <th>شناسه یکتا</th>
                                <th>کد رهگیری</th>
                                <th>وزن</th>
                                <th>تریلی</th>
                                <th>کد ملی تحویل </th>
                                <th>نام استان</th>
                                <th style={{ width: '2%' }}>آدرس کامل</th>
                                <th>کد پستی</th>
                                <th>شماره تلفن تحویل</th>
                                <th>شماره موبایل تحویل</th>
                                <th>نام تحویل گیرنده</th>
                            </tr>
                        </thead>

                        {isData?
                            <tbody  >
                                {
                                    data.map(item =>

                                        <tr key={item.idKharId}>


                                            <td>{item.idKharId}</td>
                                            <td>{item.allocationId}</td>
                                            <td>{item.receiverUniqueId}</td>
                                            <td>{item.traceCode}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.heavyWeightTruck === true ? 'بله' : 'خیر'}</td>
                                            <td>{item.receiverId}</td>
                                            <td>{item.provinceName}</td>
                                            <td >{item.fullAddress}</td>
                                            <td>{item.postalCode}</td>
                                            <td>{item.receiverTel}</td>
                                            <td>{item.receiverMobile}</td>
                                            <td>{item.receiverName}</td>

                                        </tr>




                                    )
                                }

                            </tbody>
                            :

                            <tbody>
                          
                                <tr className='text-center '> <td colSpan='12' className='text-center text-danger font-weight-bolder '> فایل نامعتبر است</td></tr>

                                </tbody>
                           
                        }
                    </table>
                </div>

                <div>{stateError[0]}</div>
                <div className='row justify-content-center mt-5'>
                    <div className='m-1' >
                        <button className="btn btn-success float-left" disabled={isData?false:true} onClick={handelSubmit} >تایید</button>
                    </div>

                    <div className='m-1'>
                        <button className="btn btn-danger float-left" onClick={() => {
                            closeModal()
                            scondeModalClose()
                        }} >انصراف</button>

                    </div>
                </div>
            </div>



        </Modal>
    )


}

export default ExcelFilePreviewer