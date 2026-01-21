import { getTrendingMovies } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";

export default async function Home() {
  let movies: import("@/lib/tmdb").Movie[] = [];
  let error = null;

  try {
    movies = await getTrendingMovies();
  } catch (e: any) {
    error = "Failed to load movies. Please check your TMDB API Key configuration.";
    console.error(e);
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Trending Movies</h1>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-8">
          {error}
        </div>
      )}

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        !error && <p className="text-muted-foreground">No trending movies found.</p>
      )}
    </div>
  );
}
