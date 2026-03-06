import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAccountVerify: { type: Boolean, default: true },
    cartData: { type: Object, default: {} },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
