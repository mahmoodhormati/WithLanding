import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attachments } from "../../../Common/models/attachments";

const initialState: Attachments = []


const attachmentSlice = createSlice({
    name: 'atachment',
    initialState,
    reducers: {

        GetAttachments: (state, action: PayloadAction<Attachments>) => {

            return {
                ...state, ...action.payload
            }


        }


    }



})

export const{GetAttachments}=attachmentSlice.actions
export default attachmentSlice.reducer