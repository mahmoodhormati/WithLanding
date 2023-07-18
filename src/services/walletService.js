import http from './httpService';

let configure=window.globalThis.site_url;

export const GetAllWallets=(url)=>{

    return http.get(`${configure}/Wallet/GetWallets`, url);
}



export const GetWalletHistories=(url)=>{

    return http.get(`${configure}/Wallet/GetWalletHistories`, url);
}