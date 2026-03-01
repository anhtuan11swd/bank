import express from "express";
import { findAccountByAccountNumber } from "../controller/customer.controller.js";
import Customer from "../model/customer.model.js";

const router = express.Router();

router.post("/", (req, res) => findAccountByAccountNumber(req, res, Customer));

export default router;
