import { Router } from "express";
import {
  Signup,
  Signin,
  getUser,
  getAllUser,
  UpdateProfile,
  forgotPassword,
  resetPassword,
  deleteUserById,
  addProfilePicture,
  removeProfilePicture,
  updateProfilePicture,
  updateProfileStatus
} from "../controllers/user.controller";

import { verifyUser, verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/sign-up", Signup);
router.post("/sign-in", Signin);

router.put("/update-profile/:id", verifyUser, UpdateProfile);
router.get("/get-user/:id", verifyUser,getUser);

router.get("/get-all-users", verifyAdmin,getAllUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.delete("/delete-user/:id", verifyAdmin,deleteUserById);

router.post("/add-profile-picture", verifyUser,addProfilePicture);
router.put("/remove-profile-picture", verifyUser,removeProfilePicture);
router.put("/update-profile-picture", verifyUser,updateProfilePicture);
router.put("/update-profile-status", verifyAdmin,updateProfileStatus);



export default router;