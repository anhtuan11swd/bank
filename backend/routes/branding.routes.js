import express from "express";
import {
  createBranding,
  getBranding,
  updateBranding,
} from "../controller/branding.controller.js";

const router = express.Router();

router.post("/", createBranding);
router.get("/", getBranding);
router.put("/:id", updateBranding);

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
