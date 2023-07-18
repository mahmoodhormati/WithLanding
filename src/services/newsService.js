import http from './httpService'

let configure=window.globalThis.site_url;


export const GetAllNewsForUsers=()=>{

    return http.get(`${configure}/News/GetNewss?IsAdmin=false`)
}
export const GetAllNewsForUsersPage=(url)=>{

    return http.get(`${configure}/News/GetNewss?IsAdmin=false`,url)
}
export const GetAllNewsForAdmin=()=>{

    return http.get(`${configure}/News/GetNewss?IsAdmin=true`)
}
export const GetAllNewsForAdminPage=(url)=>{

    return http.get(`${configure}/News/GetNewss?IsAdmin=true`, url)
}
export const SetNews=(news)=>{

    return http.post(`${configure}/News/SetNews`,JSON.stringify(news))
}
export const DeleteNews=(deleteid)=>{
    let config={headers:
    {
        Authorization:`Bearer ${localStorage.getItem('token')}`
    },
    data:{
        id:(deleteid)
    }
    }

    return http.delete(`${configure}/News/DeleteNews`,config)
}