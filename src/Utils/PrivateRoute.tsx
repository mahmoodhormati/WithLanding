import React, { useState, useEffect } from "react";
import { ImTab } from "react-icons/im";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { GetUsersRoles } from "../services/userService";
import { RootState } from "../store";
import { userRoles } from "../store/Slice/user/userRole/userRoleSlice";
import { decryptStirng } from './DecryptionUtill';
import { log } from "console";
interface Props {
    children: JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ children }: Props) => {



    const token = localStorage.getItem("token")
    let roles = useSelector((state: RootState) => state.roles);

    const EncryptRole = localStorage.getItem('rd')
    if (roles.length === 0) {
        if (EncryptRole) {
            roles = decryptStirng(EncryptRole)

        }
        else {
            roles = []
        }
    }
    const location = useLocation()











    if (roles.length > 0) {
        return token && roles.some((item: any) => item > 2) ? children : <Navigate to="/client" replace state={{ from: location }} />
    }

    else {
        return token ? children : <Navigate to="/login" replace state={{ from: location }} />
    }
};

export default PrivateRoute;