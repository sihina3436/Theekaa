import React from "react";
import { Post, PostStatus, STATUS_CONFIG, GRADIENT, GRADIENT_TEXT, userName } from "./postTypes";

interface PostCardProps {
  post: Post;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (id: string, status: PostStatus) => void;
  onDeleteRequest: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post, expanded, onToggleExpand, onStatusChange, onDeleteRequest,
}) => {
  const sc = STATUS_CONFIG[post.post_status];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-lg hover:shadow-purple-100/50 transition-shadow">

      {/* ── Image ── */}
      {post.image && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).parentElement!.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${sc.pill}`}>
              <i className={sc.icon} /> {sc.label}
            </span>
          </div>
        </div>
      )}

      {/* ── Card Header ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-[2px] rounded-full ${GRADIENT}`}>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <i className={`ri-user-line text-xs ${GRADIENT_TEXT}`} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">{userName(post.user_id)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {new Date(post.posted_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
        {!post.image && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${sc.pill}`}>
            <i className={sc.icon} /> {sc.label}
          </span>
        )}
      </div>

      {/* ── Snippet ── */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {post.other_details ?? "No details provided."}
        </p>
      </div>

      {/* ── Expanded Details ── */}
      {expanded && (
        <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-pink-50/60 via-purple-50/60 to-indigo-50/60 rounded-xl border border-purple-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Education", val: post.education,     icon: "ri-graduation-cap-line" },
              { label: "Location",  val: post.current_living, icon: "ri-map-pin-line"        },
              { label: "Likes",     val: String(post.likes),  icon: "ri-heart-line"          },
              post.delete_date
                ? { label: "Delete Req.", val: new Date(post.delete_date).toLocaleDateString(), icon: "ri-calendar-close-line" }
                : null,
            ].filter(Boolean).map((item: any) => (
              <div key={item.label} className="flex items-start gap-2">
                <i className={`${item.icon} text-purple-300 text-sm mt-0.5`} />
                <div>
                  <p className="text-[9px] text-purple-400 uppercase tracking-widest font-semibold">{item.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.val ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
          {post.other_details && (
            <div>
              <p className="text-[9px] text-purple-400 uppercase tracking-widest font-semibold mb-1">Full Details</p>
              <p className="text-xs text-gray-500 leading-relaxed">{post.other_details}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-purple-50 gap-2 flex-wrap">

        {/* Status buttons */}
        <div className="flex gap-1.5 flex-wrap">
          {(["Approve", "Hold", "Pending"] as PostStatus[]).map((st) => {
            const active = post.post_status === st;
            return (
              <button
                key={st}
                disabled={active}
                onClick={() => onStatusChange(post._id, st)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  active
                    ? "opacity-40 cursor-default bg-gray-50 text-gray-400 border border-gray-200"
                    : STATUS_CONFIG[st].btn
                }`}
              >
                <span className="flex items-center gap-1">
                  <i className={STATUS_CONFIG[st].icon} />
                  {st === "Approve" ? "Approve" : st}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expand + Delete */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={onToggleExpand}
            className="w-8 h-8 rounded-xl border border-purple-100 bg-purple-50 flex items-center justify-center text-purple-400 hover:bg-purple-100 transition-colors"
          >
            <i className={`${expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-base`} />
          </button>
          <button
            onClick={() => onDeleteRequest(post._id)}
            className="w-8 h-8 rounded-xl border border-red-100 bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
          >
            <i className="ri-delete-bin-6-line text-sm" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostCard;
