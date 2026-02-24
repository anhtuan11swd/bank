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

export const createNewRecord = async (data, schema) => {
  const newRecord = new schema(data);
  return await newRecord.save();
};

export const updateRecord = async (id, data, schema) => {
  return await schema.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRecord = async (id, schema) => {
  return await schema.findByIdAndDelete(id);
};
