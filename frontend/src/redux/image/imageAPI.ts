
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../utils/baseURL";

// Response type for uploaded images
interface UploadImageResponse {
  url: string;
  message: string;
}

export const imageAPI = createApi({
  reducerPath: "imageAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/images`,
    credentials: "include", 
  }),
  tagTypes: ["Images"], 
  endpoints: (builder) => ({
    uploadPostImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload-post-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"], 
    }),

    uploadProfileImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload-profile-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],
    }),
    uploadBannerImage:builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload-banner-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],
    }),
    uploadReviewImage:builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload-review-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],
    }),
    uploadSlideImage:builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload-slide-image",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],  
    }),
    getBanners: builder.query<string[], void>({
      query: () => "/banners",
      providesTags: ["Images"],
    }),
    deleteBanner: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/delete-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),
  }),
});

export const {
  useUploadPostImageMutation, //☑️
  useUploadProfileImageMutation,//☑️
  useUploadBannerImageMutation,//☑️
  useUploadReviewImageMutation,//☑️
  useUploadSlideImageMutation,//☑️
  useGetBannersQuery,//☑️
  useDeleteBannerMutation,//☑️
} = imageAPI;