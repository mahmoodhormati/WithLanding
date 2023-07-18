import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { ClipLoader } from 'react-spinners'
import { ComponentTypes } from '../../../Common/Enums/ComponentTypeEnums'
import { ComponentTypeSpecific } from '../../../Common/Enums/ComponentTypeSpecific'
import { SetComponent } from '../../../services/componentService'
import { toast } from 'react-toastify'

const LandingNewComponent = () => {
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


const navigate=useNavigate()

    const submit = async () => {
        setLoading(true)
        let body = {
            "component": {
                "id": 0,
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
                <div className='col-md-7 col-xs-12'>


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

                            <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                <label >نام</label>
                                <input type="text" className="form-control opacityForInput" placeholder="name" value={name} onChange={(e: any) => Setname(e.target.value)} />



                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                <label >عرض نمایش </label>
                                <input type="number" className="form-control opacityForInput" placeholder=" heigth" value={height} onChange={(e: any) => Setheight(Number(e.target.value))} />



                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-11 mb-4">

                                <label >شماره ردیف</label>
                                <input type="number" className="form-control opacityForInput" placeholder="rowNumber" value={rowNumber} onChange={(e: any) => SetrowNumber(Number(e.target.value))} />



                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                <label > نوع قالب </label>
                                <Select
                                    menuShouldScrollIntoView={false}
                                    placeholder='componentTypeId '
                                    options={GetComponentTypes()}
                                    onChange={(e: any) => {
                                        setcomponentTypeId(e.value)

                                        SetcurrentSpecific(ComponentTypeSpecific.filter((item: any) => item.parent === e.value).map((item: any) => ({ label: item.name, value: item.id })))
                                    }}

                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-11 mb-4">
                                <label >مشخصه قالب</label>
                                <Select
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

                                <textarea rows={4} className='form-control opacityForInput' placeholder='description' value={description} onChange={e => setDescription(e.target.value)}></textarea>

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

export default LandingNewComponent