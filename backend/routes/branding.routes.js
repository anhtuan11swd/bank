import express from "express";
import { createData, getData, updateData } from "../controller/controller.js";
import Branding from "../model/branding.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await createData(req, res, Branding);
});

router.get("/", async (req, res) => {
  await getData(req, res, Branding);
});

router.put("/:id", async (req, res) => {
  await updateData(req, res, Branding);
});

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
