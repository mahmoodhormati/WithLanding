import React, { useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom';


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
        border: '2px ridge black',
        backgroundColor:'#ffc5c5',
        color:'blue',
        maxHeight:'80vh'

    }
};
interface Props {
    modalIsOpen: any, message: string, closeModal: any,submit:any
}

const ErrorModalSample: React.FC<Props> = ({ modalIsOpen, closeModal, message,submit }) => {
    const navigate = useNavigate()

    const [loading,setLoading]=useState(false)
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >
            <>


                <div style={{width:'11rem' ,textAlign:'center'}}>
                   {message}
                </div>

                <div className='d-flex justify-content-around mt-3'>
                    <button className="btn btn-success  " disabled={loading} onClick={() =>{ 
                    setLoading(true)
                    submit()
                    closeModal()
                    }}>بله
                    </button>

                    <button className="btn btn-danger " onClick={closeModal}>خیر</button>
                </div>
            </>
        </Modal>
    )
}

export default ErrorModalSample