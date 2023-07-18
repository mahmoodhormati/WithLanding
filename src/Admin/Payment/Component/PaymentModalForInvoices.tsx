
import Modal from 'react-modal';
import { useState } from 'react';
import { GetPayments } from '../../../services/paymentsService';
import QueryString from 'qs';
import { MeasureUnitSample } from './../../../Common/Enums/MeasureUnitSample';
import { useEffect } from 'react';
import { PriceUnitEnums } from './../../../Common/Enums/PriceUnit';
import PaymentList from './PaymentsList';
import PaymnetListForInvoice from './PaymnetListForInvoice';



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
    modalOpen: any, closeModal: any, InvoiceIds: any
}
const PaymentModalForInvoices: React.FC<Props> = ({ modalOpen, closeModal, InvoiceIds }) => {

   

 
    


    return (
        <Modal

            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}
            

        >
            <div className="d-block clearfix mb-2" onClick={closeModal} ><svg
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
                <div style={{width:'80vw',height:'30%'}}>
            <h6 className='text-center'> {`پرداختی های مربوط به صورتحساب شماره ${InvoiceIds}`}</h6>
                <div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }} >

                    <div className="  " >
                        <div className="col-lg-4 col-md-6 col-sm-11 ">
                                                        
                        </div>
                        <PaymnetListForInvoice InvoiceId={InvoiceIds} closeModal={closeModal}/>
                      
                    </div>
                </div>
            </div>
            </div>


        </Modal>

    )
}

export default PaymentModalForInvoices