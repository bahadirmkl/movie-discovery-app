import { getMovie, getImageUrl, getMovieWatchProviders } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import { Star, Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import FavoriteButton from "@/components/movie/FavoriteButton";
import { getIsFavorited, getReviews } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import VideoDialog from "@/components/movie/VideoDialog";
import ReviewForm from "@/components/movie/ReviewForm";
import ReviewList from "@/components/movie/ReviewList";
import LogMovieDialog from "@/components/movie/LogMovieDialog";
import AddToListDialog from "@/components/lists/AddToListDialog";
import WatchProviders from "@/components/movie/WatchProviders";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: "Movie Details",
    };
}

export default async function MoviePage({ params }: PageProps) {
    const { id } = await params;
    let movie;

    try {
        movie = await getMovie(id);
    } catch (error) {
        return <div className="container py-8 text-destructive">Failed to load movie details.</div>;
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isFavorited = await getIsFavorited(movie.id);
    const reviews = await getReviews(movie.id);
    const providers = await getMovieWatchProviders(id);

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <div
                className="relative h-[60vh] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path || null, "original")})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

                <div className="container relative h-full flex flex-col md:flex-row items-end md:items-center gap-8 pb-8 md:pb-0 pt-20">
                    <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-48 md:w-72 rounded-lg shadow-2xl hidden md:block"
                    />
                    <div className="flex-1 space-y-4 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
                        <p className="text-xl text-muted-foreground italic">{movie.tagline}</p>

                        <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                <Star className="h-5 w-5 fill-current" />
                                {movie.vote_average.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-5 w-5" />
                                {new Date(movie.release_date).getFullYear()}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-5 w-5" />
                                {movie.runtime} min
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map(g => (
                                    <span key={g.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-lg leading-relaxed">{movie.overview}</p>

                        <div className="pt-4 flex gap-4">
                            <FavoriteButton
                                movieId={movie.id}
                                title={movie.title}
                                posterPath={movie.poster_path}
                                initialIsFavorited={isFavorited}
                                isLoggedIn={!!user}
                            />
                            <LogMovieDialog movie={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path
                            }} />
                            <AddToListDialog movie={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path
                            }} />
                            <VideoDialog videos={movie.videos?.results || []} />
                        </div>

                        <WatchProviders providers={providers} />

                    </div>
                </div>
            </div>

            <div className="container mt-12 space-y-12">
                {/* Cast */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {movie.credits.cast.slice(0, 10).map(actor => (
                            <Link href={`/person/${actor.id}`} key={actor.id} className="min-w-[140px] w-[140px] space-y-2 group">
                                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={getImageUrl(actor.profile_path)}
                                        alt={actor.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                    />
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{actor.name}</p>
                                    <p className="text-muted-foreground text-xs line-clamp-1">{actor.character}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Similar Movies */}
                {movie.similar.results.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movie.similar.results.slice(0, 5).map(m => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews Section */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

                    {user && (
                        <div className="mb-8">
                            <ReviewForm movieId={movie.id} />
                        </div>
                    )}

                    <ReviewList reviews={reviews} />
                </section>
            </div>
        </div>
    );
}
