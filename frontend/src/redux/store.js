import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./apis/productApi";
import { authApi } from "./apis/authApi";
import { userApi } from "./apis/userApi";
import  userReducer from "../redux/features/userSlice"
 
import cartSlice from "./features/cartItems";
import { orderApi } from "./apis/orderApi";
 const store = configureStore({
  reducer: {
    auth : userReducer,
    cart : cartSlice.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]:authApi.reducer,
    [userApi.reducerPath]:userApi.reducer,
    [orderApi.reducerPath]:orderApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware , authApi.middleware,userApi.middleware ,orderApi.middleware]),
});

export default store;