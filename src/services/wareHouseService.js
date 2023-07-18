import http from './httpService';

let configure=window.globalThis.site_url;


export const GetAllWareHouses=(url)=>{

    return http.get(`${configure}/WareHouse/GetWareHouses`, url);
}
export const GetAllWareHouse=(id)=>{

    return http.get(`${configure}/WareHouse/GetWareHouse?Id=${id}`);
}
export const SetWareHouses=(warehouse)=>{

    return http.post(`${configure}/WareHouse/SetWareHouse`,JSON.stringify(warehouse));
}

export const GetProductHouses=()=>{

    return http.get(`${configure}/WareHouse/GetProductWareHouses`);
}
export const GetAllWareHousesExcel=()=>{

    return http.get(`${configure}/WareHouse/GetWareHouses?pageSize=10000000`);
}

export const DeleteHouses=(warehouseId)=>{

    let config={headers:
        {
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        data:{
            id:(warehouseId)
        }
        }
    return http.delete(`${configure}/WareHouse/DeleteWareHouse`,config);
}