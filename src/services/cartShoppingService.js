import http from "./httpService";
import config from "./config.json";

let configure=window.globalThis.site_url;


export const AddTOCart=(addToCart)=>{

    return http.post(`${configure}/Order/AddToCart`,JSON.stringify(addToCart));
}
export const GetShoppingCart=(id)=>{

    return http.get(`${configure}/Order/GetShoppingCart?CustomerId=${id}`);
}
export const DeleteItemCart=(deleteid , customerId )=>{
    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{
            productSupplyId:deleteid,
            customerId:customerId,

        }

    }
    return http.delete(`${configure}/Order/DeleteCart` , config);
}
export const DeleteItemCarts=( customerId )=>{
    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{

            customerId:customerId,

        }

    }
    return http.delete(`${configure}/Order/DeleteCart` , config);
}
