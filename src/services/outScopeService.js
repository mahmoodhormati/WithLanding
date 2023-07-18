import http from './httpService';

let configure=window.globalThis.site_url;


export const GetBazargahKharidList=(startDate,endDate)=>{

    return http.get(`${configure}/OutScope/GetBazargahKharidList?StartDate=${startDate}&EndDate=${endDate}`);
}
export const GetBazargahKharidListWithCompany=(startDate,endDate,companyId)=>{

    return http.get(`${configure}/OutScope/GetBazargahKharidList?StartDate=${startDate}&EndDate=${endDate}&CompanyId=${companyId}`);
}


export const UpdateShippingReport=()=>{

    return http.post(`${configure}/OutScope/UpdateShippingReports`,JSON.stringify({}));
}

export const SyncShippingReports=(body)=>{

    return http.get(`${configure}/OutScope/SyncShippingReports`,body);
}

export const SyncShippingsWithBazargah=(body)=>{

    return http.post(`${configure}/OutScope/SyncShippingsWithBazargah`,JSON.stringify(body));
}


export const FintotechCheck=(body)=>{

    return http.post(`${configure}/OutScope/FinotechVerification`,JSON.stringify(body));
}

export const GetAddressWithPostalCode=(postalcode)=>{

    return http.get(`${configure}/OutScope/GetAddressWithPostalCode?PostalCode=${postalcode} `);
}


export const NotifyShippingCompany=(body)=>{

    return http.post(`${configure}/OutScope/NotifyShippingCompany`,JSON.stringify(body));
}