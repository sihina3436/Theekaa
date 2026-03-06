import { Router } from "express";
import {CreateAdmin, GetAdminProfile, LoginAdmin, OfferBanner, reviewBanners, forgotPassword, resetPassword} from "../controllers/admin.controller";
import { verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-admin", CreateAdmin); //☑️
router.get("/get-admin", verifyAdmin, GetAdminProfile);//☑️
router.post("/login-admin", LoginAdmin);//☑️
router.post("/offer-banner", verifyAdmin, OfferBanner);//☑️
router.post("/review-banner", verifyAdmin, reviewBanners);//☑️
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
