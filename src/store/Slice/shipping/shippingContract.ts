import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ShippingContracts } from "../../../Common/models/shippingContract";

const initialState:ShippingContracts=[]



const shippingContarctSlice=createSlice({

name:'shippingContract',
initialState,
reducers:{


AllShippingContract:(state,action:PayloadAction<ShippingContracts>)=>{


    return{
        ...action.payload
    }


}

}




})


export const{AllShippingContract}=shippingContarctSlice.actions
export default shippingContarctSlice.reducer