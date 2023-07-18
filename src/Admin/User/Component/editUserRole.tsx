import React, { useCallback, useEffect, useState } from "react";
import { GetUserInfo, GetUsersRoles, SetUserRole } from "../../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { optionsRole } from "../../../Common/Enums/RolesEnums";
import Modal from 'react-modal';
import {ClipLoader} from "react-spinners";
import { GetUsersRolesById } from '../../../services/userService';


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

interface Props{
    id:any,closeModal:any,modalIsOpen:any
}
const EditUserRole:React.FC<Props> = ({id,closeModal,modalIsOpen}) => {
    const [editRoles, setEditRoles] = useState([])
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);


    const getrole = async () => {
        try {
            const { data, status } = await GetUsersRolesById(Number(id))
            setRoles(data.result.userRoleIds)

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
if(id>0){
        getrole();
}
    }
        , [])

    const UserRoles = () => {
        if (!roles[0]) {
            return (<span>نامشخص </span>)
        }


        if (roles[0] === 1) {
            return (<span>ثبت نام شده </span>)
        }
        if (roles[0] === 2) {
            return (<span> مشتری</span>)
        }
        if (roles[0] === 3) {
            return (<span> کارمند</span>)
        }
        if (roles[0] === 4) {
            return (<span> کارشناس پشتیبانی</span>)
        } if (roles[0] === 5) {
            return (<span>ادمین مالی</span>)
        }
        if (roles[0] === 6) {
            return (<span> ادمین انبار</span>)
        }
        if (roles[0] === 7) {
            return (<span> ادمین</span>)
        }
        if (roles[0] === 8) {
            return (<span> سوپر ادمین</span>)
        }
    }
    const userRoles = {
        userRoleIds: [
            editRoles
        ],
        userId: id
    }
    const setRole = async () => {
setLoading(true)
        const { data, status } = await SetUserRole(userRoles)
        try {

            closeModal()

            if (status === 200) {

                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

setLoading(false)
            }

        } catch (error) {
            console.log(error);
            setLoading(false)

        }
        setLoading(false)

    }


    const onchangRole = (e:any) => {
        setEditRoles(e.value)
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
            <div>
                <div className="card-body p-0" style={{ height: '14rem', width: '20rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">نوع کاربر</h5>
                    </div>
                    <div className="form-row mt-4">
                        <div className="  form-group col-md-12 col-xs-12 textOnInput  selectIndex">


                            <form>
                                <div className='form-group'>

                                    <div className="form-group mb-3">

                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            className="opacityForInput"
                                            options={optionsRole}
                                            placeholder={UserRoles()}
                                            onChange={onchangRole}
                                            maxMenuHeight={100}
                                        />
                                    </div>

                                </div>
                            </form>
                        </div>

                    </div>
                    <div className='text-center mt-2'>

                        <div className='col-12 '>
                            <button disabled={loading} className="btn btn-success  "
                                onClick={setRole}>تایید
                                <ClipLoader

                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>)
}
export default EditUserRole