import React, { useState } from "react";
import { OfferBannerCard, ReviewBannerCard, SlideBannerCard } from "./BannerCards";
import BannerListSection from "./BannerListSection";
import { GRADIENT, GRADIENT_TEXT } from "./bannerTheme";
import "remixicon/fonts/remixicon.css";

const ManageWebsite: React.FC = () => {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-2xl ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          <i className={`${toast.type === "success" ? "ri-checkbox-circle-line" : "ri-close-circle-line"} text-base`} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className={`p-[2px] rounded-2xl ${GRADIENT} shadow-lg`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`p-[2px] rounded-xl ${GRADIENT}`}>
                <div className="bg-white rounded-[10px] p-2">
                  <i className={`ri-layout-masonry-line text-xl ${GRADIENT_TEXT}`} />
                </div>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${GRADIENT_TEXT}`}>Manage Website</h2>
                <p className="text-xs text-gray-400 mt-0.5">Upload images and create banners — powered by Cloudinary</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-indigo-50 border border-purple-100 rounded-xl text-xs font-semibold text-purple-500">
              <i className="ri-cloud-line" /> Cloudinary
            </div>
          </div>
        </div>

        {/* ── Info Strip ── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-md px-5 py-3.5 flex flex-wrap items-center gap-3">
          {[
            { icon: "ri-gift-line",      label: "Offer Banner",  pill: "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 border border-orange-200" },
            { icon: "ri-star-line",      label: "Review Banner", pill: "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-500 border border-indigo-200"   },
            { icon: "ri-slideshow-line", label: "Slide Banner",  pill: "bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-600 border border-emerald-200" },
          ].map(({ icon, label, pill }) => (
            <div key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${pill}`}>
              <i className={icon} /> {label}
            </div>
          ))}
          <p className="text-xs text-gray-400 ml-auto flex items-center gap-1">
            <i className="ri-upload-cloud-2-line text-purple-300" />
            Upload → Cloudinary → Save banner
          </p>
        </div>

        {/* ── Create Banner Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <OfferBannerCard  onSuccess={(m) => showToast(m, "success")} onError={(m) => showToast(m, "error")} />
          <ReviewBannerCard onSuccess={(m) => showToast(m, "success")} onError={(m) => showToast(m, "error")} />
          <SlideBannerCard  onSuccess={(m) => showToast(m, "success")} onError={(m) => showToast(m, "error")} />
        </div>

        {/* ── Current Banners List ── */}
        <BannerListSection onToast={showToast} />

      </div>
    </div>
  );
};

export default ManageWebsite;
