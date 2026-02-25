import express from "express";
import { uploadFile } from "../controller/upload.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Xử lý upload với kiểm tra lỗi từ Multer
router.post(
  "/",
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      // Kiểm tra lỗi từ Multer
      if (err) {
        return res.status(400).json({
          message: err.message,
          success: false,
        });
      }
      // Tiếp tục với controller
      next();
    });
  },
  uploadFile,
);

export default router;
