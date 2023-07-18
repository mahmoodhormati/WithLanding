import http from "./httpService";


let configure=window.globalThis.site_url;

export const GetAllProductSupplyForAdmin=()=>{

    return http.get(`${configure}/Product/GetProductSupplies?IsAdmin=true&Active=false&PageNumber=0&PageSize=10`);
}
export const GetAllProductSupplyBord=()=>{

    return http.get(`${configure}/Product/GetProductSupplies?Active=true&?PageNumber=0&PageSize=10000`);
}

export const GetProductSupply=(url)=>{
    return http.get(`${configure}/Product/GetProductSupplies?Active=true`,url)

}
export const GetAllProductSupplyBordAdmin=()=>{

    return http.get(`${configure}/Product/GetProductSupplies?IsAdmin=true&Active=true&PageNumber=0&PageSize=1000`);
}
export const GetAllProductSupply=(id)=>{

    return http.get(`${configure}/Product/GetProductSupply?Id=${id}`);
}
export const SetProductSupply=(ProductSupply)=>{

    return http.post(`${configure}/Product/SetProductSupply` ,JSON.stringify(ProductSupply));
}
export const DeleteProductSupply=(ProductSupplyId)=>{

    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{
            id:(ProductSupplyId)
        }
    }
    return http.delete(`${configure}/Product/DeleteProductSupply`,config);
}


export const GetAllProductWithSearch=(searchParams)=>{

    return http.get(`${configure}/Product/GetProductSupplies`,searchParams)
}


export const ChangeProductSupplyAction=(obj)=>{

    return http.post(`${configure}/Product/ChangeProductSupplyActive` ,JSON.stringify(obj));
}