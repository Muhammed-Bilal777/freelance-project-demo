import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./apis/productApi";
import { authApi } from "./apis/authApi";
import { userApi } from "./apis/userApi";
import  userReducer from "../redux/features/userSlice"
 const store = configureStore({
  reducer: {
    auth : userReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]:authApi.reducer,
    [userApi.reducerPath]:userApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware , authApi.middleware,userApi.middleware ]),
});

export default store;