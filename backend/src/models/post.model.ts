import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  user_id: mongoose.Types.ObjectId;
  post_status: "Pending" | "Approve" | "Hold" | "RequestDelete";
  posted_date: Date;
  delete_date?: Date;
  other_details?: string;
  current_living?: string;
  image?: string;
  education?: string;
}

const PostSchema = new Schema<IPost>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post_status: {
      type: String,
      enum: ["Pending", "Approve", "Hold", "RequestDelete"],
      default: "Pending",
    },
    posted_date: { type: Date, default: Date.now },
    delete_date: Date,
    other_details: String,
    current_living: String,
    image: String,
    education: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
