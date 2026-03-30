import { Router } from "express";
import {CreateAdmin, GetAdminProfile, LoginAdmin, OfferBanner, reviewBanners,  forgotPassword, resetPassword,SlideBanners,LogoutAdmin} from "../controllers/admin.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-admin", CreateAdmin); //☑️
router.get("/get-admin", verifyAdmin, GetAdminProfile);//☑️
router.post("/login-admin", LoginAdmin);//☑️
router.post("/offer-banner", verifyAdmin, OfferBanner);//☑️
router.post("/review-banner", verifyAdmin, reviewBanners);//☑️
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/slide-banner",verifyAdmin,SlideBanners);
router.post("/logout-admin",verifyAdmin, LogoutAdmin);

export default router;
