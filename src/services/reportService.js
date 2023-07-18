import http from "./httpService";

let configure=window.globalThis.site_url;

export const GetSimplifiedReports=()=>{

    return http.get(`${configure}/Report/GetSimplifiedReports`);
}
export const GetPeriodicSalesReport=(TypeId, PriceUnitId,Length)=>{

    return http.get(`${configure}/Report/GetPeriodicSalesReport?ScheduleTypeId=${TypeId}&PriceUnitId=${PriceUnitId}&Length=${Length}`);
}
export const GetShippingsReport=(TypeId ,Length )=>{

    return http.get(`${configure}/Report/GetShippingsReport?ScheduleTypeId=${TypeId}&Length=${Length}`);
}
export const GetPaymentsReport=(searchParams)=>{

    return http.get(`${configure}/Report/GetPaymentsReport` , searchParams);
}
export const GetScheduleJobsReport=()=>{

    return http.get(`${configure}/Report/GetScheduleJobsReport`);
}
export const GetShippingReportReports=(url)=>{

    return http.get(`${configure}/Report/GetShippingReportReports`,url);
}
export const GetUsedBarBariReportsCompanies=(url)=>{

    return http.get(`${configure}/Report/GetUsedBarBariReports`,url);
}
export const GetCustomersReports=(StartDate , EndDate)=>{

    return http.get(`${configure}/Report/GetCustomersReports?StartDate=${StartDate}&EndDate=${EndDate}`);
}
export const GetOrdersReports=(StartDate , EndDate)=>{

    return http.get(`${configure}/Report/GetOrdersReports?StartDate=${StartDate}&EndDate=${EndDate}`);
}
export const GetShippingReports=(searchParams)=>{

    return http.get(`${configure}/Report/ShippingReports`,searchParams);
}
export const GetnProceessAttachments=()=>{

    return http.get(`${configure}/Report/GetInProceessAttachments`);
}
export const  GetCustomerBrief = (CustomerId)=>{
    return http.get(`${configure}/Report/GetCustomerBrief?CustomerId=${CustomerId}`)
}
export const  GetCoutaggeBrief = (cottageCode)=>{
    return http.get(`${configure}/Report/GetCottageBrief?cottageCode=${cottageCode}`)
}

export const  GetUndecidedPayments = ()=>{
    return http.get(`${configure}/Report/GetUndecidedPayments`)
}
export const GetOrderSummary=(url)=>{

    return http.get(`${configure}/Report/GetOrderSummary`,url);



}

export const GetOngoingOrders=(url)=>{

    return http.get(`${configure}/Report/GetOngoingOrders`,url);

}


export const GetFinancialCardex=(url)=>{

    return http.get(`${configure}/Report/GetFinancialCardex`,url);

}


export const GetorderSunburst=(url)=>{

    return http.get(`${configure}/Report/GetOrderSunburst`,url);

}
export const GetCustomersDue=(url)=>{

    return http.get(`${configure}/Report/GetCustomersDue`,url);

}