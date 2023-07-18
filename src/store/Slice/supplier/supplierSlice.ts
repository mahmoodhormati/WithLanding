import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { suppliers } from "../../../Common/models/supplier";

const initialState:suppliers=[]

const suppliersSlice=createSlice({

    name:'suppliers',
    initialState,
    reducers:{

        Suppliers:(state,action:PayloadAction<suppliers>)=>{



            return{


                ...action.payload
            }
        }



    }





})