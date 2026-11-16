import { Schema, model } from "mongoose";

const actorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    nationality: { type: String, required: true, trim: true },
    image: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Actor = model("Actor", actorSchema);
export default Actor;