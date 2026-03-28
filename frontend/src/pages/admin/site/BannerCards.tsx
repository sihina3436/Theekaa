import React from "react";
import {
  useAddOfferBannerMutation,
  useReviewBannersMutation,
  useAddSlideBannerMutation,
} from "../../../redux/adminAuth/adminAuthApi";
import {
  useUploadBannerImageMutation,
  useUploadReviewImageMutation,
  useUploadSlideImageMutation,
} from "../../../redux/image/imageAPI";
import BannerCard from "./BannerCard";
import useBannerForm from "./useBannerForm";

interface Props {
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

/* ── Offer ── */
export const OfferBannerCard: React.FC<Props> = ({ onSuccess, onError }) => {
  const [uploadBannerImage] = useUploadBannerImageMutation();
  const [uploadOfferBanner] = useAddOfferBannerMutation();

  const form = useBannerForm({
    uploadFn:   (fd) => uploadBannerImage(fd) as any,
    submitFn:   (p)  => uploadOfferBanner(p)  as any,
    onSuccess, onError,
    successMsg: "Offer banner created!",
    errorMsg:   "Failed to create offer banner",
  });

  return (
    <BannerCard
      type="offer" label="Offer Banner" icon="ri-gift-line"
      accentPill="bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 border border-orange-200"
      {...form}
    />
  );
};

/* ── Review ── */
export const ReviewBannerCard: React.FC<Props> = ({ onSuccess, onError }) => {
  const [uploadReviewImage]  = useUploadReviewImageMutation();
  const [uploadReviewBanner] = useReviewBannersMutation();

  const form = useBannerForm({
    uploadFn:   (fd) => uploadReviewImage(fd)  as any,
    submitFn:   (p)  => uploadReviewBanner(p)  as any,
    onSuccess, onError,
    successMsg: "Review banner created!",
    errorMsg:   "Failed to create review banner",
  });

  return (
    <BannerCard
      type="review" label="Review Banner" icon="ri-star-line"
      accentPill="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-500 border border-indigo-200"
      {...form}
    />
  );
};

/* ── Slide ── */
export const SlideBannerCard: React.FC<Props> = ({ onSuccess, onError }) => {
  const [uploadSlideImage]  = useUploadSlideImageMutation();
  const [uploadSlideBanner] = useAddSlideBannerMutation();

  const form = useBannerForm({
    uploadFn:   (fd) => uploadSlideImage(fd)  as any,
    submitFn:   (p)  => uploadSlideBanner(p)  as any,
    onSuccess, onError,
    successMsg: "Slide banner created!",
    errorMsg:   "Failed to create slide banner",
  });

  return (
    <BannerCard
      type="slide" label="Slide Banner" icon="ri-slideshow-line"
      accentPill="bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-600 border border-emerald-200"
      {...form}
    />
  );
};
