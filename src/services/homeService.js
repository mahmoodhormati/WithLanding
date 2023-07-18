import http from './httpService';
let configure=window.globalThis.site_url;


export const GetHomeComponents = () => {
    return http.get(`${configure}/Home/GetComponents`);
}

export const GetHomeSeoAttributes = (url) => {
    return http.get(`${configure}/Home/GetSeoAttribute`,url);
}