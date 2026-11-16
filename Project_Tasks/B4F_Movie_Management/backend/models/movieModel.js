import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    productYear: { type: Date, required: true },
    director: { type: String, required: true, trim: true },
    genres: [{ type: String }],
    image: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

movieSchema.index({ genres: 1 });
movieSchema.index({ title: "text" });

const Movie = model("Movie", movieSchema);
export default Movie;