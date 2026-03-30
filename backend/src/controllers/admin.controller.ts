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

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        success: false 
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        success: false 
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        success: false 
      });
    }

    const token = await generateToken({
      id: admin._id.toString(),
      role: "admin"
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const adminObj = admin.toObject();
    const { password: _, ...adminData } = adminObj;

    return res.status(200).json({ 
      admin: adminData,
      success: true,
      message: "Login successful" 
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ 
      message: "Login failed. Please try again later.",
      success: false 
    });
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

// Slide Images
export const SlideBanners = async (req: Request, res:Response) => {
  try{
      const {bannerTitle, bannerImageUrl} = req.body;

      const newBanner = await Banner.create({
        bannerTitle,
        bannerImageUrl,
        type: "slide"
      });
      res.status(201).json({ message: "slide banner created successfully", banner: newBanner });
  }catch(error){
    res.status(500).json({ message: "Failed to review banners" });  
  }
}


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "Email is required",
        success: false 
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Don't reveal if email exists for security
      return res.status(200).json({ 
        message: "If an account exists, an OTP has been sent",
        success: true 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.verifyOTP = otp;
    admin.verifyOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    await sendEmail(admin.email, "Password Reset OTP", `Your OTP is ${otp}. This OTP expires in 10 minutes.`);

    return res.status(200).json({ 
      message: "OTP sent to your email",
      success: true 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ 
      message: "Failed to process forgot password request",
      success: false 
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Email, OTP, and new password are required",
        success: false 
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long",
        success: false 
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ 
        message: "Admin not found",
        success: false 
      });
    }

    // Check OTP validity
    if (admin.verifyOTP !== otp) {
      return res.status(400).json({ 
        message: "Invalid OTP",
        success: false 
      });
    }

    if (!admin.verifyOTPExpires || admin.verifyOTPExpires.getTime() < Date.now()) {
      return res.status(400).json({ 
        message: "OTP has expired",
        success: false 
      });
    }

    // Update password and clear OTP
    admin.password = newPassword;
    admin.verifyOTP = undefined;
    admin.verifyOTPExpires = undefined;
    await admin.save();

    return res.status(200).json({ 
      message: "Password reset successful",
      success: true 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ 
      message: "Failed to reset password",
      success: false 
    });
  }
};

export const LogoutAdmin = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Failed to logout" });
  }
};


