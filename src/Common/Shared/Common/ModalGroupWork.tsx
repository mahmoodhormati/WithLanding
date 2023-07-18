import Modal from "react-modal";
import React from "react";
import {useState} from "react";
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
interface Props{
    open:any , close:any ,success:any , error:any
}
const ModalGroupWork :React.FC<Props>= ({open , close ,success , error}) => {
   
    return( <Modal
        isOpen={open}
        onRequestClose={close}
        style={customStyles}
        contentLabel="Selected Option"
        ariaHideApp={false}

    >
        < div className="text-center align-middle">
            <div >
                {success === 0 ? '' : <p  className="text-success">{success} ایتم با موفقیعت تغییر کرد</p>}
            </div>
            <div>
                {error === 0 ? '' :   <p className="text-danger">تغیرات {error} آیتم ناموفق بود</p>}
            </div>








            <button className="  btn btn-primary " onClick={function(){
                close();
                window.location.reload()

            }} >باشه
            </button>

        </div>
    </Modal>)

}
export default ModalGroupWork