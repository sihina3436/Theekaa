import React from "react";
import { TabView, PostStatus, GRADIENT } from "./postTypes";

interface PostsFilterBarProps {
  tabView: TabView;
  statusFilter: PostStatus | "All";
  deleteRequestCount: number;
  onTabChange: (t: TabView) => void;
  onFilterChange: (f: PostStatus | "All") => void;
}

const PostsFilterBar: React.FC<PostsFilterBarProps> = ({
  tabView, statusFilter, deleteRequestCount, onTabChange, onFilterChange,
}) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-md p-4 flex flex-wrap items-center gap-3">

    {/* ── Tabs ── */}
    <div className="flex gap-1 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-1">
      {(["all", "delete-requests"] as TabView[]).map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tabView === t
              ? `${GRADIENT} text-white shadow-sm shadow-purple-200`
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <i className={t === "all" ? "ri-layout-grid-line" : "ri-delete-bin-6-line"} />
          {t === "all" ? "All Posts" : "Delete Requests"}
          {t === "delete-requests" && deleteRequestCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {deleteRequestCount}
            </span>
          )}
        </button>
      ))}
    </div>

    {/* ── Status filters (only on All tab) ── */}
    {tabView === "all" && (
      <div className="flex gap-1.5 flex-wrap">
        {(["All", "Pending", "Approve", "Hold"] as (PostStatus | "All")[]).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              statusFilter === f
                ? `${GRADIENT} text-white border-transparent shadow-sm shadow-purple-200`
                : "bg-white text-gray-400 border-purple-100 hover:border-purple-300 hover:text-purple-500"
            }`}
          >
            {f === "Approve" ? "Approved" : f}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default PostsFilterBar;
