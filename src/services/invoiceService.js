
import http from "./httpService";

let configure=window.globalThis.site_url;



export const CreateInvoice=(invoiceData)=>{
    return http.post(`${configure}/Invoice/CreateInvoice`,JSON.stringify(invoiceData));
}

export const GetInvoicesWithSearch=(url)=>{

    return http.get(`${configure}/Invoice/GetInvoices`,url);

}
export const GetPaymentMethods=(url)=>{

    return http.get(`${configure}/Invoice/GetPaymentMethods`,url);

}