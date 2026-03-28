import React from "react";
import { GRADIENT, GRADIENT_TEXT } from "./bannerTheme";

export interface BannerCardProps {
  type: string;
  label: string;
  icon: string;
  accentPill: string;
  bannerTitle: string;
  setBannerTitle: (v: string) => void;
  imagePreview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onRemove: () => void;
}

const BannerCard: React.FC<BannerCardProps> = ({
  type, label, icon, accentPill,
  bannerTitle, setBannerTitle,
  imagePreview, uploadedUrl,
  isUploading, isSubmitting,
  fileInputRef, handleImageChange, handleSubmit, onRemove,
}) => {
  const isBusy = isUploading || isSubmitting;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-purple-100/50 transition-shadow flex flex-col">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50">
        <div className="flex items-center gap-3">
          <div className={`p-[2px] rounded-xl ${GRADIENT}`}>
            <div className="bg-white rounded-[10px] p-2">
              <i className={`${icon} text-lg ${GRADIENT_TEXT}`} />
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-bold ${GRADIENT_TEXT}`}>{label}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Upload image then add a title</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${accentPill}`}>
          <i className={icon} /> {type}
        </span>
      </div>

      {/* ── Upload Zone ── */}
      <div className="px-5 pt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {imagePreview ? (
          <div className="relative h-40 rounded-xl overflow-hidden border border-purple-100 bg-gray-50">
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-2 left-3">
              {isUploading ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-purple-500">
                  <i className="ri-loader-4-line animate-spin" /> Uploading…
                </span>
              ) : uploadedUrl ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                  <i className="ri-checkbox-circle-line" /> Ready
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
            >
              <i className="ri-close-line text-xs" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-40 rounded-xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-pink-50/40 via-purple-50/40 to-indigo-50/40 hover:border-purple-300 hover:bg-purple-50/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none"
          >
            <div className={`p-[2px] rounded-full ${GRADIENT} opacity-50`}>
              <div className="bg-white rounded-full p-2.5">
                <i className="ri-upload-cloud-2-line text-xl text-purple-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-purple-400">Click to upload image</p>
              <p className="text-[10px] text-gray-300 mt-0.5">PNG, JPG, WEBP · max 5 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="px-5 py-4 flex-1 flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5 block">
            Banner Title
          </label>
          <div className="relative">
            <i className="ri-text absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 text-sm" />
            <input
              type="text"
              placeholder="Enter banner title…"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              className="w-full bg-gradient-to-r from-pink-50/50 via-purple-50/50 to-indigo-50/50 border border-purple-100 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-700 placeholder-gray-300 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        {uploadedUrl && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <i className="ri-cloud-line text-emerald-400 text-sm shrink-0" />
            <p className="text-[10px] text-emerald-600 font-mono truncate">{uploadedUrl}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isBusy || !uploadedUrl}
          className={`w-full py-2.5 rounded-xl ${GRADIENT} text-white text-xs font-bold shadow-md shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity mt-auto`}
        >
          {isSubmitting ? (
            <><i className="ri-loader-4-line animate-spin" /> Creating…</>
          ) : isUploading ? (
            <><i className="ri-loader-4-line animate-spin" /> Uploading image…</>
          ) : (
            <><i className="ri-add-circle-line" /> Create {label}</>
          )}
        </button>
      </form>

    </div>
  );
};

export default BannerCard;
