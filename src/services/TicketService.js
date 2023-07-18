import http from './httpService';

let configure=window.globalThis.site_url;


export const GetSupportRequesstsAdmin=(url)=>{

    return http.get(`${configure}/SupportRequest/GetSupportRequests?OnlineChat=false` , url);
}

export const GetSupportRequesstsUser=(id , url)=>{

    return http.get(`${configure}/SupportRequest/GetSupportRequests?CreatorId=${id}&OnlineChat=false` ,url);
}
export const GetSupportRequestMessages=(id)=>{

    return http.get(`${configure}/SupportRequest/GetSupportRequestMessages?SupportRequestId=${id}`);
}
export const  setSupportRequessts=(supportRequess) =>{
    return http.post(`${configure}/SupportRequest/SetSupportRequest`, JSON.stringify(supportRequess));
}
export const  SetSupportRequestMessage=(SupportRequestMessage) =>{
    return http.post(`${configure}/SupportRequest/SetSupportRequestMessage`,JSON.stringify(SupportRequestMessage));
}