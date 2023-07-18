import {configureStore} from "@reduxjs/toolkit";
import companySlice from "./Slice/companies/companySlice";
import loginSlice from "./Slice/login/loginSlice";
import productReducer from "./Slice/productSlice/productSlice"
import userRoleSlice from "./Slice/user/userRole/userRoleSlice";
import UserSlice from "./Slice/user/userSlice";
import PaymentSlice from "./Slice/PaymentMethods/PaymentMethods";
import AttributeSlice from "./Slice/Attribute/AttributeSlice";
export const  store = configureStore({
    reducer:{
        product: productReducer,
        user:UserSlice,
        login:loginSlice,
        roles:userRoleSlice,
        payment:PaymentSlice,
        companies:companySlice,
        attribute : AttributeSlice
    }
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch