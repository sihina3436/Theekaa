import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// Memory storage (store file in RAM for Cloudinary)
const storage = multer.memoryStorage();

// Multer config
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;