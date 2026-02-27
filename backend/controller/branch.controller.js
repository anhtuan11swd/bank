import Branch from "../model/branch.model.js";
import { createData, deleteData, getData, updateData } from "./controller.js";

export const createBranch = (req, res) => createData(req, res, Branch);
export const getBranches = (req, res) => getData(req, res, Branch);
export const updateBranch = (req, res) => updateData(req, res, Branch);
export const deleteBranch = (req, res) => deleteData(req, res, Branch);

export const handleBranch404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
