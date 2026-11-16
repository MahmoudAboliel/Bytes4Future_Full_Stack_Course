import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "secretary", "teacher", "student"],
        message: "the role must be admin, secretary, teacher, student"
      },
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    birthDate: {
      type: Date,
      required: true,
    },
    // student fields
    study: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    // teatcher fields
    specialization: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    bio: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    deletedAt: { type: Date, default: null },
  },

  { timestamps: true },
);
const User = model("User", userSchema);
export default User;
