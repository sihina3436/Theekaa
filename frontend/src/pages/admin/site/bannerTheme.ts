export const GRADIENT      = "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500";
export const GRADIENT_TEXT = `${GRADIENT} bg-clip-text text-transparent`;

export interface UploadImageResponse {
  imageUrl: string;
}

export interface CreateBannerPayload {
  bannerTitle: string;
  bannerImageUrl: string;
}
