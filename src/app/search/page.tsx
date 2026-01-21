import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    let movies: import("@/lib/tmdb").Movie[] = [];

    if (q) {
        try {
            movies = await searchMovies(q);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">
                Search Results for <span className="text-primary">&quot;{q}&quot;</span>
            </h1>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-lg">No movies found matching your search.</p>
            )}
        </div>
    );
}
