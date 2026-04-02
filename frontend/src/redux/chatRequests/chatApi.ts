
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../utils/baseURL";

export const chatAPI = createApi({
  reducerPath: "chatAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/chat`,
    credentials: "include",
  }),
  tagTypes: ["SentRequests", "ReceivedRequests"],
  endpoints: (builder) => ({

    makeRequest: builder.mutation({
      query: (requestData) => ({ url: "/request", method: "POST", body: requestData }),
      invalidatesTags: ["SentRequests"],
    }),

    getReceivedRequests: builder.query({
      query: (receiverId: string) => `/received/${receiverId}`,
      providesTags: ["ReceivedRequests"],
    }),

    getSentRequests: builder.query({
      query: (senderId: string) => `/sent/${senderId}`,
      providesTags: ["SentRequests"],
    }),

    updateRequestStatus: builder.mutation({
      query: ({ requestId, status }: { requestId: string; status: string }) => ({
        url: `/status/${requestId}`, method: "PATCH", body: { status },
      }),
      invalidatesTags: ["ReceivedRequests", "SentRequests"],
    }),

    blockUser: builder.mutation({
      query: ({ blockerId, blockedId }: { blockerId: string; blockedId: string }) => ({
        url: "/block-user", method: "POST", body: { blockerId, blockedId },
      }),
      invalidatesTags: ["ReceivedRequests", "SentRequests"],
    }),

    // ✅ New unblock mutation
    unblockUser: builder.mutation({
      query: ({ unblockerId, unblockedId }: { unblockerId: string; unblockedId: string }) => ({
        url: "/unblock-user", method: "POST", body: { unblockerId, unblockedId },
      }),
      invalidatesTags: ["ReceivedRequests", "SentRequests"],
    }),
  }),
});

export const {
  useMakeRequestMutation,
  useGetReceivedRequestsQuery,
  useGetSentRequestsQuery,
  useUpdateRequestStatusMutation,
  useBlockUserMutation,
  useUnblockUserMutation,  
} = chatAPI;
