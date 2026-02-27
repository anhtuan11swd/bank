import express from "express";
import { handleLogin404, login } from "../controller/login.controller.js";

const router = express.Router();

// POST /api/login - Xử lý đăng nhập
router.post("/", login);

router.use(handleLogin404);

export default router;
