import express from "express";
import {
  createBranch,
  deleteBranch,
  getBranches,
  handleBranch404,
  updateBranch,
} from "../controller/branch.controller.js";

const router = express.Router();

router.post("/", createBranch);
router.get("/", getBranches);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

router.use(handleBranch404);

export default router;
