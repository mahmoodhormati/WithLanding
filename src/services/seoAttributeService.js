import http from './httpService';
let configure=window.globalThis.site_url;



export const GetSeoAttributes = (url) => {
    return http.get(`${configure}/Seo/GetSeoAttributes`,url);
}

export const SetSeoAttributes=(body)=>{

    return http.post(`${configure}/Seo/SetSeoAttributes`,JSON.stringify(body));

}
