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
      providesTags:['Orders','AdminOrders']
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
      invalidatesTags:['Orders' ,'AdminOrders']
    }),
    orderDetails: builder.query({
      query: (id) => ({
       
        url: `/orders/${id}`,
         
      }),
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) =>
        `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
    }),
    getAdminOrders: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["AdminOrders"],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminOrders","Order"],

    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Order","AdminOrders"],
    }),
  }),
});

export const { useCreateNewOrderMutation,useUpdateOrderMutation,useDeleteOrderMutation,useGetAdminOrdersQuery ,useStripeCheckoutSessionMutation, useMyOrdersQuery ,useOrderDetailsQuery , useLazyGetDashboardSalesQuery} = orderApi;