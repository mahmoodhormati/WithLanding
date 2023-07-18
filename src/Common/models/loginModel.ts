

export  interface LoginModel{

phoneNumber?:string,
password?:string

}
export  interface LoginModelWithPass{
  message?:string,
  success?: boolean,
  token?: string,
  refresh?: string
}

export interface Verify{
    
  verificationCode?: string,
  phoneNumber?: string
}


export interface LoginResponse{
    name?: string,
  token?: string,
  refresh?: string,
  requireInfo?: boolean
}

export interface RefreshToken{
    token?: string,
    refresh?: string
}