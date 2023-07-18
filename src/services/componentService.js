import http from './httpService';
let configure=window.globalThis.site_url;

export const SetComponent=(body)=>{

    return http.post(`${configure}/Component/SetComponent`,JSON.stringify(body));

}
export const GetComponents = (url) => {
    return http.get(`${configure}/Component/GetComponents`,url);
}

export const GetComponentbyId = (id) => {
    return http.get(`${configure}/Component/GetComponent?Id=${id}`);
}

export const SetComponentDetail=(body)=>{

    return http.post(`${configure}/Component/SetComponentDetail`,JSON.stringify(body));

}

export const DeleteComponent=(body)=>{



    return http.post(`${configure}/Component/DeleteComponent`,body);
}

export const DeleteComponentDetail=(body)=>{


    
    return http.post(`${configure}/Component/DeleteComponentDetail`,body);
}