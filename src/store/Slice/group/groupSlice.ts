import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, GroupList } from "../../../Common/models/group";

const initialState: GroupList=[]



const groupSlice = createSlice({

    name: 'groups',
    initialState,
    reducers: {
      
        getGroups: (state, action: PayloadAction<GroupList>) => {

           return{...state,...action.payload}

        }






    }

})


export const{getGroups}=groupSlice.actions
export default groupSlice.reducer