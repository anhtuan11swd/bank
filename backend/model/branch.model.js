import mongoose from "mongoose";

const { Schema } = mongoose;

const branchSchema = new Schema(
  {
    branchAddress: { type: String },
    branchName: { required: true, type: String, unique: true },
    key: { type: String },
  },
  { timestamps: true },
);

const Branch = mongoose.model("branch", branchSchema);

export default Branch;
