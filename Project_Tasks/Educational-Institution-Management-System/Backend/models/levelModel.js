import { model, Schema } from "mongoose";

const levelShcema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    orderNumber: { type: Number, required: true },
    deletedAt: { type: Date, default: null },
    isActive: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const Level = model("Level", levelShcema);
export default Level;
