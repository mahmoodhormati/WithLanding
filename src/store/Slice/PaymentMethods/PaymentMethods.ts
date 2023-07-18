import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: Array<number> = [

]

const PaymentSlice = createSlice({

    name: 'PaymentMethod',
    initialState,
    reducers: {

        PaymentMethod: (state, action: PayloadAction<[number]>) => {



            return (
                [

                    ...action.payload
                ])


        }
    

    }



})

export const { PaymentMethod } = PaymentSlice.actions
export default PaymentSlice.reducer