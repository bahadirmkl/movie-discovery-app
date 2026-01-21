import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import GenreFilter from "@/components/movie/GenreFilter";
import Pagination from "@/components/layout/Pagination";

interface GenrePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
    const { id } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    let movies: import("@/lib/tmdb").Movie[] = [];
    let genres: import("@/lib/tmdb").Genre[] = [];

    try {
        const [moviesData, genresData] = await Promise.all([
            getMoviesByGenre(id, currentPage),
            getGenres()
        ]);
        movies = moviesData;
        genres = genresData;
    } catch (e) {
        console.error(e);
    }

    const currentGenre = genres.find(g => g.id.toString() === id);

    return (
        <div className="container py-8">
            <div className="flex flex-col gap-6 mb-8">
                <h1 className="text-3xl font-bold">
                    {currentGenre ? `${currentGenre.name} Movies` : "Genre Movies"}
                </h1>
                <GenreFilter genres={genres} />
            </div>

            {movies.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} baseUrl={`/genre/${id}`} />
                </>
            ) : (
                <p className="text-muted-foreground text-lg">No movies found for this genre.</p>
            )}
        </div>
    );
}
