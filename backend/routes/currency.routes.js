import express from "express";
import {
  createCurrency,
  deleteCurrency,
  getCurrencies,
  updateCurrency,
} from "../controller/currency.controller.js";

const router = express.Router();

router.post("/", createCurrency);
router.get("/", getCurrencies);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

router.use((_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
});

export default router;
