import mongoose from "mongoose";

const { Schema } = mongoose;

const currencySchema = new Schema(
  {
    currencyDescription: { type: String },
    currencyName: { required: true, type: String, unique: true },
    key: { type: String },
  },
  { timestamps: true },
);

const Currency = mongoose.model("currency", currencySchema);

export default Currency;
