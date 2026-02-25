import express from "express";
import emailController from "../controller/emailController.js";

const router = express.Router();

router.post("/", emailController.sendEmail);

export default router;
