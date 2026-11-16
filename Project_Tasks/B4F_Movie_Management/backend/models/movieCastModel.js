import { Schema, model } from "mongoose";

const movieCastSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "Actor",
      required: true,
    },
    characterName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

movieCastSchema.index(
  { movie: 1, actor: 1, characterName: 1 },
  { unique: true },
);

movieCastSchema.index({ movie: 1 });
movieCastSchema.index({ actor: 1 });

const MovieCast = model("MovieCast", movieCastSchema);
export default MovieCast;
