import http from "./httpService";

let configure=window.globalThis.site_url;



export const CreatePayment=(PaymentData)=>{
    return http.post(`${configure}/Payment/CreatePayment`,JSON.stringify(PaymentData));
}
export const ChangePaymentStatus=(PaymentData)=>{
    return http.post(`${configure}/Payment/ChangePaymentStatus`,JSON.stringify(PaymentData));
}

export const GetPayments=(url)=>{

    return http.get(`${configure}/Payment/GetPayments`,url);

}
export const GetInvoicePayments=(id)=>{

    return http.get(`${configure}/Payment/GetInvoicePayments?InvoiceId=${id}`);

}
export const GetInvoicePaymentsForAdmin=(id)=>{

    return http.get(`${configure}/Payment/GetInvoicePayments?InvoiceId=${id}&IsAdmin=true`);

}
export const EditPaymentService=(PaymentData)=>
{
    return http.post(`${configure}/Payment/EditPayment`,JSON.stringify(PaymentData));
}

