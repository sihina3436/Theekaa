import { Request, Response } from "express";
import Post from "../models/post.model";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

interface MulterRequest extends Request {
  post_likes: number;
  other_details: string;
  current_living: string;
  education: string;
  imageURL: string;

}

// Create a new post request
export const CreatePostRequest = async (req: any, res: Response) => {
  try {
    const { other_details, current_living, education, image } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);

    // ✅ FIX 1: null check
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FIX 2: correct validation
    if (
        !user.first_name ||
        !user.last_name ||
        !user.email ||
        !user.nic ||
        !user.gender ||
        !user.marriage_status ||
        !user.income ||
        !user.district ||
        !user.height ||
        !user.weight ||
        !user.occupation

    ) {
      return res.status(400).json({
        message: "Please complete your profile before creating a post",
      });
    }

    if( user.status !== "verify"){
      return res.status(400).json({ message: "Your account is not verified yet. Please wait for admin approval." });
    }

    if (!other_details || !current_living || !education || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = new Post({
      user_id: req.user._id, // ✅ secure
      other_details,
      current_living,
      education,
      image,
    });

    await post.save();

    res.status(201).json(post);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Cannot create Post! Something went wrong",
    });
  }
};
// Get All posts
export const GetPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("user_id");
    res.status(200).json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// Get post by id
export const GetPostsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("user_id");
    res.status(200).json(post);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
//Get posts by user id
export const GetPostsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ user_id: userId });
    res.status(200).json(posts);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update post status
export const UpdatePostStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { post_status } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.post_status = post_status;
    await post.save();

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// Request delete post
export const RequestDeletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if(post.post_status === "Approve"){
      post.post_status = "RequestDelete";
      post.delete_date = new Date();
      await post.save();
      return res.status(200).json({ message: "Post delete request sent! contact admin", cotactAdmin: "+94766500567" });
    }
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
// Get all posts with delete request status
export const GetAllDeleteRequestedPosts = async (req: Request, res: Response) => {
  try{
    const post = await Post.find({post_status: "RequestDelete"}).populate("user_id");
    res.status(200).json(post);
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
// Delete post permanently
export const DeletePost = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const post = await Post.findById(id);
    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  
}

// edit post
export const EditPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { other_details } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    } 
    post.other_details = other_details;
    await post.save();
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const getPostByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Get the sender's most recent active post
    const post = await Post.findOne({ user_id: userId })
      .populate("user_id", "first_name last_name ProfilePicture gender district occupation income height weight dateOfBirth age marriage_status")
      .sort({ createdAt: -1 });

    if (!post) {
      return res.status(404).json({ message: "No post found for this user" });
    }

    return res.json({ data: post });
  } catch (error: any) {
    console.error("getPostByUserId error:", error);
    return res.status(500).json({ error: error.message });
  }
};

