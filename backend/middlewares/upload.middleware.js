import { upload } from "../services/upload.service.js";

/**
 * Middleware xử lý upload file với error handling
 * Sử dụng upload.single('file') từ service và bắt lỗi Multer
 */
export const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      // Trả về lỗi dạng JSON (ví dụ: "No folder name provided")
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }
    next();
  });
};
