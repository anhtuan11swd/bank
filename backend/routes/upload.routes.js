import express from "express";
import { uploadFile } from "../controller/upload.controller.js";
import { handleMulterError } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", handleMulterError("photo"), uploadFile);

export default router;
