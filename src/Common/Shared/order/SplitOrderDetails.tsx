import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { formatter } from '../../../Utils/Formatter';
import Select from 'react-select';
import { GetAllProductWithSearch } from '../../../services/productSupplyService';
import { PaymentStructureEnums } from '../../Enums/PaymentStructureEnums';
import { ClipLoader } from 'react-spinners';
import { SplitOrderDetail } from '../../../services/orderService';
import { toast } from 'react-toastify';

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}
interface Props {
    id: any, modalIsOpen: any, closeModal: any, companyId: any, maxQuantity: any,update:any
}
const SplitOrderDetails: React.FC<Props> = ({ id, modalIsOpen, closeModal, companyId, maxQuantity ,update}) => {

    const [quantity, SetQuantity] = useState(0)
    const [loading, setLoading] = useState(false);
    
  
    const [check, SetCheck] = useState(false)

    

    const Onsubmit = async () => {

        setLoading(true)

        let body={

            "id": id,
            "splitQuantity": quantity,
          
        }

        try {

            const{data,status}=await SplitOrderDetail(body)

            if(status===200){

                toast.success(`تفکیک جزییات سفارش با موفقیت انجام شد`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

                setLoading(false)
                closeModal()
                update()
                

            }

            
        } catch (error) {
            setLoading(false)
            
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
            <div>


                <div className="card-body p-0 t" style={{ minHeight: '10rem', minWidth: '25rem', overflow: 'auto' }}>

                    <div className="form text-center ">

                        <div
                            className="form-group mb-4  textOnInput col-lg-12 rounded border  border-dark    "
                            style={{ marginTop: "2rem" }}
                        >
                            <label>وزن تفکیک</label>

                            <div className='m-3 '>
                                <input className='form-control-small mr-4' style={{ direction: 'ltr'  ,maxWidth:'4rem'}} value={formatter.format(quantity)}  max={maxQuantity} onChange={e => SetQuantity(Number(e.target.value.replaceAll(",", "")))}></input>
                                {maxQuantity}
                                <input type='range' style={{ direction: 'ltr' }} value={quantity} step={500} min={0} max={maxQuantity} onChange={e => SetQuantity(Number(e.target.value))} />
                                0
                            </div>
                        </div>
            {quantity>maxQuantity?<p className='text-danger text-center'>وزن درخواستی بیشتر از حداکثر وزن است</p>:''}



                        

                        


                        <div className='d-flex justify-content-around  mt-4'>
                            <button className='btn btn-success' onClick={Onsubmit} disabled={quantity>maxQuantity||quantity<=0 }>ثبت <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                            <button className='btn btn-danger' onClick={closeModal}> بازگشت</button>
                        </div>
                    </div>


                </div>
            </div>


        </Modal>
    )
}

export default SplitOrderDetails