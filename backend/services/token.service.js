import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Dịch vụ xác thực JWT Token
 * Xử lý logic giải mã và kiểm tra tính hợp lệ của token
 */

/**
 * Xác thực token từ request
 * @param {Object} req - Request object
 * @returns {Object} - Kết quả xác thực với isVerified và data
 */
const verifyToken = async (req) => {
  try {
    // Trích xuất token từ header Authorization
    const authHeader = req.headers.authorization;

    // Kiểm tra sự tồn tại của authorization header
    if (!authHeader) {
      return {
        isVerified: false,
        message: "There is no token",
        success: false,
      };
    }

    // Tách token từ "Bearer <token>" sử dụng split
    const token = authHeader.split(" ")[1];

    if (!token) {
      return {
        isVerified: false,
        message: "Token không hợp lệ",
        success: false,
      };
    }

    // Giải mã và xác thực token bằng JWT_SECRET từ biến môi trường
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trả về kết quả thành công với thông tin đã giải mã
    return {
      data: decoded,
      isVerified: true,
      message: "Token Verified",
      success: true,
    };
  } catch (error) {
    // Xử lý các lỗi JWT cụ thể
    if (error.name === "TokenExpiredError") {
      return {
        isVerified: false,
        message: "Token đã hết hạn",
        success: false,
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        isVerified: false,
        message: "Token không hợp lệ",
        success: false,
      };
    }

    // Lỗi không xác định
    return {
      error: error.message,
      isVerified: false,
      message: "Lỗi xác thực token",
      success: false,
    };
  }
};

export default {
  verifyToken,
};
