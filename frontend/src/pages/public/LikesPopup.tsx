import React from "react";
import { FaTimes } from "react-icons/fa";

const LikesPopup: React.FC<{ visible: boolean; onClose: () => void; likedUsers: any[] }> = ({ visible, onClose, likedUsers }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">

      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl w-full sm:w-96 max-h-[80vh] overflow-hidden shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100">

          <h2 className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Liked By
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-500 transition"
          >
            <FaTimes size={18} />
          </button>

        </div>

        {/* Users List */}
        <ul className="p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-pink-50">

          {likedUsers.length === 0 && (
            <li className="text-gray-400 text-center py-4">
              No likes yet
            </li>
          )}

          {likedUsers.map((user: any) => (
            <li
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-indigo-50 transition cursor-pointer"
            >
              <div className="p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <img
                  src={user.ProfilePicture || "/default-avatar.png"}
                  alt={user.first_name}
                  className="w-10 h-10 rounded-full object-cover bg-white"
                />
              </div>

              <span className="text-gray-700 font-medium">
                {user.first_name} {user.last_name}
              </span>

            </li>
          ))}

        </ul>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-100">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
            text-white rounded-full py-2 font-medium hover:opacity-90 transition shadow-md"
          >
            Close
          </button>
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default LikesPopup;