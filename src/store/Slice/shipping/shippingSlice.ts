import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Shippings } from "../../../Common/models/shipping";


const initialState:Shippings=[]


const shippingSlice=createSlice({

name:'shippings',
initialState,
reducers:{



Shipping:(state,action:PayloadAction<Shippings>)=>{

return{
    ...action.payload
}




}

}



})


export const{Shipping}=shippingSlice.actions
export default shippingSlice.reducer
