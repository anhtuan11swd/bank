import mongoose from "mongoose";

const { Schema } = mongoose;

const brandingSchema = new Schema(
  {
    bankAccountNumber: { type: String },
    bankAddress: { type: String },
    bankDescription: { type: String },
    bankLogo: { type: String },
    bankName: { type: String },
    bankTagline: { type: String },
    bankTransactionId: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  { timestamps: true },
);

const Branding = mongoose.model("branding", brandingSchema);

export default Branding;
