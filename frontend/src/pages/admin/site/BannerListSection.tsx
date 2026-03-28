import React, { useState } from "react";
import { useGetBannersQuery, useDeleteBannerMutation } from "../../../redux/image/imageAPI";
import { Banner, BannerType, BANNER_TYPE_CONFIG } from "./bannerListTypes";
import "remixicon/fonts/remixicon.css";

const GRADIENT      = "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500";
const GRADIENT_TEXT = `${GRADIENT} bg-clip-text text-transparent`;

/* ── Delete Confirm Modal ── */
const DeleteModal = ({
  banner,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  banner: Banner;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
      {/* Icon */}
      <div className={`p-[2px] rounded-full ${GRADIENT} w-16 h-16 mx-auto mb-4`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <i className={`ri-delete-bin-6-line text-2xl ${GRADIENT_TEXT}`} />
        </div>
      </div>
      {/* Banner preview */}
      <div className="h-24 rounded-xl overflow-hidden mb-4 border border-purple-100">
        <img src={banner.bannerImageUrl} alt={banner.bannerTitle} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1">Delete "{banner.bannerTitle}"?</h3>
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        This banner will be permanently removed and cannot be recovered.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-purple-100 text-gray-500 text-xs font-semibold hover:bg-purple-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className={`px-5 py-2.5 rounded-xl ${GRADIENT} text-white text-xs font-bold disabled:opacity-60 flex items-center gap-2 shadow-md shadow-purple-200`}
        >
          {isDeleting
            ? <><i className="ri-loader-4-line animate-spin" /> Deleting…</>
            : <><i className="ri-delete-bin-6-line" /> Delete</>}
        </button>
      </div>
    </div>
  </div>
);

/* ── Single Banner Row ── */
const BannerRow = ({
  banner,
  onDeleteClick,
}: {
  banner: Banner;
  onDeleteClick: (b: Banner) => void;
}) => {
  const cfg = BANNER_TYPE_CONFIG[banner.type];
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50/40 transition-colors group">
      {/* Thumbnail */}
      <div className="w-16 h-12 rounded-lg overflow-hidden border border-purple-100 shrink-0 bg-gray-50">
        <img
          src={banner.bannerImageUrl}
          alt={banner.bannerTitle}
          className="w-full h-full object-cover"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 truncate">{banner.bannerTitle}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 font-mono truncate">{banner.bannerImageUrl}</p>
        <p className="text-[10px] text-gray-300 mt-0.5">
          {new Date(banner.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Type pill */}
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${cfg.pill}`}>
        <i className={cfg.icon} /> {cfg.label}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onDeleteClick(banner)}
        className="w-8 h-8 rounded-xl border border-red-100 bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
      >
        <i className="ri-delete-bin-6-line text-sm" />
      </button>
    </div>
  );
};

/* ── Banner Group (per type) ── */
const BannerGroup = ({
  type,
  banners,
  onDeleteClick,
}: {
  type: BannerType;
  banners: Banner[];
  onDeleteClick: (b: Banner) => void;
}) => {
  const cfg = BANNER_TYPE_CONFIG[type];
  if (banners.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-md">
      {/* Group header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50">
        <div className="flex items-center gap-3">
          <div className={`p-[2px] rounded-xl ${GRADIENT}`}>
            <div className="bg-white rounded-[10px] p-2">
              <i className={`${cfg.icon} text-lg ${GRADIENT_TEXT}`} />
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-bold ${GRADIENT_TEXT}`}>{cfg.label} Banners</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{banners.length} banner{banners.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${cfg.pill}`}>
          <i className={cfg.icon} /> {type}
        </span>
      </div>

      {/* Banner rows */}
      <div className="px-3 py-2 divide-y divide-purple-50/60">
        {banners.map((b) => (
          <BannerRow key={b._id} banner={b} onDeleteClick={onDeleteClick} />
        ))}
      </div>
    </div>
  );
};

/* ── Empty State ── */
const EmptyState = ({ spin }: { spin?: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-md gap-4">
    <div className={`p-[2px] rounded-full ${GRADIENT} opacity-40`}>
      <div className="bg-white rounded-full p-4">
        <i className={`ri-image-2-line text-3xl ${GRADIENT_TEXT} ${spin ? "animate-spin" : ""}`} />
      </div>
    </div>
    <p className="text-sm text-gray-400">{spin ? "Loading banners…" : "No banners yet."}</p>
  </div>
);

/* ════════════════════════════════════════════
   MAIN EXPORT — BannerListSection
   ════════════════════════════════════════════ */
interface BannerListSectionProps {
  onToast: (msg: string, type: "success" | "error") => void;
}

const BannerListSection: React.FC<BannerListSectionProps> = ({ onToast }) => {
  const { data, isLoading, refetch } = useGetBannersQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [confirmBanner, setConfirmBanner] = useState<Banner | null>(null);

  const banners: Banner[] = (data as any)?.banners ?? [];

  const grouped = {
    offer:  banners.filter((b) => b.type === "offer"),
    review: banners.filter((b) => b.type === "review"),
    slide:  banners.filter((b) => b.type === "slide"),
  };

  const handleDelete = async () => {
    if (!confirmBanner) return;
    try {
      await deleteBanner(confirmBanner._id).unwrap();
      onToast("Banner deleted successfully", "success");
      refetch();
    } catch {
      onToast("Failed to delete banner", "error");
    } finally {
      setConfirmBanner(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Section Header ── */}
      <div className={`p-[2px] rounded-2xl ${GRADIENT} shadow-lg`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`p-[2px] rounded-xl ${GRADIENT}`}>
              <div className="bg-white rounded-[10px] p-2">
                <i className={`ri-image-2-line text-xl ${GRADIENT_TEXT}`} />
              </div>
            </div>
            <div>
              <h2 className={`text-xl font-bold ${GRADIENT_TEXT}`}>Current Banners</h2>
              <p className="text-xs text-gray-400 mt-0.5">All active banners grouped by type</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-indigo-50 border border-purple-100 rounded-xl text-xs font-semibold text-purple-500">
              <i className="ri-stack-line" /> {banners.length} total
            </div>
            <button
              onClick={() => refetch()}
              className="w-9 h-9 rounded-xl border border-purple-100 bg-white flex items-center justify-center text-purple-400 hover:bg-purple-50 transition-colors shadow-sm"
            >
              <i className="ri-refresh-line text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <EmptyState spin />
      ) : banners.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {(["offer", "review", "slide"] as BannerType[]).map((type) => (
            <BannerGroup
              key={type}
              type={type}
              banners={grouped[type]}
              onDeleteClick={setConfirmBanner}
            />
          ))}
        </div>
      )}

      {/* ── Delete Modal ── */}
      {confirmBanner && (
        <DeleteModal
          banner={confirmBanner}
          isDeleting={isDeleting}
          onCancel={() => setConfirmBanner(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default BannerListSection;
