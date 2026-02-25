import express from "express";
import { createData, getData } from "../controller/controller.js";
import User from "../model/users.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await createData(req, res, User);
});

router.get("/", async (req, res) => {
  await getData(req, res, User);
});

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
