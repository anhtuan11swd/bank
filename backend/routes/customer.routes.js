import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  handleCustomer404,
  updateCustomer,
} from "../controller/customer.controller.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

router.use(handleCustomer404);

export default router;
