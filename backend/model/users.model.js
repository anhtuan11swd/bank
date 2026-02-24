import bcrypt from "bcrypt";
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

// Middleware phải được định nghĩa TRƯỚC khi tạo model
usersSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("user", usersSchema);

export default User;
