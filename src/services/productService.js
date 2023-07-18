import http from './httpService';

let configure=window.globalThis.site_url;



export const GetAllProducts=()=>{

    return http.get(`${configure}/Product/GetProducts?Active=true&isAdmin=true`);
}
export const GetProducts=()=>{

    return http.get(`${configure}/Product/GetProducts?Active=true&isAdmin=true&PageSize=10000000`);
}
export const GetProductsWithCompanyForCombos=(companyId)=>{

    return http.get(`${configure}/Product/GetProducts?Active=true&isAdmin=true&PageSize=10000000&CompanyId=${companyId}`);
}

export const SetProduct=(product)=>{

    return http.post(`${configure}/Product/SetProduct`,JSON.stringify({product}));
}
export const  getEditProduct=id =>{
    return http.get(`${configure}/Product/GetProduct?Id=${id}`);
}
export const  DeleteProduct=id =>{
    let config={headers:
        {
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        data:{
            id:(id)
        }
        }
    return http.delete(`${configure}/Product/DeleteProduct`,config);
}

export const GetProductsWithSearch=(searchParams)=>{

    return http.get(`${configure}/Product/GetProducts`,searchParams)
}