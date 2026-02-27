import express from "express";
import { uploadFile } from "../controller/upload.controller.js";
import { handleUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// POST /api/upload - Upload file với field name 'file'
// Query parameter: ?folderName=ten-thu-muc (ví dụ: ?folderName=photo)
// Middleware handleUpload sử dụng upload.single('file') từ service
router.post("/", handleUpload, uploadFile);

export default router;
