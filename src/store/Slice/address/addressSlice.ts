import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../../../Common/models/address";
import { Addresses } from './../../../Common/models/address';

const initialState: Address = {}




const companySlice = createSlice({

    name: 'Address',
    initialState,
    reducers: {


        AddAddress: (state, action: PayloadAction<Address>) => {


            return { ...action.payload }

        },
        getAddress: (state, action: PayloadAction<Addresses>) => {


            return { ...state, ...action.payload }




        }





    }
})



export const { AddAddress } = companySlice.actions
export default companySlice.reducer