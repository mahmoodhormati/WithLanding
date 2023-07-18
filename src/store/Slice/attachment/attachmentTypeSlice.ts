import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttachmentType } from "../../../Common/models/attachments";

const initialState: AttachmentType = {}

const attachmentTypeSlice = createSlice({

    name: 'AttachmnetType',
    initialState,
    reducers: {

        GetAttachmentType: (state, action: PayloadAction<AttachmentType>) => {


            return {
                ...action.payload
            }

        }

    }




})


export const { GetAttachmentType } = attachmentTypeSlice.actions
export default attachmentTypeSlice.reducer