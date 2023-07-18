import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { WareHouses } from "../../../Common/models/wareHouse";

const initialState:WareHouses=[]



const wareHouseSlice=createSlice({

name:'wareHouse',
initialState,
reducers:{



wareHouses:(state,action:PayloadAction<WareHouses>)=>{



    return{...action.payload}

    
}


}





})

export const{wareHouses}=wareHouseSlice.actions
export default wareHouseSlice.reducer