import http from "./httpService";
import config from "./config.json";

let configure=window.globalThis.site_url;

export const GetProductSupplyConditions=(id)=>{

    return http.get(`${configure}/Product/GetProductSupplyConditions?ProductSupplyId=${id}&IsAdmin=true&PageSize=1000`);

}
export const GetProductSupplyConditionsCustomer=(id)=>{

    return http.get(`${configure}/Product/GetProductSupplyConditions?ProductSupplyId=${id}&PageSize=1000`);

}
export const SetProductSupplyConditions=(body)=>{

    return http.post(`${configure}/Product/SetProductSupplyCondition` , JSON.stringify(body));

}
export const  DeleteProductSupplyCondition=id =>{
    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{
            id:(id)
        }
    }
    return http.delete(`${configure}/Product/DeleteProductSupplyCondtion`,config);
}