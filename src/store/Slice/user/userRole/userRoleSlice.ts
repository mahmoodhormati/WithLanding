import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: Array<number> = [

]

const roleSlice = createSlice({

    name: 'userRole',
    initialState,
    reducers: {

        userRoles: (state, action: PayloadAction<[number]>) => {



            return (
                [

                    ...action.payload
                ])


        },
        removeRole: () => {
            return []
        }

    }



})

export const { userRoles, removeRole } = roleSlice.actions
export default roleSlice.reducer