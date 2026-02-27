import Branding from "../model/branding.model.js";
import { createData, getData, updateData } from "./controller.js";

export const createBranding = (req, res) => createData(req, res, Branding);
export const getBranding = (req, res) => getData(req, res, Branding);
export const updateBranding = (req, res) => updateData(req, res, Branding);

export const handleBranding404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
