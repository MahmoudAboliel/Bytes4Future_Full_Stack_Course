import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    status: {
      type: String,
      enum: { values: ["present", "absent", "late", "excused"] },
      message: "The Type Of Process must is present, absent, late",
    },
  },
  {
    timestamps: true,
  },
);

const Attendance = model("Attendance", AttendanceSchema);
export default Attendance;
