import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewUser } from "../../../Common/models/user";

const initialState: NewUser = {





}
const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<NewUser>) => {




            return { ...action.payload }
        },
        userDelete: () => {
            return {}
        }




    }
})
export const { addUser, userDelete } = UserSlice.actions
export default UserSlice.reducer