import http from "./httpService";

let configure=window.globalThis.site_url;

export const GetShoppingContracts=(url)=>{

    return http.get(`${configure}/Shipping/GetShippingContracts`, url);
}
export const GetShoppingContract=(id)=>{

    return http.get(`${configure}/Shipping/GetShippingContract?Id=${id}`);
}
export const GetShoppingContractWithCompany=(id)=>{

    return http.get(`${configure}/Shipping/GetShippingContracts?ShippingCompanyId=${id}`);
}
export const GetShoppingContarcts=(url)=>{

    return http.get(`${configure}/Shipping/GetShippingContracts`,url);
}
export const GetShoppings=(id)=>{

    return http.get(`${configure}/Shipping/GetShippings?EntityId=${id}&EntityTypeId=10&PageNumber=0&PageSize=100000`);
}
export const GetShoppingsAdmin=(id)=>{

    return http.get(`${configure}/Shipping/GetShippings?EntityId=${id}&EntityTypeId=10&PageNumber=0&PageSize=100000&IsAdmin=true`);
}
export const SetShoppingContract=(ShoppingContract)=>{

    return http.post(`${configure}/Shipping/SetShippingContract`, JSON.stringify(ShoppingContract));
}
export const GetShippingCompanies=(url)=>{

    return http.get(`${configure}/Shipping/GetShippingCompanies`, url);
}
export const GetShipping=(url)=>{

    return http.get(`${configure}/Shipping/GetShippings`, url);
}
export const GetAllShippingCompanies=()=>{

    return http.get(`${configure}/Shipping/GetShippingCompanies?PageNumber=0&PageSize=1000000`);
}
export const GetShippingCompany=(id)=>{

    return http.get(`${configure}/Shipping/GetShippingCompany?Id=${id}`);
}
export const SetShippingCompany=(SetShippingCompany)=>{

    return http.post(`${configure}/Shipping/SetShippingCompany`, JSON.stringify(SetShippingCompany));
}

export const  DeleteShipping=id =>{
    let config={headers:
        {
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        data:{
            id:(id)
        }
        }
    return http.delete(`${configure}/Shipping/DeleteShipping`,config);
}

export const GetShippingReports=url=>{


    return http.get(`${configure}/Shipping/GetShippingReports`,url);



}
export const SetShippingReport=(body)=>{


    return http.post(`${configure}/Shipping/SetShippingReport`,JSON.stringify(body));



}
export const GetShoppingsClient=(id)=>{

    return http.get(`${configure}/Shipping/GetShippings?EntityId=${id}&EntityTypeId=10&PageNumber=0&PageSize=100000`);
}
export const GetShoppingsReporteBrief=(id)=>{

    return http.get(`${configure}/Shipping/GetShippings?EntityId=${id}&EntityTypeId=1&PageNumber=0&PageSize=5`);
}

export const SetShipping=(body)=>{

    return http.post(`${configure}/Shipping/SetShipping`,JSON.stringify(body));
}