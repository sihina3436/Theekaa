import React from "react";
import { useSelector } from "react-redux";
import {
  useGetPostByUserQuery,
  useRequestDeletePostMutation,
} from "../../../redux/post/postAPI";
import { useNavigate } from "react-router-dom";

const CurrentPost: React.FC = () => {

  const userId = useSelector((state: any) => state.user.user?._id);

  const { data: posts, isLoading, error } =
    useGetPostByUserQuery(userId, { skip: !userId });

  const [requestDeletePost] = useRequestDeletePostMutation();
  const navigate = useNavigate();

  const post = posts?.[0];

  if (isLoading) return (
    <div className="flex items-center justify-center py-10">
      <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold text-lg">
        Loading...
      </p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-10">
      <p className="text-red-400 font-medium">
        Error loading post
      </p>
    </div>
  );

  if (!post) return (
    <div className="flex items-center justify-center py-10">
      <p className="text-gray-400 font-medium">
        No post found
      </p>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Image */}
      <div className="p-[3px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg">
        <img
          src={post.image}
          alt="post"
          className="w-full h-72 object-cover rounded-2xl"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between">

        <div>

          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Current Post
          </h2>

          <div className="space-y-2 mb-4">

            <p className="text-gray-600">
              <strong className="text-gray-700">Education:</strong> {post.education}
            </p>

            <p className="text-gray-600">
              <strong className="text-gray-700">Living:</strong> {post.current_living}
            </p>

            <p className="text-gray-500 text-sm leading-relaxed">
              {post.other_details}
            </p>

          </div>

          <span className="px-4 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 rounded-full text-sm font-medium border border-purple-200">
            {post.post_status}
          </span>

        </div>

        <div className="flex gap-3 mt-6">

          <button
            className="flex-1 py-2.5 rounded-xl font-semibold text-white
            bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
            hover:opacity-90 transition shadow-md"
            onClick={() => navigate("/update-profile")}
          >
            Update
          </button>

          <div className="flex-1 p-[2px] rounded-xl bg-gradient-to-r from-red-400 to-pink-500">
            <button
              className="w-full py-2.5 rounded-[10px] font-semibold
              text-white bg-clip-text bg-gradient-to-r from-red-400 to-pink-500
              bg-white hover:bg-pink-50 transition"
              onClick={() => requestDeletePost(post._id)}
            >
              Delete
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CurrentPost;