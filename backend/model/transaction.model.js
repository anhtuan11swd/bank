import mongoose from "mongoose";

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    accountNumber: { required: true, type: Number },
    currentBalance: { required: true, type: Number },
    customerId: {
      ref: "customer",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    reference: { type: String },
    transactionAmount: { required: true, type: Number },
    transactionType: {
      enum: ["credit", "debit"],
      required: true,
      type: String,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;
