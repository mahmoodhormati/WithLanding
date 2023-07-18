import http from './httpService';

let configure=window.globalThis.site_url;


export const GetGroupsForEntity=(entityTypeId , url)=>{

    return http.get(`${configure}/Group/GetGroups?EntityTypeId=${entityTypeId}` , url)
}
export const GetGroupByIds=(url)=>{

    return http.get(`${configure}/Group/GetGroups`,url);
}
export const GetGroupWithCompany=(entityTypeId , companyId)=>{

    return http.get(`${configure}/Group/GetGroups?EntityTypeId=${entityTypeId}&CompanyId=${companyId}`)
}
export const GetGroupById=(groupId)=>{

    return http.get(`${configure}/Group/GetGroup?Id=${groupId}`)
}
export const SetGroup=(group)=>{

    return http.post(`${configure}/Group/SetGroup`,JSON.stringify(group))
}
export const DeleteGroup=(groupId)=>{
    let config={headers:
    {
        Authorization:`Bearer ${localStorage.getItem('token')}`
    },
    data:{
        id:(groupId)
    }
    }

    return http.delete(`${configure}/Group/DeleteGroup`,config)
}