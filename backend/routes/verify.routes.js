import express from "express";
import tokenService from "../services/token.service.js";

const router = express.Router();

/**
 * Route xác thực token
 * GET / - Kiểm tra tính hợp lệ của JWT token
 * Điều phối phản hồi HTTP dựa trên kết quả từ tokenService
 */
router.get("/", async (req, res) => {
  // Nhận kết quả từ tokenService
  const verified = await tokenService.verifyToken(req);

  // Kiểm tra điều kiện xác thực và điều phối phản hồi
  if (verified.isVerified) {
    // Trường hợp thành công: trả về trạng thái 200 với dữ liệu người dùng
    return res.status(200).json({
      data: verified.data,
      isVerified: true,
      message: "Token Verified",
      success: true,
    });
  }
  // Trường hợp thất bại: trả về trạng thái 401 (Unauthorized)
  return res.status(401).json({
    isVerified: false,
    message: verified.message || "Unauthorized",
    success: false,
  });
});

export default router;
