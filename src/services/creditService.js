import http from './httpService';
let configure=window.globalThis.site_url;


export const GetCredits=(url)=>{

    return http.get(`${configure}/Credit/GetCredits`,url);

}
export const GetCreditById=(id)=>{

    return http.get(`${configure}/Credit/GetCredit?CreditId=${id}`);

}
export const CreateCredit=(body)=>{

    return http.post(`${configure}/Credit/SetCredit` ,JSON.stringify(body));

}

export const AddCreditMember=(body)=>{

    return http.post(`${configure}/Credit/SetCreditMember` ,JSON.stringify(body));

}
