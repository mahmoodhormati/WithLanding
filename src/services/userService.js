import http from "./httpService";

let configure=window.globalThis.site_url;

export const registerUser = user => {
    return http.post(
        `${configure}/Account/register`,
        JSON.stringify(user)
    );
};


export const loginUser = user => {
    return http.post(`${configure}/User/Login`, JSON.stringify(user));
};
export const verifyUser = user => {
    return http.post(`${configure}/User/Verify`, JSON.stringify(user));
    
};
export const RefreshToken = refresh => {
    return http.post(`${configure}/User/Refresh`, JSON.stringify(refresh));
    
};

export const GetUserInfo=()=>{

    return http.get(`${configure}/AuthenticatedUser/GetUserInfo`);
}

export const GetUserData=(id)=>{

    return http.get(`${configure}/AuthenticatedUser/GetUserInfo?CustomerId=${id}&IsAdmin=true`);
}
export const GetUsersRolesById=(userId)=>{

    return http.get(`${configure}/AuthenticatedUser/GetUserRoles?UserId=${userId}`);
}
export const GetUsersRoles=()=>{

    return http.get(`${configure}/AuthenticatedUser/GetUserRoles`);
}

export const GetAllUsers=()=>{

    return http.get(`${configure}/AuthenticatedUser/GetUsers`);
}
export const SetUserRole=(userRole)=>{
    return http.post(`${configure}/AuthenticatedUser/SetUserRoles`,JSON.stringify(userRole));
}
export const CreateUser=(userData)=>{
    return http.post(`${configure}/AuthenticatedUser/CreateUser`,JSON.stringify(userData));
}


export const GetDataWithSearch=(url)=>{

    return http.get(`${configure}/AuthenticatedUser/GetUsers`,url);
}
export const GetForKarbars=(url)=>{

    return http.get(`${configure}/AuthenticatedUser/GetUsers`,url);
}


