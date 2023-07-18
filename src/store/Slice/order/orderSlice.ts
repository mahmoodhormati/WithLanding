import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Orders } from "../../../Common/models/order";

const initialState:Orders=[]



const OrderSlice=createSlice({

name:'orders',
initialState,
reducers:{



AllOrders:(state,action:PayloadAction<Orders>)=>{



    return{...action.payload}

    
}


}





})

export const{AllOrders}=OrderSlice.actions
export default OrderSlice.reducer