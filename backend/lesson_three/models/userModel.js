import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    family: { type: String },
    age: { type: Number },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;