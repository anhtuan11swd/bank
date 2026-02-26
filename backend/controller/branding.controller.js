import Branding from "../model/branding.model.js";
import { createData, getData, updateData } from "./controller.js";

export const createBranding = (req, res) => createData(req, res, Branding);
export const getBranding = (req, res) => getData(req, res, Branding);
export const updateBranding = (req, res) => updateData(req, res, Branding);
