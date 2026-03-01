import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  handleTransaction404,
  updateTransaction,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

router.use(handleTransaction404);

export default router;
