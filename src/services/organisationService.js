import http from "./httpService";

let configure=window.globalThis.site_url;

export const GetOrganisationCode=(company)=>{

    return http.get(`${configure}/Organization/GetOrganization?NationalId=${company}`);



}
export const GetOrganisationById=(id)=>{

    return http.get(`${configure}/Organization/GetOrganization?Id=${id}`);



}
export const GetOrganisationByIdAdmin=(id)=>{

    return http.get(`${configure}/Organization/GetOrganization?Id=${id}&IsAdmin=true`);



}
export const GetAllOrganisationCode=(url)=>{

    return http.get(`${configure}/Organization/GetOrganizations` , url);



}
export const GetAllOrganisation=()=>{

    return http.get(`${configure}/Organization/GetOrganizations?PageNumber=0&PageSize=500000000` );



}
export const SetOrganisation=(organisation)=>{

    return http.post(`${configure}/Organization/SetOrganization`,JSON.stringify(organisation));



}
export const DeleteOrganization=(deleteid)=>{
    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{
            id:(deleteid)
        }
    }

    return http.delete(`${configure}/Organization/DeleteOrganization`,config)
}


