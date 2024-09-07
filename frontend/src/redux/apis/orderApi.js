import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes:['Orders'],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/orders/new",
          method: "POST",
          body,
        };
      },
      providesTags:['Orders']
    }),
    stripeCheckoutSession: builder.mutation({
      query(body) {
        return {
          url: "/payment/checkout_session",
          method: "POST",
          body,
        };
      },
    }),
    myOrders: builder.query({
      query: () => `/me/orders`,
      invalidatesTags:['Orders']
    }),
    orderDetails: builder.query({
      query: (id) => ({
       
        url: `/orders/${id}`,
         
      }),
    }),
  }),
});

export const { useCreateNewOrderMutation ,useStripeCheckoutSessionMutation, useMyOrdersQuery ,useOrderDetailsQuery} = orderApi;