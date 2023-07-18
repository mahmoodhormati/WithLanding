import React, { useState } from 'react'
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { DeleteComponentDetail, SetComponentDetail } from '../../../../services/componentService';
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';
import { AiFillPicture } from 'react-icons/ai';


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
    maxHeight: '80vh'

  }
};
const LandingSetComponentDetails = ({ componentDetails, GetComponent, componentId }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasButton, sethasButton] = useState(true);
  const [title, setTitle] = useState();
  const [buttonName, setbuttonName] = useState();
  const [buttonLink, setbuttonLink] = useState();
  const [description, setDescription] = useState();
  const [file, SetFile] = useState([])


  console.log(file);


  const openModal = () => {
    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }




  const setDetails = async () => {

    let body = {
      "componentDetail": {
        "id": 0,
        "componentId": componentId,
        "title": title,
        "description": description,
        "hasButton": hasButton,
        "buttonName": buttonName,
        "buttonLink": buttonLink,
        "entityTypeId": null,
        "categoryId": null,
        "groupId": null,
        "specificationId": null,
        "tagId": null,
        "entityType": null,
        "component": null
      }


    }


    try {

      const { data, status } = await SetComponentDetail(body)

      if (status === 200) {
        toast.success('تغییرات ثبت شد', {
          position: "top-right",
          closeOnClick: true,
        })

        closeModal()
        GetComponent()
      }

    } catch (error) {

      console.log(error)
    }






  }

  const handelDeleteCumponentDetail = async (id) => {
    let body = {
      "id": id
    }
    try {
      const { data, status } = await DeleteComponentDetail(body)

      if (status === 200) {
        toast.success('تغییرات ثبت شد', {
          position: "top-right",
          closeOnClick: true,
        })

        GetComponent()
      }
    } catch (error) {

    }
  }

  return (
    <div className=" rounded ProductSupplyCondition ">
      {componentDetails.length < 1 ? (<span className="d-block text-center p-5 ">هیچ اجزایی یافت نشد</span>) : (
        <div className=" ProductSupplyCondition-table table  table-hover table-striped  p-2">
          <table
            className="  mt-2  mb-4">
            <thead>
              <tr style={{ fontSize: '10px' }}>

                <th style={{ fontSize: '10px' }} className="text-center">#</th>
                <th style={{ fontSize: '10px' }} className="text-center">عنوان</th>
                <th style={{ fontSize: '10px' }} className="text-center">توضیحات</th>
                <th style={{ fontSize: '10px' }} className="text-center">دسته بندی</th>

                <th style={{ fontSize: '10px' }} className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {componentDetails.length > 0 ? componentDetails.map((i, index) => (


                <tr key={i.id}>

                  <td style={{ backgroundColor: 'transparent' }}>{i.id}</td>
                  <td style={{ backgroundColor: 'transparent' }}>{i.title}</td>
                  <td style={{ backgroundColor: 'transparent' }}>{i.description}</td>
                  <td style={{ backgroundColor: 'transparent' }}>{i.categoryId}</td>
                  <td style={{ backgroundColor: 'transparent' }}>
                    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="حذف" onClick={() => handelDeleteCumponentDetail(i.id)} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
                        viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-trash-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>

                      </svg>
                    </button>
                  </td>

                </tr>

              ))

                : ''}

            </tbody>
          </table>
        </div>)}
      <div className='d-block  '>


        <Link to='#' style={{ marginTop: '-1.2rem', marginLeft: '.6rem', background: 'white', position: 'absolute', left: '1vw' }}
          className=" ProductSupplyCondition-add border-0      float-right " data-title='افزودن '
          onClick={() => openModal()}>
          <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            className="bi bi-plus-circle" viewBox="0 0 17 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </Link>

        <Modal isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Selected Option"
          ariaHideApp={false}>


          <div style={{ width: '50vw', height: '55vh' }}>

            <div className="row form-group  mb-4 mt-4">

              <div className="col-12 mb-5 d-flex justify-content-between ">
                <div className="col-lg-4 col-md-6 col-sm-11 ">


                  <label className="form-check-label mb-3">

                    <input type="checkbox" className="form-check-input" checked={hasButton} onChange={e => sethasButton(e.target.checked)} />
                    دارای کلیک
                  </label>
                </div>


                <div className="col-md-3 mb-4 text-center">

                  <div className='row'>
                    <div className=''>
                      <div className='col-12 text-center'>
                        {file.length > 0 ? file.map(i => (

                          <img
                            src={URL.createObjectURL(i[0])}
                            className="img-fluid image-hover rounded text-center"
                            style={{ width: '5vw', maxHeight: '10rem' }}
                          />



                        ))


                          : ''}

                      </div>
                    </div>
                    <div className='col-12 '>
                      {file.length === 0 ? <>


                        <label className='btn   w-20 '>آپلود تصویر <AiFillPicture /><input type="file" id="upload" accept='image/jpeg, image/png' style={{ visibility: 'hidden' }} onChange={
                          e => {
                            let ext = e.target.files[0].type;
                            switch (ext) {
                              case 'image/jpeg':
                              case 'image/jpg':
                              case 'image/png':
                              case 'image/webp':
                              case 'image/apng':
                              case 'image/svg+xml':

                                SetFile([e.target.files])

                                break;

                              default:

                                toast.warning('فایل بارگزاری شده حتما باید عکس باشد', {
                                  position: "top-right",
                                  closeOnClick: true
                                });
                            }
                          }

                        } />

                        </label>

                      </>


                        :

                        <div className='text-left'>


                          <button

                            onClick={() => SetFile([])}
                            className="border-0 bg-transparent non-hover"
                          >
                            <ImCross size="1rem" color="red" title="حذف عکس" />
                          </button>
                        </div>}
                    </div>

                  </div>
                </div>

              </div>

              <div className="col-lg-4 col-md-6 col-sm-11 mb-4 textOnInput">


                <label className="form-check-label mb-3 textOnInput" > عنوان</label>

                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />


              </div>
              <div className="col-lg-4 col-md-6 col-sm-11 mb-4 textOnInput ">


                <label className="  textOnInput">نام کلیک</label>

                <input type="text" className="form-control" disabled={hasButton === false} value={buttonName} onChange={e => setbuttonName(e.target.value)} />


              </div>
              <div className="col-lg-4 col-md-6 col-sm-11 mb-4  textOnInput">


                <label className="form-check-label mb-3 textOnInput">لینک کلیک</label>

                <input type="text" className="form-control" disabled={hasButton === false} value={buttonLink} onChange={e => setbuttonLink(e.target.value)} />


              </div>


              <div className="col-6 mb-4 textOnInput">

                <label>دسته بندی </label>
                <Select
                  menuShouldScrollIntoView={false}
                  placeholder="دسته بندی "

                  maxMenuHeight={150}
                />
              </div>
              <div className="col-6 mb-4 textOnInput">

                <label> گروه</label>
                <Select
                  placeholder="گروه "

                  maxMenuHeight={100}
                  menuShouldScrollIntoView={false}

                />
              </div>

              <div className="col-4 mb-4 textOnInput">

                <label> خصیصه</label>
                <Select
                  menuShouldScrollIntoView={false}
                  placeholder=" خصیصه"

                  maxMenuHeight={150}
                />
              </div>
              <div className="col-4 mb-4 textOnInput">

                <label>تگ </label>
                <Select
                  placeholder=" تگ"

                  maxMenuHeight={100}
                  menuShouldScrollIntoView={false}

                />
              </div>
              <div className="col-4 mb-4 textOnInput">

                <label> موجودیت</label>
                <Select
                  placeholder="موجودیت "

                  maxMenuHeight={100}
                  menuShouldScrollIntoView={false}

                />
              </div>


              <div className="col-lg-12 col-md-6 col-sm-11 mb-4 textOnInput ">


                <label className=" ">توضیحات </label>

                <textarea type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />


              </div>
            </div>




            <div className='d-flex justify-content-around mt-4 '>


              <button className="btn btn-success  " onClick={setDetails}
              >افزودن به لیست
                <ClipLoader

                  loading={loading}
                  color="#ffff"
                  size={15}
                /></button>


              <button className="btn btn-danger  "
                onClick={closeModal}>بازگشت
              </button>

            </div>



          </div>


        </Modal>
      </div>
    </div>

  )
}

export default LandingSetComponentDetails