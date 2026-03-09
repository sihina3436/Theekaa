import { Router } from "express";
import {CreatePostRequest, GetPosts , GetPostsById, UpdatePostStatus,RequestDeletePost,GetAllDeleteRequestedPosts,DeletePost, EditPost} from "../controllers/post.controller";
import { verifyAdmin } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post("/create-post", upload.single("image"), CreatePostRequest); 
router.get("/get-posts", GetPosts);//☑️
router.get("/get-post/:id", GetPostsById);//☑️
router.put("/status/:id", verifyAdmin, UpdatePostStatus);//☑️
router.post("/request-delete/:id", RequestDeletePost); //☑️
router.get("/delete-requests", verifyAdmin, GetAllDeleteRequestedPosts); //☑️
router.delete("/delete-post/:id", verifyAdmin, DeletePost);//☑️
router.put("/edit-post/:id", EditPost);//☑️

export default router;