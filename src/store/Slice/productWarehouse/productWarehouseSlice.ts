import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ProductWareHouses } from "../../../Common/models/productWarehouse";

const initialState:ProductWareHouses=[]

const productWareHouseSlice=createSlice({

name:'productWarehouse',
initialState,reducers:{

AllProductWareHouse:(state,action:PayloadAction<ProductWareHouses>)=>{


return{

    ...action.payload
}



}




}




})

export const{AllProductWareHouse}=productWareHouseSlice.actions
export default productWareHouseSlice.reducer