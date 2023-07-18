import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";
import { Companies } from "../../../Common/models/companies";


const initialState:Companies=[]




const companySlice=createSlice({

    name:'Companies',
    initialState,
    reducers:{


      AllCompanies:(state,action:PayloadAction<Companies>)=>{


        return[...action.payload]

       }





    }
})



export const {AllCompanies} =companySlice.actions
export default companySlice.reducer