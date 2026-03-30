import React from "react";
import { useGetUserQuery } from "../../../redux/userAuth/userAuthAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ProfileDetails: React.FC = () => {

  const userId = useSelector((state: RootState) => state.user.user?._id);
  console.log("Current User ID:", userId);

  const { data: user, isLoading, error } = useGetUserQuery(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold text-lg animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-400 font-medium">
          Error loading profile
        </p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <div className="p-[2px] rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg">

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8">

            <div className="flex flex-col md:flex-row md:items-center gap-6">

              {/* Profile Image */}
              <div className="p-[3px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-md">
                <img
                  src={user?.ProfilePicture || "/default-avatar.png"}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover bg-white"
                />
              </div>

              {/* Profile Info */}
              <div>

                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  {user?.email}
                </h2>

                <p className="text-gray-500 mt-1">
                  {user?.occupation || "No occupation added"}
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-1 text-sm rounded-full font-medium
                  ${user?.status === "Pending"
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 border border-yellow-200"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200"
                    }`}
                >
                  {user?.status}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 md:p-8">

          <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-purple-100 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">

            {[
              ["NIC", user?.nic],
              ["Phone", user?.phone],
              ["District", user?.district],
              ["Gender", user?.gender],
              ["Height", user?.height ? user.height + " cm" : ""],
              ["Weight", user?.weight ? user.weight + " kg" : ""],
              ["Income", user?.income ? "Rs. " + user.income : ""],
              ["Occupation", user?.occupation],
              ["Marriage Status", user?.marriage_status],
            ].map(([label, value]) => (

              <div key={label} className="flex flex-col">

                <span className="text-sm text-gray-400">
                  {label}
                </span>

                <span className="text-base font-medium text-gray-700 mt-1">
                  {value || "Not provided"}
                </span>

                <div className="border-b border-purple-100 mt-3"></div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProfileDetails;