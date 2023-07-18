import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { shoppingCartItems } from "../../../Common/models/shoppingCart";


const initialState:shoppingCartItems=[]



const shoppingCartSlice=createSlice({


name:'shoppingCart',
initialState,
reducers:{


shoppingCart:(state,action:PayloadAction<shoppingCartItems>)=>{

return {...action.payload}


}

}

})

export const{shoppingCart}=shoppingCartSlice.actions
export default shoppingCartSlice.reducer