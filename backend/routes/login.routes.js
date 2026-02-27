import express from "express";
import {
  handleLogin404,
  login,
  verifyToken,
} from "../controller/login.controller.js";

const router = express.Router();

// POST /api/login - Xử lý đăng nhập
router.post("/", login);

// POST /api/verify-token - Xác thực token JWT
router.post("/verify-token", verifyToken);

router.use(handleLogin404);

export default router;
