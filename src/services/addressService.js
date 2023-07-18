import http from './httpService';

let configure=window.globalThis.site_url;
export const GetAllProvince=()=>{

    return http.get(`${configure}/Address/GetProvinces`);

}
export const SetAddress=(body)=>{

    return http.post(`${configure}/Address/SetAddress`,JSON.stringify(body));

}
export const GetAddress = (entityTypeId , entityId) => {
    return http.get(`${configure}/Address/GetAddresss?EntityId=${entityId}&EntityTypeId=${entityTypeId}`);
}

export const GetAddressByIds = (ids) => {
    return http.get(`${configure}/Address/GetAddresss`,ids);
}