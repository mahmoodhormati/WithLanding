import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { ComponentTypes } from '../../../Common/Enums/ComponentTypeEnums'
import { ComponentTypeSpecific } from '../../../Common/Enums/ComponentTypeSpecific'
import { GetComponentbyId, SetComponent } from '../../../services/componentService'
import { toast } from 'react-toastify'
import LandingSetComponentDetails from './ComponentDetails/LandingSetComponentDetails'

const LandingEditComponent = () => {
  const [active, SetActive] = useState(true)
  const [showName, SetshowName] = useState(true)
  const [showDescription, SetshowDescription] = useState(true)
  const [name, Setname] = useState('')
  const [rowNumber, SetrowNumber] = useState<any>()
  const [height, Setheight] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [componentTypeId, setcomponentTypeId] = useState(0);
  const [currentSpecific, SetcurrentSpecific] = useState<any>([])
  const [componentTypeSpecificId, setcomponentTypeSpecificId] = useState(0);
  const [description, setDescription] = useState('');
  const[ComponentDetails,setComponentDetails]=useState([])
  const params = useParams()

  const getcomponent = async () => {

try {
  
  const {data,status}=await GetComponentbyId(params.id)
  if(status===200){
  SetshowDescription(data.result.component.showDescription)
  SetActive(data.result.component.active)
  SetshowName(data.result.component.showName)
  SetrowNumber(data.result.component.rowNumber)
  Setname(data.result.component.name)
  setcomponentTypeId(data.result.component.componentTypeId)
  SetcurrentSpecific(ComponentTypeSpecific.filter((item: any) => item.parent === data.result.component.componentTypeId).map((item: any) => ({ label: item.name, value: item.id })))
  setcomponentTypeSpecificId(data.result.component.componentTypeSpecificId)
  setDescription(data.result.component.description)
  Setheight(data.result.component.height)
  setComponentDetails(data.result.component)
}
} catch (error) {
  
}



  }

  useEffect(()=>{

    getcomponent()
  },[])
  const navigate = useNavigate()

  const submit = async () => {
    setLoading(true)
    let body = {
      "component": {
        "id": params.id,
        rowNumber,
        componentTypeId,
        componentTypeSpecificId,
        name,
        showName,
        description,
        showDescription,
        height,
        active,
        "componentDetails": null
      }
    }


    try {
      const { data, status } = await SetComponent(body)
      if (status === 200) {
        toast.success('کاربر با موفقیت ثبت شد', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined
        });


        navigate('/admin/componentList')

        setLoading(false)

      }

    } catch (error) {

    }


  }



  const GetComponentTypes = () => {
    return (ComponentTypes.map((item: any) => ({ label: item.name, value: item.id })))
  }






  return (
    <div className='user-progress' >
      <div className='row'>
        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
          <h5> تعریف کامپوننت </h5>
          <p>در این بخش می توانید جزء جدیدی از صفحه اصلی تعریف کنید </p>


        </div>
      </div>
      <div className='box-big row d-flex justify-content-center'>
        <div className='col-md-12 col-xs-12'>


          <div className="form-group  textOnInput col-12 ">

            <div className="form-row">
              <div className="col-12 mb-5 d-flex justify-content-between ">
                <div className="col-lg-4 col-md-6 col-sm-11 ">


                  <label className="form-check-label mb-3">

                    <input type="checkbox" checked={active} className="form-check-input" onChange={e => SetActive(e.target.checked)} />
                    فعال
                  </label>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-11">

                  <label className="form-check-label mb-3">

                    <input type="checkbox" className="form-check-input" checked={showName} onChange={e => SetshowName(e.target.checked)} />
                    نمایش نام                                     </label>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-11">

                  <label className="form-check-label mb-3 ">

                    <input type="checkbox" className="form-check-input" checked={showDescription} onChange={e => SetshowDescription(e.target.checked)} />
                    نمایش توضیحات                                  </label>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 col-sm-11 mb-4">

                <label >نام</label>
                <input type="text" className="form-control opacityForInput" placeholder="name" value={name} onChange={(e: any) => Setname(e.target.value)} />



              </div>
              <div className="col-lg-2 col-md-3 col-sm-11 mb-4">

                <label >عرض نمایش </label>
                <input type="number" className="form-control opacityForInput" placeholder=" heigth" value={height} onChange={(e: any) => Setheight(Number(e.target.value))} />



              </div>
              <div className="col-lg-2 col-md-3 col-sm-11 mb-4">

                <label >شماره ردیف</label>
                <input type="number" className="form-control opacityForInput" placeholder="rowNumber" value={rowNumber} onChange={(e: any) => SetrowNumber(Number(e.target.value))} />



              </div>
              <div className="col-lg-3 col-md-3 col-sm-11 mb-4">
                <label > نوع قالب </label>
                <Select
                  menuShouldScrollIntoView={false}
                  placeholder='componentTypeId '
                  options={GetComponentTypes()}
                  value={GetComponentTypes().filter((item:any)=>item.value===componentTypeId).map((item:any)=>item)}
                  onChange={(e: any) => {
                    setcomponentTypeId(e.value)

                    SetcurrentSpecific(ComponentTypeSpecific.filter((item: any) => item.parent === e.value).map((item: any) => ({ label: item.name, value: item.id })))
                  }}

                />
              </div>
              <div className="col-lg-3 col-md-3 col-sm-11 mb-4">
                <label >مشخصه قالب</label>
                <Select
                 value={currentSpecific.filter((item:any)=>item.value===componentTypeSpecificId).map((item:any)=>item)}
                  menuShouldScrollIntoView={false}
                  placeholder='componentTypeSpecificId'
                  options={currentSpecific}
                  onChange={(e: any) => {
                    setcomponentTypeSpecificId(e.value)


                  }}
                />
              </div>

              <div className="col-lg-12 col-md-6 col-sm-11 mb-4">
                <label >توضیحات</label>

                <textarea rows={2} className='form-control opacityForInput' placeholder='description' value={description} onChange={e => setDescription(e.target.value)}></textarea>

              </div>
              <div className="form-group m-auto label textOnInput col-lg-12 rounded border  border-dark ">
                <label >اجزا</label>

               <LandingSetComponentDetails componentDetails={ComponentDetails}  GetComponent={getcomponent} componentId={params.id}/>

              </div>
            </div>

            <div className="d-flex justify-content-center">

              <div className=' m-1'>

                <button className="btn btn-success  " onClick={submit}>تایید <ClipLoader

                  loading={loading}
                  color="#ffff"
                  size={15}
                /></button>
              </div>
              <div className='  m-1'>
                <NavLink to='/admin/componentList' className="btn btn-danger float-right">بازگشت</NavLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingEditComponent