import * as msr from "../services/movieService.js";
import * as mcsr from "../services/movieCastService.js";

export const addMovie = async (request, response) => {
  try {
    const movieData = request.body;
    await msr.createMovie(movieData);
    response.status(201).json({ message: "Movie added successfully" });
  }
  catch (error) {
    response.status(500).json({ message: error.message });
  }
}

export const getMovies = async (request, response) => {
  try {
    // const { page, limit } = request.query;
    const movies = await msr.getAllMovies();
    response.status(200).json(movies);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getMovie = async (request, response) => {
  try {
    const { movieId } = request.params;
    const movie = await msr.getMovieById(movieId);
    response.status(200).json(movie);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (request, response) => {
  try {
    const { movieId } = request.params;
    const movieData = request.body;
    const updatedMovie = await msr.updateMovie(movieId, movieData);
    response.status(200).json(updatedMovie);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (request, response) => {
  try {
    const { movieId } = request.params;
    const deletedMovie = await msr.deleteMovie(movieId);
    response.status(200).json(deletedMovie);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const addMovieCast = async (request, response) => {
  try {
    const { movieId } = request.params;
    const castData = request.body;
    await mcsr.addMovieCast(movieId, castData);
    response.status(201).json({ message: "Movie cast added successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
