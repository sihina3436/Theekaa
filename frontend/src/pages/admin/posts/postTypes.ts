export type PostStatus = "Pending" | "Approve" | "Hold" | "RequestDelete";
export type TabView    = "all" | "delete-requests";

export interface PopulatedUser {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface Post {
  _id: string;
  user_id: PopulatedUser | string;
  post_status: PostStatus;
  posted_date: string;
  delete_date?: string;
  other_details?: string;
  current_living?: string;
  education?: string;
  image?: string;
  likes: number;
}

export const GRADIENT      = "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500";
export const GRADIENT_TEXT = `${GRADIENT} bg-clip-text text-transparent`;

export const STATUS_CONFIG: Record<PostStatus, { label: string; icon: string; pill: string; btn: string }> = {
  Pending: {
    label: "Pending",
    icon:  "ri-time-line",
    pill:  "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 border border-yellow-200",
    btn:   "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 border border-yellow-200 hover:border-yellow-400 hover:shadow-sm hover:shadow-yellow-100",
  },
  Approve: {
    label: "Approved",
    icon:  "ri-checkbox-circle-line",
    pill:  "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200",
    btn:   "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200 hover:border-green-400 hover:shadow-sm hover:shadow-green-100",
  },
  Hold: {
    label: "On Hold",
    icon:  "ri-pause-circle-line",
    pill:  "bg-purple-50 text-purple-500 border border-purple-200",
    btn:   "bg-purple-50 text-purple-500 border border-purple-200 hover:border-purple-400 hover:shadow-sm hover:shadow-purple-100",
  },
  RequestDelete: {
    label: "Delete Request",
    icon:  "ri-delete-bin-6-line",
    pill:  "bg-red-50 text-red-500 border border-red-200",
    btn:   "bg-red-50 text-red-500 border border-red-200",
  },
};

export const userName = (u: PopulatedUser | string): string => {
  if (typeof u === "string") return "Unknown";
  if (u.first_name || u.last_name) return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
  return u.email ?? u.phone ?? "Unknown";
};
