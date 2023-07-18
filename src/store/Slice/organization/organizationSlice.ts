import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllOrganization } from "../../../Common/models/organization";


const initialState: AllOrganization = []


const organizationSlice = createSlice({

    name: 'organization',
    initialState,
    reducers: {

        Organizations: (state, action: PayloadAction<AllOrganization>) => {


            return {
                ...action.payload
            }




        }
    }


})


export const { Organizations } = organizationSlice.actions
export default organizationSlice.reducer
