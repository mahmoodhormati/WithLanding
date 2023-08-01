import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './Login';
import { removeRole } from '../../../store/Slice/user/userRole/userRoleSlice';
import { logOutReducesr } from '../../../store/Slice/login/loginSlice';
import { userDelete } from '../../../store/Slice/user/userSlice';
import axios  from 'axios';
import SysPlus from '../../../Landing/SysPlus';




const Logout:React.FC = () => {
    const history = useNavigate();
    const location=useLocation()
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    useEffect(() => {

        redirectTologin()



    }, [])


    console.log(location);
    
    const redirectTologin = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem('connect');
        localStorage.removeItem('username');
        localStorage.removeItem('mobile')
        localStorage.clear()
        sessionStorage.clear()
        delete axios.defaults.headers.common["Authorization"];
    if(!token){
        return(<Navigate to='/' replace state={{ from: location }}/>)
    }
    else{
        history('/login')
    }
    {

    }
    }
    return (null)

};

export default Logout;