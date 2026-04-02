// components/chatRequests/SendRequest.tsx
import React, { useState } from "react";
import {
  useGetSentRequestsQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../../../redux/chatRequests/chatApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const statusBadge: Record<string, string> = {
  pending:  "text-amber-600 bg-amber-50 border border-amber-200",
  accepted: "text-emerald-600 bg-emerald-50 border border-emerald-200",
  rejected: "text-red-400 bg-red-50 border border-red-200",
  blocked:  "text-gray-500 bg-gray-100 border border-gray-200",
};

const Spinner = () => (
  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

const BlockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
  </svg>
);

const UnblockIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);

const SendRequest: React.FC = () => {
  const currentUserId = useSelector((state: any) => state.user.user?._id);
  const { data, isLoading, isError, refetch } = useGetSentRequestsQuery(currentUserId, { skip: !currentUserId });
  const [blockUser]   = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setIdLoading = (id: string, on: boolean) =>
    setLoadingIds((prev) => { const next = new Set(prev); on ? next.add(id) : next.delete(id); return next; });

  const handleBlock = async (receiverId: string, reqId: string) => {
    setIdLoading(reqId, true);
    try {
      await blockUser({ blockerId: currentUserId, blockedId: receiverId }).unwrap();
      showToast("User blocked");
      refetch();
    } catch { showToast("Failed to block", "error"); }
    finally { setIdLoading(reqId, false); }
  };

  const handleUnblock = async (receiverId: string, reqId: string) => {
    setIdLoading(reqId, true);
    try {
      await unblockUser({ unblockerId: currentUserId, unblockedId: receiverId }).unwrap();
      showToast("User unblocked");
      refetch();
    } catch { showToast("Failed to unblock", "error"); }
    finally { setIdLoading(reqId, false); }
  };

  const handleOpenChat = (receiver: any) => {
    const params = new URLSearchParams({
      with: receiver._id,
      name: `${receiver.first_name} ${receiver.last_name}`,
      ...(receiver.ProfilePicture ? { avatar: receiver.ProfilePicture } : {}),
    });
    navigate(`/chat?${params.toString()}`);
  };

  if (isLoading) return (
    <div className="flex justify-center py-10">
      <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold animate-pulse">Loading...</p>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <p className="text-red-400 text-sm">Failed to load sent requests.</p>
      <button onClick={refetch} className="text-xs text-indigo-500 underline">Try again</button>
    </div>
  );

  if (!data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-3">📤</div>
      <p className="text-gray-400 text-sm">No sent requests yet</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-xl shadow-lg z-50 text-white text-sm font-medium
          ${toast.type === "success" ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}

      {data.map((req: any) => {
        const receiver = req.receiverId;
        const isBusy   = loadingIds.has(req._id);
        const badge    = statusBadge[req.status] ?? statusBadge.pending;

        return (
          <div key={req._id}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-md p-4
              flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition">

            {/* RECEIVER INFO */}
            <div className="flex items-center gap-4">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <img src={receiver?.ProfilePicture || "/default-avatar.png"}
                  className="w-12 h-12 rounded-full object-cover bg-white" alt={receiver?.first_name} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{receiver?.first_name} {receiver?.last_name}</h3>
                <p className="text-sm text-gray-400">{receiver?.email}</p>
              </div>
            </div>

            {/* STATUS + ACTIONS */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${badge}`}>
                {req.status}
              </span>

              {/* ✅ accepted: Chat + Block */}
              {req.status === "accepted" && (
                <>
                  <button onClick={() => handleOpenChat(receiver)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                      hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition">
                    💬 Chat
                  </button>
                  <button onClick={() => handleBlock(receiver._id, req._id)} disabled={isBusy}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500
                      border border-gray-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50">
                    {isBusy ? <Spinner /> : <BlockIcon />} Block
                  </button>
                </>
              )}

              {/* ✅ blocked: Chat gone, Unblock shown */}
              {req.status === "blocked" && (
                <button onClick={() => handleUnblock(receiver._id, req._id)} disabled={isBusy}
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700
                    border border-indigo-200 hover:border-indigo-400 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50">
                  {isBusy ? <Spinner /> : <UnblockIcon />} Unblock
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SendRequest;
