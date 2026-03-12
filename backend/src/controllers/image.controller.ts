import { Request, Response } from "express";
import { uploadBuffer } from "../utils/uploadImage";

export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

  
    const imageUrl = await uploadBuffer(file.buffer, "users");

    res.status(200).json({imageUrl});
  } catch (error) {
    console.error("uploadSingleImage error:", error);
    res.status(500).json({ message: "Cannot upload image! Something went wrong" });
  }
};