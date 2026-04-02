
import React, { useState } from "react";
import {
  useUpdateRequestStatusMutation,
  useGetReceivedRequestsQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../../../redux/chatRequests/chatApi";
import { useGetPostByUserIdQuery } from "../../../redux/post/postAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const ViewPostButton: React.FC<{ senderId: string }> = ({ senderId }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPostByUserIdQuery(senderId, {
    skip: !senderId,
  });

  
  const postId = data?.data?._id ?? data?._id ?? null;

  if (isLoading) {
    return (
      <button disabled
        className="flex items-center gap-1 text-xs text-gray-400 border border-gray-200
          px-2.5 py-1.5 rounded-lg opacity-60 cursor-not-allowed">
        <Spinner /> Post
      </button>
    );
  }

 
  if (isError || !postId) return null;

  return (
    <button
      onClick={() => navigate(`/post/${postId}`)}
      className="flex items-center gap-1 text-xs text-fuchsia-600 hover:text-fuchsia-800
        border border-fuchsia-200 hover:border-fuchsia-400 hover:bg-fuchsia-50
        px-2.5 py-1.5 rounded-lg transition"
    >
      <PostIcon /> View Post
    </button>
  );
};


const ReceivedRequest: React.FC = () => {
  const currentUserId = useSelector((state: any) => state.user.user?._id);
  const { data, isLoading, refetch } = useGetReceivedRequestsQuery(currentUserId, {
    skip: !currentUserId,
  });
  const [updateStatus] = useUpdateRequestStatusMutation();
  const [blockUser]    = useBlockUserMutation();
  const [unblockUser]  = useUnblockUserMutation();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setIdLoading = (id: string, on: boolean) =>
    setLoadingIds((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const handleAction = async (reqId: string, status: "accepted" | "rejected") => {
    setIdLoading(reqId, true);
    try {
      await updateStatus({ requestId: reqId, status }).unwrap();
      showToast(`Request ${status}`);
      refetch();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIdLoading(reqId, false);
    }
  };

  const handleBlock = async (otherUserId: string, reqId: string) => {
    setIdLoading(reqId, true);
    try {
      await blockUser({ blockerId: currentUserId, blockedId: otherUserId }).unwrap();
      showToast("User blocked");
      refetch();
    } catch {
      showToast("Failed to block", "error");
    } finally {
      setIdLoading(reqId, false);
    }
  };

  const handleUnblock = async (otherUserId: string, reqId: string) => {
    setIdLoading(reqId, true);
    try {
      await unblockUser({ unblockerId: currentUserId, unblockedId: otherUserId }).unwrap();
      showToast("User unblocked");
      refetch();
    } catch {
      showToast("Failed to unblock", "error");
    } finally {
      setIdLoading(reqId, false);
    }
  };

  const handleOpenChat = (sender: any) => {
    const params = new URLSearchParams({
      with: sender._id,
      name: `${sender.first_name} ${sender.last_name}`,
      ...(sender.ProfilePicture ? { avatar: sender.ProfilePicture } : {}),
    });
    navigate(`/chat?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-xl shadow-lg z-50 text-white text-sm font-medium
          ${toast.type === "success"
            ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {(!data || data.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-400 text-sm">No received requests</p>
        </div>
      )}

      {data?.map((req: any) => {
        const sender = req.senderId;
        const isBusy = loadingIds.has(req._id);

        return (
          <div key={req._id}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-md p-4
              flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition">

            {/* USER INFO */}
            <div className="flex items-center gap-4">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <img
                  src={sender?.ProfilePicture || "/default-avatar.png"}
                  className="w-12 h-12 rounded-full object-cover bg-white"
                  alt={sender?.first_name}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {sender?.first_name} {sender?.last_name}
                </h3>
                <p className="text-sm text-gray-400">{sender?.email}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 flex-wrap items-center">

              {/* ✅ View Post button — always visible for any status */}
              {sender?._id && <ViewPostButton senderId={sender._id} />}

              {req.status === "pending" && (
                <>
                  <button onClick={() => handleAction(req._id, "accepted")} disabled={isBusy}
                    className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-emerald-500
                      hover:opacity-90 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm
                      transition disabled:opacity-50">
                    ✓ Accept
                  </button>
                  <button onClick={() => handleAction(req._id, "rejected")} disabled={isBusy}
                    className="flex items-center gap-1 border border-red-300 text-red-500
                      hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50">
                    ✕ Reject
                  </button>
                </>
              )}

              {req.status === "accepted" && (
                <>
                  <button onClick={() => handleOpenChat(sender)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                      hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition">
                    💬 Chat
                  </button>
                  <button onClick={() => handleBlock(sender._id, req._id)} disabled={isBusy}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500
                      border border-gray-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50">
                    {isBusy ? <Spinner /> : <BlockIcon />} Block
                  </button>
                </>
              )}

              {req.status === "rejected" && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full
                  text-red-400 bg-red-50 border border-red-200">
                  Rejected
                </span>
              )}

              {req.status === "blocked" && (
                <>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full
                    text-gray-500 bg-gray-100 border border-gray-200">
                    Blocked
                  </span>
                  <button onClick={() => handleUnblock(sender._id, req._id)} disabled={isBusy}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700
                      border border-indigo-200 hover:border-indigo-400 px-2.5 py-1.5 rounded-lg
                      transition disabled:opacity-50">
                    {isBusy ? <Spinner /> : <UnblockIcon />} Unblock
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

const BlockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
  </svg>
);

const UnblockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);

const PostIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
);

export default ReceivedRequest;
