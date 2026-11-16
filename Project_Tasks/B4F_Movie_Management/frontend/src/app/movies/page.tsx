import MovieCard from "@/components/MovieCard";
import { api, fetcher } from "@/lib/apis";
import { Movie } from "@/lib/types";

const MoviesPage = async () => {
  "use cache";
  const movies = await fetcher<Movie[]>(api.getMovies);
  return (
    <div>
        <h2 className="text-xl font-semibold">
          Total Movies: {movies.length}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {movies.map((movie: Movie) => (
            <MovieCard key={movie._id} movie={movie} />
            ))}
        </div>
    </div>
  );
};

export default MoviesPage;
