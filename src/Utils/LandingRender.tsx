import React, {useState, useEffect} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GetUsersRoles } from "../services/userService";
 interface Props {
     children :any
}

const LandingRender : React.FC<Props>= ({children}:Props) => {

    const token = localStorage.getItem("token")
    const location = useLocation()
    
    return children    ?
    children 
 : 
    null
};

export default LandingRender;