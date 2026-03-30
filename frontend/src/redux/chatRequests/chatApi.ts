import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { getBaseURL } from '../../utils/baseURL';

export const chatAPI = createApi({
    reducerPath: 'chatAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseURL()}/api/chat`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        makeRequest: builder.mutation({
            query: (requestData) => ({
                url: "/request",
                method: "POST",
                body: requestData,
                credentials: "include",
            }),
        }),
        getReceivedRequests: builder.query({
            query: (receiverId) => ({
                url: `/received/${receiverId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getSentRequests: builder.query({    
            query: (senderId) => ({
                url: `/sent/${senderId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        updateRequestStatus: builder.mutation({
            query: ({ requestId, status }) => ({
                url: `/status/${requestId}`,
                method: "PATCH",
                body: { status },
                credentials: "include",
            }),
        }),
        blockUser: builder.mutation({
            query: (blockData) => ({
                url: "/block-user",
                method: "POST",
                body: blockData,
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useMakeRequestMutation,//☑️
    useGetReceivedRequestsQuery,//☑️
    useGetSentRequestsQuery,//☑️
    useUpdateRequestStatusMutation,//☑️
    useBlockUserMutation,
} = chatAPI;

