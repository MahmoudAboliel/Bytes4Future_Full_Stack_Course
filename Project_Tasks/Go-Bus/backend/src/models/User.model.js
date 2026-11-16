import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "secretary", "customer"],
      default: "customer",
      required: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
