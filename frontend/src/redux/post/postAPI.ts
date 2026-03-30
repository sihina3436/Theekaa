import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { getBaseURL } from '../../utils/baseURL';


export const postAPI = createApi({
    reducerPath: 'postAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseURL()}/api/posts`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (postData) => ({
                url: "/create-post",
                method: "POST",
                body: postData,
                credentials: "include",
            }),
        }),
        getPosts: builder.query({
            query: () => ({
                url: "/get-posts",
                method: "GET",
                credentials: "include",
            }),
        }),
        getPostById: builder.query({
            query: (id) => ({
                url: `/get-post/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        updatePostStatus: builder.mutation({
            query: ({ id, post_status }) => ({
                url: `/status/${id}`,   
                method: "PUT",
                body: { post_status }, 
                credentials: "include",
            }),
        }),
        requestDeletePost: builder.mutation({
            query: (id) => ({
                url: `/request-delete/${id}`,
                method: "POST",
                credentials: "include",
            }),
        }),
        getAllDeleteRequestedPosts: builder.query({
            query: () => ({
                url: "/delete-requests",
                method: "GET",
                credentials: "include",
            }),
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/delete-post/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        editPost: builder.mutation({
            query: ({id, postData}) => ({
                url: `/edit-post/${id}`,
                method: "PUT",
                body: postData,
                credentials: "include",
            }),
        }),
        getPostByUser: builder.query({
            query: (id) => ({
                url: `/user-posts/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useCreatePostMutation,
    useGetPostsQuery,
    useGetPostByIdQuery,
    useUpdatePostStatusMutation,
    useRequestDeletePostMutation,
    useGetAllDeleteRequestedPostsQuery,
    useDeletePostMutation,
    useEditPostMutation,
    useGetPostByUserQuery
} = postAPI;

