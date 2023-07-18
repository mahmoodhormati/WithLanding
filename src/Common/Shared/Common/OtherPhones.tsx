import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { PhoneTypes } from '../../Enums/PhoneTypes';
import Select from 'react-select';
import { SetPhoneBook } from '../../../services/phoneService';
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
    border: '2px ridge black'
  }

}


interface Props {
  entityId: any, modalIsOpen: any, closeModal: any, entityTypeId: any, currentItem: any, IsClient: any
}

const OtherPhones: React.FC<Props> = ({ entityId, modalIsOpen, closeModal, entityTypeId, currentItem, IsClient }) => {


  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<any>(null)
  const [phoneTypeId, setphoneTypeId] = useState<any>(null)
  const [name, setname] = useState<any>('')
  const [phone, setphone] = useState<any>('')
  const [description, setdescription] = useState<any>('')

  const setDefault = () => {

    setdescription('')
    setname('')
    setphone('')
    setphoneTypeId(null)
    setId(null)

    if (currentItem) {
      const { id, description, name, phone, phoneTypeId } = currentItem


      setdescription(description)
      setname(name)
      setphone(phone)
      setphoneTypeId(phoneTypeId)
      setId(id)


    }
  }


  useEffect(() => {

    setDefault()

  }, [currentItem])




  const SubmitForm = async () => {

    setLoading(true)
    let body = {}
    if (IsClient) {
      body = {
        "id": id?id:0,
        "phoneTypeId": phoneTypeId,
        "entityTypeId": entityTypeId,
        "entityId": entityId,
        "phone": phone,
        "name": name,
        "description": description,

      }
    }
    else {

      body = {
        "id": id?id:0,
        "phoneTypeId": phoneTypeId,
        "entityTypeId": entityTypeId,
        "entityId": entityId,
        "phone": phone,
        "name": name,
        "description": description,
        "isAdmin": true
      }
    }
    try {

      const { data, status } = await SetPhoneBook(body)

      if (status === 200) {
        toast.success('اطلاعات با موفقیت ثبت شد', {
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

      }

    } catch (error) {
      console.log(error);

      setLoading(false)
      closeModal()
    }


    setLoading(false)
    closeModal()

  }

  const phoneTypesIds = () => {


    return PhoneTypes.map((i: any) => ({ label: i.name, value: i.id }))
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
      <div >
        <div >
          <div className="card-body p-0  overflow-hidden" style={{ height: '17rem', width: '40rem', overflow: 'auto' }}>
            <div className="mb-4 text-left">




            </div>


            <div className='row '>



              <div className="col-lg-4 col-md-4  col-sm-12 textOnInput  mt-4">

                <label >نام </label>
                <input className='form-control' value={name} onChange={e => setname(e.target.value)} />

              </div>
              <div className="col-lg-4 col-md-4  col-sm-12 textOnInput  mt-4">

                <label >شماره </label>
                <input className='form-control' value={phone} onChange={e => setphone(e.target.value)} />

              </div>
              <div className="col-lg-4 col-md-4  col-sm-12 textOnInput  mt-4">

                <label >نوع </label>
                {phoneTypeId ? <Select
                  value={phoneTypesIds().filter((i: any) => i.value === phoneTypeId).map((item: any) => item)}
                  placeholder='نوع'
                  maxMenuHeight={150}
                  options={phoneTypesIds()}


                  menuShouldScrollIntoView={false}
                  onChange={(e: any) => setphoneTypeId(e.value)}


                /> : <Select
                  placeholder='نوع'
                  maxMenuHeight={150}
                  options={phoneTypesIds()}

                  menuShouldScrollIntoView={false}
                  onChange={(e: any) => setphoneTypeId(e.value)}
                />}
              </div>
              <div className="col-lg-12 col-md-12  col-sm-12 textOnInput  mt-4">
                <label>توضیحات</label>
                <textarea className='form-control' value={description} onChange={e => setdescription(e.target.value)} />
              </div>






            </div>
          </div>




          <div className='row '>

            <div className='col-6 '>
              <button className="btn btn-success float-left "
              onClick={SubmitForm}
              >تایید
                <ClipLoader

                  loading={loading}
                  color="#ffff"
                  size={15}
                /></button>
            </div>
            <div className='col-6 '>
              <button className="btn btn-danger float-right "
                onClick={function () {
                  closeModal()
                }}>انصراف
              </button>
            </div>
          </div>
        </div >
      </div>

    </Modal>
  )
}

export default OtherPhones