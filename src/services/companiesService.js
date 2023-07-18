import http from './httpService'
let configure=window.globalThis.site_url;


export const GetCompanyChild=()=>{

    return http.get(`${configure}/Company/GetChildCompanies`);

}

export const GetCompanyEntityAccess=(url)=>{

    return http.get(`${configure}/Company/GetCompanyEntityAccess`,url);

}

export const SetCompanyEntityAccess=(body)=>{

    return http.post(`${configure}/Company/SetCompanyEntityAccess`,JSON.stringify(body));

}
