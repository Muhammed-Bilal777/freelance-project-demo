import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" ,credentials:"include" , withCredentials: true,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
    }
  } ),
  tagTypes: ["Product", "AdminProducts"],
  mode: "cors",
headers: {
"Content-Type": "application/json",
},
prepareHeaders: (headers) => {
return headers;
},
  withCredentials: true,
   credentials: 'include',
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
      providesTags:['Product',"AdminProducts"]
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
       providesTags:["Product","AdminProducts"],
      invalidatesTags:["Product","AdminProducts"],
      credentials: 'include',
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
          credentials: 'include'
        };
      },
      invalidatesTags:["Product","AdminProducts"],
      credentials: 'include',
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts","Product"],
      credentials: 'include',
      withCredentials: true,
    }),
    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product", "AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product","AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    deleteProductImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/delete_image`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product","AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    getProductReviews: builder.query({
      query: (productId) => `/reviews?id=${productId}`,
      providesTags: ["Reviews"],
      invalidatesTags:["Product","AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
    deleteReview: builder.mutation({
      query({ productId, id }) {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Reviews","Product","AdminProducts"],
      credentials: 'include',
      withCredentials: true,
    }),
     
     
  }),
});

export const { useGetProductsQuery ,useGetProductDetailsQuery,useSubmitReviewMutation , useLazyGetProductReviewsQuery,
  useDeleteReviewMutation, useCanUserReviewQuery, useGetAdminProductsQuery,useDeleteProductMutation,useCreateProductMutation,useUpdateProductMutation, useUploadProductImagesMutation,useDeleteProductImageMutation, } = productApi;