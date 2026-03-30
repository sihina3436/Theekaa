import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import ChatRequest from "../models/chatRequest.model";

// ✅ Send Request
export const makeRequest = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  try {
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Must have post
    const senderPost = await Post.findOne({ user_id: senderId });
    if (!senderPost) {
      return res.status(400).json({
        message: "Create a post before sending chat request",
      });
    }

    // Check BOTH directions
    const existing = await ChatRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existing) {
      if (existing.status === "blocked") {
        return res.status(403).json({ message: "User is blocked" });
      }
      return res.status(400).json({ message: "Request already exists" });
    }

    await ChatRequest.create({
      senderId,
      receiverId,
    });

    res.status(201).json({ message: "Chat request sent" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// ✅ Received Requests
export const getReceivedRequests = async (req: Request, res: Response) => {
  const { receiverId } = req.params;

  try {
    const requests = await ChatRequest.find({ receiverId })
      .populate("senderId", "first_name last_name email ProfilePicture")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Sent Requests
export const getSentRequests = async (req: Request, res: Response) => {
  const { senderId } = req.params;

  try {
    const requests = await ChatRequest.find({ senderId })
      .populate("receiverId", "first_name last_name email ProfilePicture")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Accept / Reject
export const updateRequestStatus = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await ChatRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status}`, request });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Block User
export const BlockUser = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  try {
    let request = await ChatRequest.findOne({
      senderId,
      receiverId,
    });

    if (!request) {
      request = await ChatRequest.create({
        senderId,
        receiverId,
        status: "blocked",
      });
    } else {
      request.status = "blocked";
      await request.save();
    }

    res.json({ message: "User blocked", request });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};