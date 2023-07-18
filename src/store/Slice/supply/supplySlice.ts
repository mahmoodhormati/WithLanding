import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Supplies } from "../../../Common/models/supply";



const initialState:Supplies=[]




const supplySlice=createSlice({

name:'supply',initialState,
reducers:{

supplies:(stte,action:PayloadAction<Supplies>)=>{



    return{


        ...action.payload
    }

}



}





})

export const{supplies}=supplySlice.actions
export default supplySlice.reducer