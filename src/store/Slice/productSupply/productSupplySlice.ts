import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductSupplys } from "../../../Common/models/productSupply";


const initialState: ProductSupplys = []


const productSupplySlice = createSlice({


    name: 'ProductSupply',
    initialState,
    reducers: {



        AllProductSupply: (state, action: PayloadAction<ProductSupplys>) => {




            return { ...action.payload }

        }

    }


})
export const{AllProductSupply}=productSupplySlice.actions
export default productSupplySlice.reducer