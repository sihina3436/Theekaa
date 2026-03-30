import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../utils/baseURL";


export const userAuthAPI = createApi({
    reducerPath: "userAuthAPI",
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${getBaseURL()}/api/users`,
        credentials: "include", 
    }),
    endpoints: (builder) => ({
        Signin: builder.mutation({
            query: (credentials) => ({
                url: "/sign-in",
                method: "POST",
                body: credentials,
                credentials: "include", 
            }),
        }),
        Signup: builder.mutation({
            query: (userData) => ({
                url: "/sign-up",
                method: "POST",
                body: userData,
                credentials: "include",
            }),

        }),
        getUser: builder.query({
            query: (id) => ({
                url: `/get-user/${id}`,
                method: "GET",
                credentials: "include",
           }),
       }),
       getAllUser: builder.query({
        query: () => ({
            url: `/get-all-users`,
            method: "GET",
            credentials: "include",
            }),
        }),
       UpdateProfile: builder.mutation({
        query: ({ id, ...profileData }) => ({
            url: `/update-profile/${id}`,
            method: "PUT",
            body: profileData,
            credentials: "include",
        }),
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
            url: `/forgot-password`,
            method: "POST",
            body: email,
            credentials: "include",
           }),
        }),
        resetPassword: builder.mutation({
        query: ({ email, otp, newPassword }) => ({
            url: `/reset-password`,
            method: "POST",
            body: { email, otp, newPassword },
            credentials: "include",
            }),   
        }),
        deleteUserById: builder.mutation({
            query: (id) => ({
                url: `/delete-user/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        addProfilePicture: builder.mutation({
            query: ({profilePictureUrl}) => ({
                url: `/add-profile-picture`,
                method: "POST",
                body: { profilePictureUrl },
                credentials: "include",
            }),
        }),
        removeProfilePicture: builder.mutation({
            query: () => ({
                url: `/remove-profile-picture`,
                method: "PUT",
                credentials: "include",
            }),
        }),
        updateProfilePicture: builder.mutation({
            query: ({ profilePictureUrl }) => ({
                url: `/update-profile-picture`,
                method: "PUT",
                body: { profilePictureUrl },
                credentials: "include",
        }),
        }),
        updateUserProfileStatus: builder.mutation({
            query: ({ userId, status }) => ({
                url: `/update-profile-status`,
                method: "PUT",
                body: { userId, status },
                credentials: "include",
            }),
        }),
        
    }),
});

export const { 
    useSigninMutation, //☑️
    useSignupMutation, //☑️
    useGetUserQuery, //☑️
    useGetAllUserQuery, 
    useUpdateProfileMutation,//☑️
    useForgotPasswordMutation,//☑️
    useResetPasswordMutation,
    useDeleteUserByIdMutation,
    useAddProfilePictureMutation,//☑️
    useRemoveProfilePictureMutation,
    useUpdateProfilePictureMutation,//☑️
    useUpdateUserProfileStatusMutation,
} = userAuthAPI;

