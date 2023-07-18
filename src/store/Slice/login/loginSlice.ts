import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { LoginModelWithPass } from "../../../Common/models/loginModel";
import { decodeToken } from '../../../Utils/decodeToken';

const initialState :LoginModelWithPass={
 

}

const loginSlice=createSlice({

    name:'login',
    initialState,
    reducers:{

        loginWithPassword:(state , action:PayloadAction<LoginModelWithPass>)=>{

           return{
            ...action.payload


           }
          
            
           
        },
        logOutReducesr:()=>{

           return {}
        }
        
        






    }







})
export const {loginWithPassword,logOutReducesr}=loginSlice.actions
export default loginSlice.reducer