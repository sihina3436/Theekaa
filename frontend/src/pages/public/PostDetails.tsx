import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { FiUserPlus, FiCalendar, FiMapPin } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useGetPostByIdQuery } from "../../redux/post/postAPI";
import { useMakeRequestMutation } from "../../redux/chatRequests/chatApi";
import {
  useLikePostMutation,
  useGetPostLikesQuery,
} from "../../redux/postLike/postLikeAPI";

import LikesPopup from "./LikesPopup";

const PostDetails: React.FC = () => {
  const { id }    = useParams();
  const userId    = useSelector((state: any) => state.user.user?._id);

  const { data, isLoading, error } = useGetPostByIdQuery(id!, { skip: !id });
  const post       = data?.data || data;
  const receiverId = post?.user_id._id;
  const user       = post?.user_id;

  const [makeRequest] = useMakeRequestMutation();
  const [likePost]    = useLikePostMutation();

  const { data: likesData, refetch: refetchLikes } = useGetPostLikesQuery(
    post?._id,
    { skip: !post?._id }
  );

  const [liked,setLiked] = useState<boolean>(false);
  const [likes,setLikes] = useState<number>(0);
  const [showPopup,  setShowPopup]  = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (likesData) {
      setLiked(likesData.likedByUser);
      setLikes(likesData.totalLikes);
      setLikedUsers(likesData.likedUsers);
    }
  }, [likesData]);

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
      refetchLikes();
    } catch (err) {
      console.error("Failed to like post:", err);
      alert("Failed to like post");
    }
  };

  const makeChatRequest = async () => {
    try {
      await makeRequest({ senderId: userId, receiverId }).unwrap();
      alert("Chat request sent!");
    } catch (err) {
      console.error("Failed to send chat request:", err);
      alert("Failed to send chat request");
    }
  };

  
  const formattedDOB = user?.dateOfBirth
    ? (() => {
        try {
          return new Date(user.dateOfBirth).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch {
          return null;
        }
      })()
    : null;


  const age = user?.age ?? null;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-fuchsia-200 border-t-fuchsia-500 animate-spin" />
          <p className="text-fuchsia-400 font-semibold text-sm animate-pulse">Loading post…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <p className="text-red-400 font-medium">Failed to load post</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex justify-center items-center p-4 sm:p-6">

      <LikesPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        likedUsers={likedUsers}
      />

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden
        grid md:grid-cols-2 border border-gray-100">

        {/* ── Image Section ── */}
        <div className="relative group overflow-hidden">
          <img
            src={post.image}
            alt="post"
            className="w-full h-[420px] md:h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Three-dot menu */}
          <button className="absolute top-4 right-4 bg-white/70 backdrop-blur-md p-2 rounded-full shadow
            hover:bg-white transition-colors">
            <BsThreeDotsVertical size={18} />
          </button>

          {/* Marriage status badge */}
          {user?.marriage_status && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold
                bg-white/25 backdrop-blur-sm border border-white/40 text-white">
                {user.marriage_status}
              </span>
            </div>
          )}
        </div>

        {/* ── Details Section ── */}
        <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-full">

          <div>

            {/* ── User Info header ── */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 shrink-0">
                {user?.ProfilePicture ? (
                  <img
                    src={user.ProfilePicture}
                    alt={user?.first_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-violet-500
                      bg-clip-text text-transparent">
                      {user?.first_name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500
                  bg-clip-text text-transparent leading-tight">
                  {user?.first_name} {user?.last_name}
                  {age !== null && (
                    <span className="text-gray-400 font-normal text-xl">, {age}</span>
                  )}
                </h1>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
                  <FiMapPin size={12} />
                  <span>{user?.gender || "—"} · {user?.district || "—"}</span>
                </div>
              </div>
            </div>

            {/* ── Likes row ── */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition"
              >
                {liked
                  ? <HiHeart className="text-rose-500 text-2xl" />
                  : <HiOutlineHeart className="text-2xl" />
                }
                <span className="font-medium text-sm">{likes} Likes</span>
              </button>

              <button
                onClick={() => setShowPopup(true)}
                className="text-xs font-semibold text-fuchsia-500 hover:text-fuchsia-700 transition underline"
              >
                View Likes
              </button>
            </div>

            {/* ── Info Cards — includes Age and Date of Birth ── */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                {
                  label: "Age",
                  value: age !== null ? `${age} years old` : "—",
                  highlight: age !== null,
                },
                {
                  label: "Date of Birth",
                  value: formattedDOB || "—",
                  highlight: !!formattedDOB,
                  icon: <FiCalendar size={11} className="text-fuchsia-400" />,
                },
                { 
                  label: "Occupation",
                  value: user?.occupation || "—" ,
                  highlight: !!user?.occupation,
                },
                { 
                  label: "Income",
                  value: user?.income ? `Rs ${Number(user.income).toLocaleString()}` : "—" ,
                  highlight: !!user?.income,
                },
                { 
                  label: "Height",     
                  value: user?.height ? `${user.height} cm` : "—" ,
                  highlight: !!user?.height,
                },
                { 
                  label: "Weight",     
                  value: user?.weight ? `${user.weight} kg` : "—" ,
                  highlight: !!user?.weight,
                },

              ].map(({ label, value, highlight, icon }) => (
                <div
                  key={label}
                  className={`p-3.5 rounded-2xl border transition-all
                    ${highlight
                      ? "bg-gradient-to-br from-rose-50 to-fuchsia-50 border-fuchsia-100"
                      : "bg-gray-50 border-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {icon}
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                  <p className={`font-semibold text-sm leading-snug
                    ${highlight ? "text-fuchsia-700" : "text-gray-700"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Other Details ── */}
            <div className="space-y-4">

              {/* 🔹 2 Column Section */}
              <div className="grid grid-cols-2 gap-3">

                {post?.education && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">
                      Education
                    </p>
                    <p className="text-sm font-medium text-fuchsia-700 mt-1">
                      {post.education}
                    </p>
                  </div>
                )}

                {post?.current_living && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">
                      Current Living
                    </p>
                    <p className="text-sm font-medium text-fuchsia-700 mt-1">
                      {post.current_living}
                    </p>
                  </div>
                )}

              </div>

              {/* 🔹 About Section (Full Width) */}
              {post?.other_details && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-fuchsia-50 to-violet-50 border border-fuchsia-100 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-700 mb-1">
                    About
                  </p>
                  <p className="text-sm text-fuchsia-700 leading-relaxed">
                    {post.other_details}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3 mt-8">

            <div className="flex-1 p-[2px] rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500">
              <button
                onClick={handleLike}
                className="w-full bg-white text-white hover:bg-fuchsia-50 rounded-full py-3 font-semibold text-sm
                  bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent
                  transition-colors"
              >
                {liked ? "Unlike" : "Like"}
              </button>
            </div>

            <button
              onClick={makeChatRequest}
              className="flex-1 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500
                text-white rounded-full py-3 flex items-center justify-center gap-2
                font-semibold text-sm hover:opacity-90 transition shadow-md shadow-fuchsia-200"
            >
              <FiUserPlus size={16} />
              Send Request
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PostDetails;
