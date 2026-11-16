import { model, Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "withdrawn", "completed"],
      },
    },
    enrolledAt: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const Enrollment = model("Enrollment", enrollmentSchema);
export default Enrollment;