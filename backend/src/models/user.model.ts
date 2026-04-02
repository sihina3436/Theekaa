import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";


// Interface
export interface IUser extends Document {
  nic?: string;
  phone?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  status: "Pending" | "verify";
  role: string;
  gender?: "Male" | "Female" | "Other";
  marriage_status?: "Single" | "Married" | "Divorced";
  income?: number;
  ProfilePicture?: string;
  district?: string;
  height?: number;
  weight?: number;
  occupation?: string;
  verifyOTP?: string;
  verifyOTPExpires?: Date;
  dateOfBirth?: Date;
  age?: number; 
  fcmToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

// Schema
const UserSchema = new Schema<IUser>(
  {
    nic: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    first_name: String,
    last_name: String,
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "verify"],
      default: "Pending",
    },
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    marriage_status: {
      type: String,
      enum: ["Single", "Married", "Divorced"],
    },
    income: Number,
    ProfilePicture: String,
    district: String,
    height: Number,
    weight: Number,
    occupation: String,
    verifyOTP: String,
    verifyOTPExpires: Date,
    dateOfBirth: Date,
    age: Number,
    fcmToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


//  Password Hash Middleware
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


//   Compare Password Method
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};


// Model Export
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
