import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    address: { type: String },
    email: { type: String, unique: true },
    fullName: { type: String },
    isActive: { default: false, type: Boolean },
    mobile: { type: String },
    password: { type: String },
    profile: { type: String },
    userType: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("user", usersSchema);

export default User;
