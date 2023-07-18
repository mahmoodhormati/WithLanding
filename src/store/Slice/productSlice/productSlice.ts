import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewProduct, ProductList } from '../../../Common/models/product'
const initialState: ProductList = []



const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {

        Products: (state, action: PayloadAction<ProductList>) => {
            return {
                ...action.payload,

            }
        },
    }
})
export const { Products } = productSlice.actions
export default productSlice.reducer