import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    accountNumber: { type: Number, unique: true },
    address: { type: String },
    branch: { type: String },
    createdBy: { type: String },
    currency: { type: String },
    DOB: { type: String },
    document: { type: String },
    email: { type: String },
    finalBalance: { default: 0, type: Number },
    fullName: { type: String },
    gender: { type: String },
    isActive: { default: true, type: Boolean },
    mobile: { type: String },
    profile: { type: String },
    signature: { type: String },
    userId: { ref: "user", type: mongoose.Schema.Types.ObjectId },
    userType: { type: String },
  },
  { timestamps: true },
);

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
