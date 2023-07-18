import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { GetAttribute, GetAttributeValues, SetAttributeValues } from '../../../services/attributeService';
import { toast } from 'react-toastify';
import { IoFastFood } from 'react-icons/io5';
import { GetGroupsForEntity } from '../../../services/GroupService';
import { CreateUser, GetUserData } from '../../../services/userService';
import { setCustomerInfo } from '../../../services/customerService';
import Modal from 'react-modal';
import {ClipLoader} from "react-spinners";
import { GetGroupWithCompany } from '../../../services/GroupService';
import { GetCompanyChild } from '../../../services/companiesService';

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
interface Props{
    id:any, closeModal:any, modalIsOpen:any,refresh:any 
}
const EditCustomerGroup:React.FC<Props> = ({ id, closeModal, modalIsOpen,refresh }) => {
    const [CustomerG, setCustomerG] = useState([])
    const [userinfo, setUserInfo] = useState<any>({});
    const [groupId, setGroupId] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const params = useParams();


    
    const GetCustomerGroup = async () => {
        if(id>0 && id!==undefined){
        const response = await GetCompanyChild();
        let companies = response.data.result.companies
        let arr = []
        let finalArr:any=[]
        for (let i = 0; i < companies.length; i++) {

            const { data, status } = await GetGroupWithCompany(1, companies[i].id);

            if(data.result.groups.length>0)
            {
               arr.push(data.result.groups)
            }


        }

        finalArr=Array.prototype.concat.apply([], arr);

        setCustomerG(finalArr);
    }
    }
let userId:any;
if(id>0){
    userId=id
}
    const getUserInfo = async () => {
       if(id>0 && id!==undefined){
        try {
            const { data, status } = await GetUserData(userId);
            if (status === 200) {
                setUserInfo(data.result.customer)
                setGroupId(data.result.customer.groupId)
            }
        } catch (error) {
            console.log(error);
        }
       }
    }

    // useEffect(() => {

    //     GetCustomerGroup()
        
    //     getUserInfo();
        
    // }, [id])

    const inputCustomerG :any= () => {
        let customer = [...CustomerG, { id: null, name: 'تعیین نشده' }]

        return (customer.map(data => ({ label: data.name, value: data.id })))
    }



    const handelSubmit = async () => {
        setLoading(true)
    
        closeModal()

        const body = {
            id,
            userName: userinfo.userName,
            email: userinfo.email,
            firstName: userinfo.firstName,
            lastName: userinfo.lastName,
            requireInfo: userinfo.requireInfo,
            createDate: userinfo.createDate,
            nationalCode: userinfo.nationalCode,
            organizationId: userinfo.organizationId,
            password: null,
            salt: null,
            sugar: null,
            islegal: true,
            groupId,
            active: true

        }
        try {

            const { data, status } = await setCustomerInfo(body);
            if (data.success===true) {
                setLoading(false)
                toast.success('با موفقیت ثبت شد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    })
            }

        } catch (error) {
            console.log(error);
            setLoading(false)

        }
        refresh()

    }
    let Group = CustomerG.filter((item:any) => item.id === groupId).map((item:any) => item.name)
    let groupName = Group[0] ? Group[0] : "تعیین نشده"
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
                <div className="card-body p-0" style={{ height: '14rem', width: '20rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">  گروه مشتری </h5>
                    </div>
                    <div className="form-row mt-4">
                        <div className="  form-group col-md-12 col-xs-12 textOnInput  selectIndex">


                            <form>
                                <div className='form-group'>

                                    <div className="form-group mb-3">

                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            value={{ label: groupName, value: groupId }}
                                            options={inputCustomerG()}
                                            onChange={(e:any) => {
                                                setGroupId(e.value)

                                            }}


                                        />
                                    </div>

                                </div>
                            </form>
                        </div>

                    </div>
                    <div className='text-center mt-2'>

                        <div className='col-12 '>
                            <button  disabled={loading} className="btn btn-success  "
                                onClick={handelSubmit}>تایید
                                <ClipLoader

                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                /></button>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>

    )
}

export default EditCustomerGroup