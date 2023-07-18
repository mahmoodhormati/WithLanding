import { AES, enc } from 'crypto-js';


export const decryptStirng = (string) => {
    let bytes;

    
      bytes = AES.decrypt(string,'test key');
     let decrypt=JSON.parse(bytes.toString(enc.Utf8))

      return ( decrypt);
  
  };



  export const encryptMessage=(string)=>{
let data=AES.encrypt(JSON.stringify(string),'test key').toString()

    return( data)
  }