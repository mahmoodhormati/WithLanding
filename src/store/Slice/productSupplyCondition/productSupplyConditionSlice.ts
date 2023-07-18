import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ProductSupplyConidtions } from "../../../Common/models/productSupplyCondition";



const initialState:ProductSupplyConidtions=[]



const productSupplyConditionSlice=createSlice({

name:'productSPCondition',
initialState,reducers:{
SPConditions:(state,action:PayloadAction<ProductSupplyConidtions>)=>{


    return{
        ...action.payload
    }


}



}



})



export const{SPConditions}=productSupplyConditionSlice.actions
export default productSupplyConditionSlice.reducer