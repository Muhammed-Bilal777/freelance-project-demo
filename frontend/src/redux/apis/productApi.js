import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4040/api/v1" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: `/products`,
        params:{
          page : params?.page,
          keyword : params?.keyword,
          "price[gte]" : params?.max,
          "price[lte]" : params?.min,
          category : params.category,
          "ratings[gte]":params.ratings

        }
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
    }) 
  }),
});

export const { useGetProductsQuery ,useGetProductDetailsQuery } = productApi;