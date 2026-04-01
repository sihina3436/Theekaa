import React, { useState } from "react";
import {
  useGetPostsQuery,
  useUpdatePostStatusMutation,
  useGetAllDeleteRequestedPostsQuery,
  useDeletePostMutation,
} from "../../../redux/post/postAPI";
import { Post, PostStatus, TabView, GRADIENT, GRADIENT_TEXT } from "./postTypes";
import PostCard from "./PostCard";
import PostsFilterBar from "./PostsFilterBar";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EmptyState from "./EmptyState";
import "remixicon/fonts/remixicon.css";

const ManagePosts: React.FC = () => {
  const [tabView,setTabView] = useState<TabView>("all");
  const [statusFilter,setStatusFilter] = useState<PostStatus | "All">("All");
  const [confirmId,setConfirmId] = useState<string | null>(null);
  const [expandedId,setExpandedId] = useState<string | null>(null);
  const [toast,setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const { data: allPosts = [], isLoading: loadingAll, refetch } = useGetPostsQuery(undefined);
  const { data: drPosts = [], isLoading: loadingDR,  refetch: refetchDR } = useGetAllDeleteRequestedPostsQuery(undefined);
  const [updateStatus]  = useUpdatePostStatusMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (id: string, status: PostStatus) => {
    try {
      await updateStatus({ id, post_status: status }).unwrap();
      showToast(`Status updated to ${status}`, "success");
      refetch();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id).unwrap();
      showToast("Post permanently deleted", "success");
      refetch(); refetchDR();
    } catch {
      showToast("Failed to delete post", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const posts = (tabView === "all" ? allPosts : drPosts) as Post[];
  const filtered = posts.filter((p) => {
    if (tabView === "all" && p.post_status === "RequestDelete") return false;
    return statusFilter === "All" || p.post_status === statusFilter;
  });
  const loading  = loadingAll || loadingDR;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-2xl ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          <i className={`${toast.type === "success" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} text-base`} />
          {toast.msg}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirmId && (
        <DeleteConfirmModal
          isDeleting={isDeleting}
          onCancel={() => setConfirmId(null)}
          onConfirm={() => handleDelete(confirmId)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className={`p-[2px] rounded-2xl ${GRADIENT} shadow-lg`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`p-[2px] rounded-xl ${GRADIENT}`}>
                <div className="bg-white rounded-[10px] p-2">
                  <i className={`ri-newspaper-line text-xl ${GRADIENT_TEXT}`} />
                </div>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${GRADIENT_TEXT}`}>Manage Posts</h2>
                <p className="text-xs text-gray-400 mt-0.5">Approve, hold, delete posts and review delete requests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-indigo-50 border border-purple-100 rounded-xl text-xs font-semibold text-purple-500">
                <i className="ri-file-list-3-line" /> {filtered.length} posts
              </div>
              <button
                onClick={() => { refetch(); refetchDR(); }}
                className="w-9 h-9 rounded-xl border border-purple-100 bg-white flex items-center justify-center text-purple-400 hover:bg-purple-50 transition-colors shadow-sm"
              >
                <i className="ri-refresh-line text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <PostsFilterBar
          tabView={tabView}
          statusFilter={statusFilter}
          deleteRequestCount={drPosts.length}
          onTabChange={(t) => { setTabView(t); setStatusFilter("All"); }}
          onFilterChange={setStatusFilter}
        />

        {/* ── Posts Grid ── */}
        {loading ? (
          <EmptyState icon="ri-loader-4-line" msg="Loading posts…" spin />
        ) : filtered.length === 0 ? (
          <EmptyState icon="ri-file-search-line" msg="No posts found." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                expanded={expandedId === post._id}
                onToggleExpand={() => setExpandedId(expandedId === post._id ? null : post._id)}
                onStatusChange={handleStatusChange}
                onDeleteRequest={setConfirmId}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ManagePosts;
