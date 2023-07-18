import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { SupportRequestMessages } from "../../../Common/models/supportRequestMessage";

const initialState:SupportRequestMessages=[]



const supportRequestMessageSlice=createSlice({

name:'supportRequestMessage',
initialState,
reducers:{



supportRequestMessage:(state,action:PayloadAction<SupportRequestMessages>)=>{



    return{...action.payload}

    
}


}





})

export const{supportRequestMessage}=supportRequestMessageSlice.actions
export default supportRequestMessageSlice.reducer