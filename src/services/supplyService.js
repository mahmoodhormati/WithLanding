import http from "./httpService";

let configure=window.globalThis.site_url;

export const GetAllSuppliers=(url)=>{

    return http.get(`${configure}/Supply/GetSuppliers` , url);
}
export const GetAllSuppliersExcel=(url)=>{

    return http.get(`${configure}/Supply/GetSuppliers?pageSize=1000000` );
}
export const GetSupplier=(id)=>{

    return http.get(`${configure}/Supply/GetSupplier?Id=${id}`);
}

export const SetSupplier=(supplier)=>{

    return http.post(`${configure}/Supply/SetSupplier`,JSON.stringify(supplier));
}
export const  DeleteSupplier=id =>{
    let config={headers:
        {
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        data:{
            id:(id)
        }
        }
    return http.delete(`${configure}/Supply/DeleteSupplier`,config);
}

export const GetAllSupplies=()=>{

    return http.get(`${configure}/Supply/GetSupplys` );
}
export const GetSupply=(id)=>{

    return http.get(`${configure}/Supply/GetSupply?Id=${id}`);
}
export const SetSupply=(supply)=>{

    return http.post(`${configure}/Supply/SetSupply`,JSON.stringify(supply));
}
export const  DeleteSupply=id =>{
    let config={headers:
        {
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        data:{
            id:(id)
        }
        }
    return http.delete(`${configure}/Supply/DeleteSupply`,config);
}
export const GetDataWithSearchSupply=(url)=>{

    return http.get(`${configure}/Supply/GetSupplys`,url);
}