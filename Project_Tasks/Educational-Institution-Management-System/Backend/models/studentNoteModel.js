import { Schema, model } from "mongoose";

const StudentNoteSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: { type: String, required: true },
    visibility: {
      type: String,
      enum: { values: ["teacherOnly", "admin", "student"] },
      message: "The Type Of Process must is teacherOnly, admin, student",
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);
const StudentNote = model("StudentNote", StudentNoteSchema);
export default StudentNote;
