import http from './httpService';

let configure=window.globalThis.site_url;


export const SetPhoneBook=(phonebook)=>{

    return http.post(`${configure}/PhoneBook/SetPhoneBook`,JSON.stringify(phonebook));
} 


export const GetPhoneBook=(url)=>{

    return http.get(`${configure}/PhoneBook/GetPhoneBooks`,url);
}
