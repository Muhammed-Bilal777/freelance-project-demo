import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes : ["User"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => `/me`,
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false))
        } catch (error) {
          dispatch(setLoading(false))
          console.log(error);
        }
      },
      providesTags:['User'],
      invalidatesTags:['User'],
      selectId: (args, api, userId) => userId,
      keepUnusedDataFor: 0,
      refetchOnMount: true,
      refetch: true, 
    }),
    updateProfile : builder.mutation({
      query(body){
        return {
          url : "/me/update",
          method:"PUT",
          body
        }
      },
      invalidatesTags:['User']
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "/me/upload_avatar",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/me/password/update",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query({token,body}) {
        return {
          url: `/password/reset/${token}`,
          method: "PUT",
          body,
        };
      },
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
       credentials: 'include'
       
    }), 
  }),
  
});

export const { useGetMeQuery ,useUpdateProfileMutation,useUploadAvatarMutation,useUpdatePasswordMutation,useForgotPasswordMutation,useResetPasswordMutation,useCanUserReviewQuery } = userApi;