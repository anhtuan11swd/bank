import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "../controller/branch.controller.js";

const router = express.Router();

router.post("/", createBranch);
router.get("/", getBranches);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
