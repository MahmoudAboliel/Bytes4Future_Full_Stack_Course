import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: "Cohort",
    required: true,
  },
  sessionNumber: { type: Number, required: true },
  sessionDate: { type: Date, required: true },
  topic: { type: String, required: true },
  status: {
    type: String,
    enum: { values: ["scheduled", "done", "cancelled"] },
    message: "The Type Of Process must is scheduled, done, cancelled",
  },
}, {
    timestamps: true
});

const Session = model("Session", SessionSchema);
export default Session; 
