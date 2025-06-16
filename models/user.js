// models/user.js
import mongoose, { models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // optional for Google users
    provider: { type: String, default: "credentials" }, // tracks signup method
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
