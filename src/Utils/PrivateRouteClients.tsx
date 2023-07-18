import React, {useState, useEffect} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GetUsersRoles } from "../services/userService";
 interface Props {
     children :JSX.Element
}

const PrivateRouteClients : React.FC<Props>= ({children}:Props) => {

    const token = localStorage.getItem("token")
    const location = useLocation()
    
    return token    ?
    children 
 : 
     <Navigate to="/login"  replace state={{ from: location }}/>
};

export default PrivateRouteClients;