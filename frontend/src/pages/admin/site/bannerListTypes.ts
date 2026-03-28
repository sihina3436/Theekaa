export type BannerType = "offer" | "review" | "slide";

export interface Banner {
  _id: string;
  bannerTitle: string;
  bannerImageUrl: string;
  type: BannerType;
  createdAt: string;
  updatedAt: string;
}

export const BANNER_TYPE_CONFIG: Record<BannerType, { label: string; icon: string; pill: string }> = {
  offer: {
    label: "Offer",
    icon:  "ri-gift-line",
    pill:  "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 border border-orange-200",
  },
  review: {
    label: "Review",
    icon:  "ri-star-line",
    pill:  "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-500 border border-indigo-200",
  },
  slide: {
    label: "Slide",
    icon:  "ri-slideshow-line",
    pill:  "bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-600 border border-emerald-200",
  },
};
