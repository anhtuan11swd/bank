import express from "express";
import {
  createCurrency,
  deleteCurrency,
  getCurrencies,
  handleCurrency404,
  updateCurrency,
} from "../controller/currency.controller.js";

const router = express.Router();

router.post("/", createCurrency);
router.get("/", getCurrencies);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

router.use(handleCurrency404);

export default router;
