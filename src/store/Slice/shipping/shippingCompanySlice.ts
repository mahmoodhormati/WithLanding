import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ShippingCompanies } from "../../../Common/models/shippingCompany";

const initialState:ShippingCompanies=[]


const shippingCompanySlice=createSlice({


    name:'shippingCompany',
    initialState,
    reducers:{


        AllshippingCompnay:(state,action:PayloadAction<ShippingCompanies>)=>{


            return{
                ...action.payload
            }
        }

    }





})


export const{AllshippingCompnay}=shippingCompanySlice.actions
export default shippingCompanySlice.reducer