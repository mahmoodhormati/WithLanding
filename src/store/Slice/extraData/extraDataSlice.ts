import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ExtraData } from "../../../Common/models/extraData";


const initialState:ExtraData={}


const extraDataSlice=createSlice({
name:'extraData',
initialState,reducers:{

extradata:(state,action:PayloadAction<ExtraData>)=>{

return {...action.payload}

}

}


})


export const{extradata}=extraDataSlice.actions
export default extraDataSlice.reducer