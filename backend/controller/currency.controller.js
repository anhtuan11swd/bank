import Currency from "../model/currency.model.js";
import { createData, deleteData, getData, updateData } from "./controller.js";

export const createCurrency = (req, res) => createData(req, res, Currency);
export const getCurrencies = (req, res) => getData(req, res, Currency);
export const updateCurrency = (req, res) => updateData(req, res, Currency);
export const deleteCurrency = (req, res) => deleteData(req, res, Currency);
