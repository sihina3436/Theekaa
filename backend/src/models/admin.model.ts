import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";


 //  Interface


export interface IAdmin extends Document {
  email: string;
  name: string;
  password: string;
  role: string;
  whatsapp: string;
  verifyOTP?: string;
  verifyOTPExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}


 //  Schema


const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    whatsapp: {
      type: String,
      default: "+94766500567",
    },
    verifyOTP: String,
    verifyOTPExpires: Date,
  },
  {
    timestamps: true,
  }
);


 //  Password Hash Middleware
 


AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


 //  Compare Password Method


AdminSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};


  // Export Model

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
