import { model, Schema } from "mongoose";

const enrollmentResultSchema = new Schema(
  {
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      trim: true,
    },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    grade: { type: String, required: true },
    notes: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    kind: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const EnrollmentResult = model(
  "EnrollmentResult",
  enrollmentResultSchema,
);
export default EnrollmentResult; 
