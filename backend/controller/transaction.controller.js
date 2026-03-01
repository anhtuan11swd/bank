import Transaction from "../model/transaction.model.js";
import { createData, deleteData, getData, updateData } from "./controller.js";

export const createTransaction = (req, res) =>
  createData(req, res, Transaction);

export const getTransactions = (req, res) => getData(req, res, Transaction);

export const updateTransaction = (req, res) =>
  updateData(req, res, Transaction);

export const deleteTransaction = (req, res) =>
  deleteData(req, res, Transaction);

export const handleTransaction404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
