import { model, Schema } from "mongoose";

const cohortSchema = new Schema(
  {
    code: { type: String, required: true },
    levelId: { type: Schema.Types.ObjectId, ref: "Level", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: false },
    status: {
      type: String,
      enum: {
        values: ["planned", "active", "completed", "cancelled"],
        message: "the status must be planned, active, completed, cancelled",
      },
    },
    deletedAt: { type: Date, default: null },
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const Cohort = model("Cohort", cohortSchema);
export default Cohort;
