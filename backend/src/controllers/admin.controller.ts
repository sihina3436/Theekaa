import { Request, Response } from "express";
import Admin from "../models/admin.model";
import Banner from "../models/Banner.model";
import { generateToken } from "../middleware/generateToken";
import { sendEmail } from "../utils/sendEmail";

// create admins
export const CreateAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.create(req.body);

    const token = await generateToken({ id: admin._id.toString(), role: "admin" });

    const adminObj = admin.toObject();
    const { password, ...adminData } = adminObj;

    res.status(201).json({ admin: adminData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Can not create Admin" });
  }
};

// Get admin profile
export const GetAdminProfile = async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const token = await generateToken({ id: admin._id.toString(), role: "admin" });

    const adminObj = admin.toObject();
    const { password, ...adminData } = adminObj;

    res.status(200).json({ admin: adminData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot fetch admin profile" });
  }
};

// Admin login
export const LoginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateToken({ id: admin._id.toString(), role: "admin" });

    const adminObj = admin.toObject();
    const { password: pwd, ...adminData } = adminObj;

    res.status(200).json({ admin: adminData, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// Make offer banner
export const OfferBanner = async (req: Request, res:Response) => {
  try{
      const {bannerTitle, bannerImageUrl} = req.body;

      const newBanner = await Banner.create({
        bannerTitle,
        bannerImageUrl,
        type: "offer"
      });

      res.status(201).json({ message: "Offer banner created successfully", banner: newBanner });
  }catch(error){
    res.status(500).json({ message: "Failed to make offer banner" });

  }
}

// review banners
export const reviewBanners = async (req: Request, res:Response) => {
  try{
      const {bannerTitle, bannerImageUrl} = req.body;

      const newBanner = await Banner.create({
        bannerTitle,
        bannerImageUrl,
        type: "review"
      });
      res.status(201).json({ message: "Review banner created successfully", banner: newBanner });
  }catch(error){
    res.status(500).json({ message: "Failed to review banners" });  
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try{
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.verifyOTP = otp;
    admin.verifyOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    await sendEmail(admin.email, "OTP", `Your OTP is ${otp}`);

  }catch(error){
    res.status(500).json({ message: "Failed to process forgot password request" });
    console.error("Forgot password error:", error);
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try{
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email });

    if (
      !admin ||
      admin.verifyOTP !== otp ||
      !admin.verifyOTPExpires ||
      admin.verifyOTPExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    admin.password = newPassword;
    admin.verifyOTP = undefined;
    admin.verifyOTPExpires = undefined;
    await admin.save();
    res.json({ message: "Password reset successful" });
  }catch(error){
    res.status(500).json({ message: "Failed to reset password" });
    console.error("Reset password error:", error);
  }
}