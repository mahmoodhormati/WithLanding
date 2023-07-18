import http from "./httpService";

let configure=window.globalThis.site_url;


export const getAllWithRole=(roleId)=>{
    return http.get(`${configure}/AuthenticatedUser/GetUsers?RoleIds=${roleId}`);
}
export const setCustomerInfo=(user)=>{
    return http.put(`${configure}/AuthenticatedUser/SetUserInfo`,JSON.stringify(user));
}



export const CreateCustomer=(user)=>{
    return http.post(`${configure}/AuthenticatedUser/CreateUser`,JSON.stringify(user));
}


