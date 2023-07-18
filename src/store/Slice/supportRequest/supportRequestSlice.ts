import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { SupportRequests } from "../../../Common/models/supportRequest";

const initialState:SupportRequests=[]



const supportRequestSlice=createSlice({

name:'supportRequest',
initialState,
reducers:{



supportRequest:(state,action:PayloadAction<SupportRequests>)=>{



    return{...action.payload}

    
}


}





})

export const{supportRequest}=supportRequestSlice.actions
export default supportRequestSlice.reducer