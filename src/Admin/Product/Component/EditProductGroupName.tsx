import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { GetGroupById } from '../../../services/GroupService';
import { SetGroup } from '../../../services/GroupService';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { GetCompanyChild } from '../../../services/companiesService';
import  Select  from 'react-select';

const EditProductGroupName:React.FC = () => {
    const navigate = useNavigate()
    const params = useParams();
    const [entityTypeId, setEntityTypeId] = useState(0)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);
    const [userCompanies, setUserCompanies] = useState([])
    let [companyId, SetcompanyId] = useState()
    let [companyName, SetCompanyName] = useState()


    
const getCompanies = async () => {
    try {
        const { data, status } = await GetCompanyChild()
        setUserCompanies(data.result.companies)
        SetcompanyId(data.result.companies[0].id)
        SetCompanyName(data.result.companies[0].name)


    } catch (error) {

    }

}
    const getGroup = async () => {

        try {
            const { data, status } = await GetGroupById(params.id)
            setName(data.result.group.name)
            setEntityTypeId(data.result.group.entityTypeId)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getCompanies()

        getGroup();
    }, [])

    const handelSubmit = async (event:any) => {

        setLoading(true)

        event.preventDefault();

        try {
            const body = {
                group: {
                    id: Number(params.id),
                    entityTypeId,
                    name, companyId
                    ,companyName
                }
            }

            const { data, status } = await SetGroup(body)
            if (status === 200) {
                toast.success('گروه ویرایش  شد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    })
                navigate('/admin/productgroup')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)

            console.log(error);
        }
        setLoading(false)


    }
    const companys = () => {
        return (userCompanies.map((item:any) => ({ label: item.name, value: item.id })))

    }
    let defaultValue = companys()[0]

    return (

        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش گروه کالا</h5>
                    <p>در این بخش می توانید گروه را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='col-md-8 col-xs-12'>


                    <form>
                        <div className='form-group'>

                            <div className="form-group mb-4 textOnInput">
                                <label>نام گروه</label>
                                <input type="text" className="form-control opacityForInput" placeholder="گروه" aria-describedby="basic-addon1" value={name} onChange={(e:any) => setName(e.target.value)} />

                            </div>
                         
                            <div className='row '>
                                <div className='col-6 '>
                                    <button type="submit" disabled={loading} className="btn btn-success float-left" onClick={handelSubmit} >ثبت<ClipLoader

                                        loading={loading}
                                        color="#ffff"
                                        size={15}
                                    /></button>
                                </div>
                                <div className='col-6 '>
                                    <NavLink to='/admin/productgroup' className="btn btn-danger float-right">بازگشت</NavLink>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default EditProductGroupName