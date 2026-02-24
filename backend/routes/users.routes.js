import express from "express";
import { createData } from "../controller/controller.js";
import User from "../model/users.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await createData(req, res, User);
});

export default router;
