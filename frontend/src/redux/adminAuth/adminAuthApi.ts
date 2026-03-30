import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../utils/baseURL";


export const adminAuthAPI = createApi({
    reducerPath: "adminAuthAPI",
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${getBaseURL()}/api/admin`,
        credentials: "include", 
    }),
    endpoints: (builder) => ({
        LoginAdmin: builder.mutation({
            query: (credentials) => ({
                url: "/login-admin",
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
        }),
        getAdmin: builder.query({
            query: () => ({
                url: "/get-admin",
                method: "GET",
                credentials: "include",
            }),
        }),
        createAdmin: builder.mutation({
            query: (adminData) => ({
                url: "/create-admin",
                method: "POST",
                body: adminData,
                credentials: "include",
            }),
        }),
        addOfferBanner: builder.mutation({
            query: (bannerData) => ({
                url: "/offer-banner",
                method: "POST",
                body: bannerData,
                credentials: "include",
            }),
        }),

        reviewBanners: builder.mutation({
            query: (reviewData) => ({
                url: "/review-banner",
                method: "POST",
                body: reviewData,
                credentials: "include",
            }),
        }),
        addSlideBanner: builder.mutation({
            query: (slideData) => ({
                url: "/slide-banner",
                method: "POST",
                body: slideData,
                credentials: "include",
            }),
        }),

        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/forgot-password",
                method: "POST",
                body: { email },
                credentials: "include",
            }),
        }),

        resetPassword: builder.mutation({
            query: (resetData) => ({
                url: "/reset-password",
                method: "POST",
                body: resetData,
                credentials: "include",
            }),
        }),
        logoutAdmin: builder.mutation({
            query: () => ({
                url: "/logout-admin",
                method: "POST",
                credentials: "include",
            }),
        }),
    
        
    }),
});

export const { 
    useLoginAdminMutation,
    useGetAdminQuery, 
    useCreateAdminMutation, 
    useAddOfferBannerMutation, 
    useReviewBannersMutation,
    useAddSlideBannerMutation,
    useForgotPasswordMutation, 
    useResetPasswordMutation,
    useLogoutAdminMutation
} = adminAuthAPI;
export const adminAuthEndpoints = adminAuthAPI.endpoints;
  