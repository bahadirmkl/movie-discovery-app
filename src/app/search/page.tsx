import { searchMovies, discoverMovies, Movie } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import AdvancedFilter from "@/components/search/AdvancedFilter";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; year?: string; rating?: string; genre?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query, year, rating, genre } = await searchParams;
    let movies: Movie[] = [];
    const isDiscovery = !query || year || rating || genre;

    try {
        if (isDiscovery) {
            movies = await discoverMovies({
                year,
                minRating: rating,
                withGenres: genre,
                query: query // Pass query if exists, though discover might ignore
            });
        } else if (query) {
            movies = await searchMovies(query);
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">
                {query ? `Search Results for "${query}"` : "Discover Movies"}
            </h1>

            <AdvancedFilter />

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No movies found matching these criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
}
