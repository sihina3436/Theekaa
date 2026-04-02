import { Router } from "express";
import {
    CreatePostRequest,
    GetPosts ,
    GetPostsById, 
    UpdatePostStatus,
    RequestDeletePost,
    GetAllDeleteRequestedPosts,
    DeletePost, 
    EditPost,
    GetPostsByUserId,
    getPostByUserId

} from "../controllers/post.controller";
import { verifyAdmin,verifyUser } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post("/create-post",verifyUser, upload.single("image"), CreatePostRequest); 
router.get("/get-posts", GetPosts);//☑️
router.get("/get-post/:id",  GetPostsById);//☑️
router.put("/status/:id", verifyAdmin, UpdatePostStatus);//☑️
router.post("/request-delete/:id", verifyUser, RequestDeletePost); //☑️
router.get("/delete-requests", verifyAdmin, GetAllDeleteRequestedPosts); //☑️
router.delete("/delete-post/:id", verifyAdmin, DeletePost);//☑️
router.put("/edit-post/:id", verifyUser, EditPost);//☑️
router.get("/user-posts/:userId", verifyUser, GetPostsByUserId);//☑️
router.get("/user-post/:userId", verifyUser, getPostByUserId);
export default router;