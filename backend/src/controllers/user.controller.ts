import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { generateToken } from "../middleware/generateToken";
import { sendEmail } from "../utils/sendEmail";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

/* ---------- SIGNUP ---------- */
export const Signup = async (req: AuthRequest, res: Response) => {
  const {nic, phone, email, password } = req.body;

  if (!nic || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    return res.status(400).json({ message: "Phone number already in use" });
  }

  const user = new User({ nic, phone, email, password });
  await user.save();
  const token = generateToken({
    id: user._id.toString(),
    role: "user",
  });

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 60 * 60 * 1000,
  });

  const { password: pwd, ...userData } = user.toObject();

  res.status(201).json({
    message: "Signup successful",
    user: userData
  });
};

/* ---------- SIGNIN ---------- */
export const Signin = async (req: AuthRequest, res: Response) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials", phone, password });
  }

  const token = generateToken({
    id: user._id.toString(),
    role: "user",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 60 * 60 * 1000,
  });

  const { password: pwd, ...userData } = user.toObject();

  res.json({ message: "Sign in Sucessfull", user: userData });
};

/* ---------- GET USER ---------- */
export const getUser = async (req: AuthRequest, res: Response) => {

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found", id: req.user.id , user: req.user });

  res.json(user);
};

/* ---------- UPDATE PROFILE ---------- */
export const UpdateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  Object.assign(user, req.body);
  await user.save();

  const { password, ...data } = user.toObject();

  res.json(data);
};

/* ---------- GET ALL USERS ---------- */
export const getAllUser = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Get all users error:", error);
  }
}

/* ---------- FORGOT PASSWORD ---------- */
export const forgotPassword = async (req: AuthRequest, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.verifyOTP = otp;
  user.verifyOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

    if (!user.email) {
      return res.status(400).json({ message: "Email not found" });
    }

   await sendEmail(user.email, "OTP", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent" });
};

/* ---------- RESET PASSWORD ---------- */
export const resetPassword = async (req: AuthRequest, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

  if (
    !user ||
    user.verifyOTP !== otp ||
    !user.verifyOTPExpires ||
    user.verifyOTPExpires.getTime() < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = newPassword;

  user.verifyOTP = undefined;
  user.verifyOTPExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
  } catch (error) {
   
    return res.status(500).json({ message: "Server error" });
     console.error("Reset password error:", error);
  }

  
};
/* ---------- DELETE USER BY ID ---------- */
export const deleteUserById = async (req: AuthRequest, res: Response) => {
  try {

    const {id} = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "**** User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error: any) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------- ADD PROFILE PICTURE ---------- */
export const addProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { profilePictureUrl } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.ProfilePicture = profilePictureUrl;
    await user.save();
    res.json({ message: "Profile picture updated", profilePicture: profilePictureUrl });
    
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
    console.error("Add profile picture error:", error);
  }
}

/* ---------- REMOVE PROFILE PICTURE ---------- */
export const removeProfilePicture = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.ProfilePicture = undefined;
    await user.save();
    res.json({ message: "Profile picture removed" });
  }catch(error){
    return res.status(500).json({ message: "Server error" });
    console.error("Remove profile picture error:", error);
  }
}

/* ---------- UPDATE PROFILE PICTURE ---------- */
export const updateProfilePicture = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.user?.id;
    const { profilePictureUrl } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.ProfilePicture = profilePictureUrl;
    await user.save();
    res.json({ message: "Profile picture updated", profilePicture: profilePictureUrl });
  }catch(error){
    return res.status(500).json({ message: "Server error" });
    console.error("Update profile picture error:", error);
  }
}

/* ---------- Update User Profile Status ---------- */
export const updateProfileStatus = async (req: AuthRequest, res: Response) => {
  try {
    
    const { userId, status } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = status;
    await user.save();
    res.json({ message: "Profile status updated", status });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
    console.error("Update profile status error:", error);
  }
}

