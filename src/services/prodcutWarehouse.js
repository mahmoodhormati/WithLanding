import http from './httpService';

let configure=window.globalThis.site_url;


export const GetAllProducts=()=>{

    return http.get(`${configure}/Product/GetProducts?isAdmin=true`);
}

export const SetProductWareHouses=(wareProduct)=>{

    return http.post(`${configure}/WareHouse/SetProductWareHouses`,JSON.stringify(wareProduct));
} 
export const GetProductWareHouses=(id)=>{

    return http.get(`${configure}/WareHouse/GetProductWareHouses?ProductId=${id}`);
}