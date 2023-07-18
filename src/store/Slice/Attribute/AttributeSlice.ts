import { ActionCreatorWithPayload, createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  Attributes } from "../../../Common/models/attribute";

const initialState: Attributes = []


const attributSelice = createSlice({
    name: 'atteibute',
    initialState,
    reducers: {

        SetAttribute: (state, action) => {

            const newItem = action.payload;
            state.push({
               
                name: newItem.name,
                entityTypeId : newItem.entityTypeId,
                controlTypeId : newItem.controlTypeId,
                controlTypeValue:newItem.controlTypeValue
               
            });


        }


    }



})

export const AttributeAction =attributSelice.actions
export const attrReducer = attributSelice.reducer;

export default attributSelice.reducer