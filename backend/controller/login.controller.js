import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/users.model.js";
import { findOneRecord } from "../services/db.js";

// Kích hoạt biến môi trường
dotenv.config();

/**
 * Controller xử lý đăng nhập
 * @param {Object} req - Request object chứa thông tin đăng nhập (email, password)
 * @param {Object} res - Response object để gửi phản hồi về frontend
 */
export const login = async (req, res) => {
  try {
    // Trích xuất dữ liệu từ request body
    const { email, password } = req.body;

    // Tạo đối tượng truy vấn để tìm user theo email
    const query = { email };

    // Tìm user trong database
    const dbResponse = await findOneRecord(query, User);

    // Kiểm tra sự tồn tại của người dùng
    if (!dbResponse) {
      return res.status(401).json({
        isLogged: false,
        message: "Thông tin đăng nhập không hợp lệ",
        success: false,
      });
    }

    // Xác thực mật khẩu bằng bcrypt
    const isPasswordMatch = await bcrypt.compare(password, dbResponse.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        isLogged: false,
        message: "Thông tin đăng nhập không hợp lệ",
        success: false,
      });
    }

    // Kiểm tra trạng thái tài khoản (isActive)
    if (!dbResponse.isActive) {
      return res.status(401).json({
        isLogged: false,
        message: "Tài khoản chưa được kích hoạt",
        success: false,
      });
    }

    // Chuẩn bị payload cho JWT (loại bỏ password)
    const { password: _, _id, ...userData } = dbResponse.toObject();
    const payload = {
      ...userData,
      userId: _id.toString(),
    };

    // Tạo JWT token với thời hạn 3 giờ
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Phản hồi thành công với token
    res.status(200).json({
      data: {
        email: dbResponse.email,
        fullName: dbResponse.fullName,
        userId: dbResponse._id,
        userType: dbResponse.userType,
      },
      isLogged: true,
      message: "Đăng nhập thành công",
      success: true,
      token,
    });
  } catch (_err) {
    // Xử lý lỗi server - trả về status 500
    res.status(500).json({
      isLogged: false,
      message: "Lỗi hệ thống",
      success: false,
    });
  }
};

/**
 * Controller xác thực token JWT
 * @param {Object} req - Request object chứa token trong header Authorization
 * @param {Object} res - Response object trả về kết quả xác thực
 */
export const verifyToken = async (req, res) => {
  try {
    // Lấy token từ header Authorization (Bearer token)
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        message: "Không tìm thấy token",
        success: false,
        valid: false,
      });
    }

    // Xác thực token với JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trả về thông tin user từ token
    res.status(200).json({
      data: {
        email: decoded.email,
        fullName: decoded.fullName,
        userId: decoded.userId,
        userType: decoded.userType,
      },
      message: "Token hợp lệ",
      success: true,
      valid: true,
    });
  } catch (_err) {
    // Token không hợp lệ hoặc đã hết hạn
    res.status(401).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
      success: false,
      valid: false,
    });
  }
};

/**
 * Xử lý route không tồn tại trong login routes
 */
export const handleLogin404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
