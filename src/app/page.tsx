import { getTrendingMovies, getGenres } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import GenreFilter from "@/components/movie/GenreFilter";
import Pagination from "@/components/layout/Pagination";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  let movies: import("@/lib/tmdb").Movie[] = [];
  let genres: import("@/lib/tmdb").Genre[] = [];
  let error = null;

  try {
    const [moviesData, genresData] = await Promise.all([
      getTrendingMovies(currentPage),
      getGenres()
    ]);
    movies = moviesData;
    genres = genresData;
  } catch (e: any) {
    error = "Failed to load data. Please check your connection or API Key.";
    console.error(e);
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-3xl font-bold">Trending Movies</h1>
        <GenreFilter genres={genres} />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-8">
          {error}
        </div>
      )}

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Pagination currentPage={currentPage} baseUrl="/" />
        </>
      ) : (
        !error && <p className="text-muted-foreground">No trending movies found.</p>
      )}
    </div>
  );
}
