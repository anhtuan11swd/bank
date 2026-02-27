import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

mongoose.connection.on("connected", () => {
  console.log("Kết nối database thành công!");
});

mongoose.connection.on("error", (err) => {
  console.error("Lỗi kết nối database:", err);
});

export const findAllRecord = async (schema) => {
  return await schema.find({});
};

/**
 * Tìm một bản ghi theo điều kiện
 * @param {Object} query - Điều kiện tìm kiếm (vd: { email: "abc@example.com" })
 * @param {Object} schema - Mongoose model
 * @returns {Object|null} - Bản ghi tìm được hoặc null
 */
export const findOneRecord = async (query, schema) => {
  return await schema.findOne(query);
};

export const createNewRecord = async (data, schema) => {
  const newRecord = new schema(data);
  return await newRecord.save();
};

export const updateRecord = async (id, data, schema) => {
  return await schema.findByIdAndUpdate(id, data, { returnDocument: "after" });
};

export const deleteRecord = async (id, schema) => {
  return await schema.findByIdAndDelete(id);
};
