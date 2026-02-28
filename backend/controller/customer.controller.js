import Customer from "../model/customer.model.js";
import { createData, deleteData, getData, updateData } from "./controller.js";

export const createCustomer = (req, res) => createData(req, res, Customer);
export const getCustomers = (req, res) => getData(req, res, Customer);
export const updateCustomer = (req, res) => updateData(req, res, Customer);
export const deleteCustomer = (req, res) => deleteData(req, res, Customer);

export const handleCustomer404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
