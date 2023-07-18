import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './Login';
import { removeRole } from '../../../store/Slice/user/userRole/userRoleSlice';
import { logOutReducesr } from '../../../store/Slice/login/loginSlice';
import { userDelete } from '../../../store/Slice/user/userSlice';
import axios  from 'axios';




const Logout:React.FC = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    useEffect(() => {

        redirectTologin()



    }, [])

    const redirectTologin = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem('connect');
        localStorage.removeItem('username');
        localStorage.removeItem('mobile')
        localStorage.clear()
        sessionStorage.clear()
        delete axios.defaults.headers.common["Authorization"];
     
        history("/login");

    }
    return (null)

};

export default Logout;