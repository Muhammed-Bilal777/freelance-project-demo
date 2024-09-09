import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";
 
 

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4040/api/v1" ,credentials:'include',
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
    }
   }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query(body) {
        return {
          url: "/register",
          method: "POST",
          body,
        };
      },
      credentials:'include'
       
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: "/login",
          method: "POST",
          body,
        };
      },
      credentials:'include',
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => "/logout",
      credentials:'include',
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
           
        } catch (error) {
          console.log(error);
        }
      },
       
     
    }),
    
  }),
});

export const { useLoginMutation, useRegisterMutation  ,useLazyLogoutQuery  } =
  authApi;
