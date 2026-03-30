import { Router } from "express";
import upload from "../middleware/upload.middleware";
import { uploadSingleImage,getBanners,deleteBanner } from "../controllers/image.controller";
import { verifyAdmin,verifyUser } from "../middleware/auth.middleware";

const router = Router();


router.post("/upload-post-image", verifyUser, upload.single("image"), uploadSingleImage);
router.post("/upload-profile-image",verifyUser , upload.single("image"), uploadSingleImage);
router.post("/upload-banner-image",verifyAdmin, upload.single("image"),uploadSingleImage );
router.post("/upload-review-image", verifyAdmin, upload.single("image"),uploadSingleImage );
router.post("/upload-slide-image", verifyAdmin, upload.single("image"),uploadSingleImage );
router.get("/banners", getBanners);
router.delete("/delete-banner/:id", verifyAdmin, deleteBanner);
export default router;