import http from "./httpService";

let configure=window.globalThis.site_url;

export const getExtraData=(id,source)=>{
    return http.get(`${configure}/ExtraData/GetExtraDatas?Id=${id}&DataSourceId=${source}`);
}