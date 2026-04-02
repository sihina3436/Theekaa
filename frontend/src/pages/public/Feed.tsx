import React, { useState } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { FiSearch, FiX, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetPostsQuery } from "../../redux/post/postAPI";
import FeedFilter, { FeedFilters } from "./FeedFilter";
import { ageInRange } from "./nicUtils";

const EMPTY_FILTERS: FeedFilters = { district: "", ageRange: "", gender: "" };

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPostsQuery();
  const allPosts = data?.data || data || [];

  const [likedPosts,  setLikedPosts]  = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters,     setFilters]     = useState<FeedFilters>(EMPTY_FILTERS);

  const toggleLike = (id: string) =>
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ── Filter logic ── */
  const visiblePosts = allPosts.filter((item: any) => {
    const user = item.user_id;

    // 1. Only Approved posts
    if (item.post_status !== "Approve") return false;

    // 2. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const haystack = [
        user?.first_name, user?.last_name,
        user?.occupation,  user?.district,
        item.education,    item.current_living,
      ].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    
    if (filters.district) {
      const userDistrict = user?.district?.toLowerCase() || "";
      const postDistrict = item.current_living?.toLowerCase() || "";
      const filterValue = filters.district.toLowerCase();
      
      // Must match either user's district OR post's current_living
      if (userDistrict !== filterValue && postDistrict !== filterValue) {
        return false;
      }
    }

    // 4. Age — FIX: Use age from backend, handle null/undefined properly
    if (filters.ageRange) {
      const age = user?.age;
      // Only filter if age exists; if age is null/undefined, don't filter by age
      if (age !== null && age !== undefined) {
        if (!ageInRange(age, filters.ageRange)) return false;
      }
    }

    // 5. Gender
    if (filters.gender) {
      if (user?.gender?.toLowerCase() !== filters.gender.toLowerCase()) return false;
    }

    return true;
  });

  const hasActiveFilters =
    searchQuery.trim() || filters.district || filters.ageRange || filters.gender;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-fuchsia-200 border-t-fuchsia-500 animate-spin" />
          <p className="text-fuchsia-400 font-semibold text-sm tracking-wide animate-pulse">
            Loading profiles…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <p className="text-red-400 font-medium">Failed to load posts</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-28">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 flex flex-col">

        {/* Search bar */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 sm:px-5 py-3">
            <div
              className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5
                focus-within:border-fuchsia-400 focus-within:bg-white focus-within:shadow-md
                focus-within:shadow-fuchsia-100/60 transition-all duration-200"
            >
              <FiSearch className="text-fuchsia-400 shrink-0" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, occupation…"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-700
                  placeholder:text-gray-400 caret-fuchsia-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 p-0.5 rounded-full text-gray-400 hover:text-gray-600
                    hover:bg-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <FeedFilter
          filters={filters}
          onChange={setFilters}
          totalVisible={visiblePosts.length}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-lg font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500
            bg-clip-text text-transparent tracking-tight">
            Discover
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-200 to-transparent" />
          <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            {visiblePosts.length} profiles
          </span>
        </div>

        {/* Empty state */}
        {visiblePosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100
              flex items-center justify-center">
              <FiSearch className="text-violet-300" size={28} />
            </div>
            <p className="text-sm text-gray-400 font-medium">No profiles match your filters.</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setFilters(EMPTY_FILTERS); setSearchQuery(""); }}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-600 underline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((item: any) => {
            const user  = item.user_id;
            const liked = likedPosts[item._id];

            // ✅ FIX: Age comes directly from backend JSON — safely handle null/undefined
            const age = user?.age ?? null;

            // ✅ FIX: Format dateOfBirth nicely for display
            const dob = user?.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/post/${item._id}`)}
                className="cursor-pointer group relative bg-white rounded-[28px] overflow-hidden
                  shadow-sm hover:shadow-xl hover:shadow-fuchsia-200/40 hover:-translate-y-1.5
                  transition-all duration-300 border border-gray-100"
              >
                {/* ── Photo ── */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={item.image}
                    alt={user?.first_name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Marriage status pill — top left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide
                      bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                      {user?.marriage_status || "—"}
                    </span>
                  </div>

                  {/* Like button — top right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(item._id); }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border
                      transition-all duration-300
                      ${liked
                        ? "bg-rose-500 border-rose-400 shadow-lg shadow-rose-400/40"
                        : "bg-white/20 border-white/30 hover:bg-white/35"
                      }`}
                  >
                    {liked
                      ? <HiHeart className="text-white" size={16} />
                      : <HiOutlineHeart className="text-white" size={16} />
                    }
                  </button>

                  {/* ── Bottom overlay: name, age, DOB, location ── */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">

                    {/* Name + age */}
                    <h2 className="text-white font-bold text-xl leading-tight drop-shadow-sm">
                      {user?.first_name} {user?.last_name}
                      {age !== null && (
                        <span className="font-normal text-white/80">, {age}</span>
                      )}
                    </h2>

                    {/* Date of Birth */}
                    {dob && (
                      <p className="text-white/60 text-[11px] mt-0.5 drop-shadow-sm">
                        Born {dob}
                      </p>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-1 mt-1 text-white/75 text-xs drop-shadow-sm">
                      <FiMapPin size={10} />
                      <span>{user?.district || item.current_living || "—"}</span>
                    </div>

                  </div>
                </div>

                {/* ── Card footer ── */}
                <div className="px-4 py-3 flex items-center justify-between">

                  {/* Avatar + name + occupation */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-[1.5px] rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 shrink-0">
                      {user?.ProfilePicture ? (
                        <img
                          src={user.ProfilePicture}
                          alt={user?.first_name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-bold text-fuchsia-500">
                            {user?.first_name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                        <FiBriefcase size={9} />
                        <span>{user?.occupation || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Age badge */}
                  {age !== null && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full
                      bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-sm shrink-0">
                      {age} yrs
                    </span>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Feed;
