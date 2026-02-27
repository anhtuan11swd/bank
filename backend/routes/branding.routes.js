import express from "express";
import {
  createBranding,
  getBranding,
  handleBranding404,
  updateBranding,
} from "../controller/branding.controller.js";

const router = express.Router();

router.post("/", createBranding);
router.get("/", getBranding);
router.put("/:id", updateBranding);

router.use(handleBranding404);

export default router;
