import User from "../model/users.model.js";
import { createData, deleteData, getData, updateData } from "./controller.js";

export const createUser = (req, res) => createData(req, res, User);
export const getUsers = (req, res) => getData(req, res, User);
export const updateUser = (req, res) => updateData(req, res, User);
export const deleteUser = (req, res) => deleteData(req, res, User);

export const handleUsers404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
