import React, { useEffect, useState } from 'react'
import { DeleteComponent, GetComponents, SetComponent } from '../../../services/componentService'
import QueryString from 'qs'
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch'
import Select from 'react-select'
import { useNavigate } from 'react-router'
import { ComponentTypes } from '../../../Common/Enums/ComponentTypeEnums'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LandingSortableItem from './LandingSortableItem'
import { indexOf } from 'lodash'
import { ComponentTypeSpecific } from '../../../Common/Enums/ComponentTypeSpecific'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { toast } from 'react-toastify'
import Modal from 'react-modal';




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
const LandingComponentList = () => {
  const [components, Setcomponents] = useState([])
  const [Name, SetName] = useState('')
  const [rowNumber, SetRowNumber] = useState()
  const [id, setId] = useState(0)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [ComponentTypeId, SetComponentTypeId] = useState()
  const [inEditMode, setInEditMode] = useState({

    status: false,

    rowKey: null,


  });
  const navigate = useNavigate()
  const onEdit = (Id) => {


    setInEditMode({

      status: true,

      rowKey: Id,




    })



  }


  const editRowNumber = async (item) => {


    const body = {

      "component": {
        ...item, rowNumber: rowNumber
      }
    }

    try {
      const { data, status } = await SetComponent(body)

      if (status === 200) {

        setInEditMode({ status: false, rowKey: null })
        toast.success('تغییرات ثبت شد', {
          position: "top-right",
          closeOnClick: true,
        })
        getAllComponent()

      }
    } catch (error) {


    }


  }
  const closeModal = () => {
    setIsOpen(false);
  }
  const openModal = (id) => {
    setIsOpen(true);
    setId(id)

  }

  const getAllComponent = async () => {
    let config = {

      headers: { 'Content-Type': 'application/json' },
      params: {

        IsAdmin: true
      }
      ,
      paramsSerializer: (params) => {

        return QueryString.stringify(params)
      }

    };
    try {

      const { data, status } = await GetComponents(config)
      if (status === 200) {
        Setcomponents(data.result.components)
      }
    } catch (error) {

      console.log(error);

    }

  }


  useEffect(() => {
    getAllComponent()
  }, [])


  const deletHandler = async() => {
if(id&& id>0){
    try {

      const body={
        'id':id
      }


      const{data,status}=await DeleteComponent(body)
      if(status===200){
        toast.success(`قالب شماره ${id} حذف شد`, {
          position: "top-right",
          closeOnClick: true,
        })

        closeModal()
        getAllComponent()
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  }

  const addNewComponent = () => {
    navigate('/admin/newcomponent')
  }
  const handeltoNavigate = (id) => {
    navigate(`/admin/component/${id}`)
  }
  const handelSearchFieldClear = () => {
    SetName('')
    SetComponentTypeId(null)
  }

  const getDataBySearch = async () => {
    let config = {

      headers: { 'Content-Type': 'application/json' },
      params: {

        IsAdmin: true,
        ComponentTypeId,
        Name
      }
      ,
      paramsSerializer: (params) => {

        return QueryString.stringify(params)
      }

    };
    try {

      const { data, status } = await GetComponents(config)
      if (status === 200) {
        Setcomponents(data.result.components)
      }
    } catch (error) {

      console.log(error);

    }
  }

  const GetComponentTypes = () => {
    return (ComponentTypes.map((item) => ({ label: item.name, value: item.id })))
  }


  if (components.length > 0) {
    return (
      <div
      // className='user-progress'
      >


        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>

          </div>
        </div>

        <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  ">
          <AdvancedSearch>

            <form className='form-row textOnInput'>

              <div className="col-lg-4 col-md-4  col-sm-12    mb-1">
                <label>نام</label>

                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام " value={Name} onChange={e => SetName(e.target.value)} />
              </div>



              <div className="col-lg-4 col-md-6  col-sm-12 mb-4  selectIndex ">
                <label>  نوع قالب</label>
                <Select
                  value={GetComponentTypes().filter((item) => item.value === ComponentTypeId).map((i) => i)[0]}
                  menuShouldScrollIntoView={false}
                  placeholder='ComponentTypeId'

                  options={GetComponentTypes()}
                  onChange={(e) => SetComponentTypeId(e.value)}


                />
              </div>



            </form>
            <div className="  filter-btn ">
              <div className=" row  ">
                <div className="col-6 ">
                  <button onClick={handelSearchFieldClear}
                    className="  btn-sm btn-danger ">حذف فیلتر
                  </button>
                </div>
                <div className="col-6">
                  <button onClick={getDataBySearch}
                    className="  btn-sm  btn-primary">جستجو
                  </button>
                </div>
              </div> </div>
          </AdvancedSearch>
        </div>


        <div className=" statbox widget-content widget-content-area">

          <div className="">


            <button onClick={addNewComponent} className="btn btn-primary m-3">تعریف قالب جدید</button>
            {/* <DndContext
              collisionDetection={closestCenter}
              onDragEnd={ handelDragEnd}

            >
              <div className='text-center mb-4'>

                <h4>لیست قالب ها</h4>
              </div>
              <SortableContext items={components}
                strategy={verticalListSortingStrategy}
              >

                <div className="d-flex flex-column justify-content-center w-50 m-auto  ">

                  {components.map((item, index) => (<LandingSortableItem
                    key={item.id}
                    id={item}
                    name={item.name}
                    description={item.description}
                    height={item.height}
                    componentTypeId={item.componentTypeId}
                    componentTypeSpecificId={item.componentTypeSpecificId}
                  />))}


                </div>
              </SortableContext>

            </DndContext> */}
            <table className='table '>
              <thead>
                <tr>
                  <th>شماره ردیف</th>
                  <th>نوع قالب</th>
                  <th>مشخصه قالب </th>
                  <th>نام قالب</th>
                  <th>ارتفاع</th>
                  <th>توضیحات</th>
                  <th>ویرایش</th>
                </tr>
              </thead>
              <tbody>
                {components.map((item) => (
                  <tr>
                    <td aria-label="وزن"
                      onClick={() => {
                        onEdit(item.id)
                        SetRowNumber(item.rowNumber)

                      }}>{
                        inEditMode.status && inEditMode.rowKey === item.id ? (
                          <input type='text' className="mt-2" style={{ maxWidth: '5rem' }} value={rowNumber} onChange={(e) => SetRowNumber(Number(e.target.value.replaceAll(",", "")))} />
                        ) :

                          (item.rowNumber)
                      }</td>
                    <td>{ComponentTypes.filter(i => i.id === item.componentTypeId).map(i => i.name)[0]}</td>
                    <td>{ComponentTypeSpecific.filter(i => i.id === item.componentTypeSpecificId).map(i => i.name)[0]}</td>
                    <td>{item.name}</td>
                    <td>{item.height}</td>
                    <td>{item.description}</td>
                    <td>
                      {inEditMode.status === false ? <div className='text-center'>
                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                          data-placement="top" title="ویرایش"
                          onClick={
                            () => handeltoNavigate(item.id)
                          }
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                              d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button className="p-0 border-0  non-hover  bg-transparent edit-btn" onClick={() => openModal(item.id)} data-toggle="tooltip" data-placement="top" title="حذف">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
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
                      </div> : <div className='d-flex justify-content-center'>

                        <button className='bg-transparent border-0 m-1' title='ذخیره تغییرات' onClick={() => editRowNumber(item)}><AiOutlineCheckCircle size={'1.30rem'} style={{ color: 'green' }} /></button>
                        <button className='bg-transparent border-0 m-1' title='انصراف' onClick={() => setInEditMode({ status: false, rowKey: null })} ><AiOutlineCloseCircle size={'1.30rem'} style={{ color: 'red' }} /></button>


                      </div>}
                    </td>

                  </tr>




                ))

                }
              </tbody>
            </table>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Selected Option"
              ariaHideApp={false}

            >
              <div style={{ width: '20rem' }}>

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

                <div className='text-center'>
                  <p> آیا مطمئنید  قالب  {id}   </p>
                  <p>حذف شود ؟ </p>




                  <button className="btn btn-danger " onClick={deletHandler}>حذف
                  </button>
                </div>
                {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
              </div>
            </Modal>
          </div>

          <div className="d-flex justify-content-end">

          </div>
        </div>
      </div>

    )
  }
  else {
    return (
      <div
      // className='user-progress'
      >


        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>

          </div>
        </div>

        <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  ">
          <AdvancedSearch>

            <form className='form-row textOnInput'>

              <div className="col-lg-4 col-md-4  col-sm-12    mb-1">
                <label>نام</label>

                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام " value={Name} onChange={e => SetName(e.target.value)} />
              </div>



              <div className="col-lg-4 col-md-6  col-sm-12 mb-4  selectIndex ">
                <label>  نوع قالب</label>
                <Select
                  value={GetComponentTypes().filter((item) => item.value === ComponentTypeId).map((i) => i)[0]}
                  menuShouldScrollIntoView={false}
                  placeholder='ComponentTypeId'

                  options={GetComponentTypes()}
                  onChange={(e) => SetComponentTypeId(e.value)}


                />
              </div>



            </form>
            <div className="  filter-btn ">
              <div className=" row  ">
                <div className="col-6 ">
                  <button onClick={handelSearchFieldClear}
                    className="  btn-sm btn-danger ">حذف فیلتر
                  </button>
                </div>
                <div className="col-6">
                  <button onClick={getDataBySearch}
                    className="  btn-sm  btn-primary">جستجو
                  </button>
                </div>
              </div> </div>
          </AdvancedSearch>
        </div>


        <div className=" statbox widget-content widget-content-area">

          <div className="">


            <button onClick={addNewComponent} className="btn btn-primary m-3">تعریف قالب جدید</button>

            <div className='text-center mt-5'>
              <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
            </div>

          </div>

          <div className="d-flex justify-content-end">

          </div>
        </div>
      </div>

    )
  }
}

export default LandingComponentList