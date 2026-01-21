import { getFavorites } from "@/lib/db";
import MovieCard from "@/components/movie/MovieCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const movies = await getFavorites();

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        // We pass 'any' here effectively because our subset for favorites is smaller than full Movie type
                        // But MovieCard just needs a few fields primarily.
                        <MovieCard key={movie.id} movie={movie as any} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                    <p className="text-muted-foreground">Start adding movies to your list!</p>
                </div>
            )}
        </div>
    );
}
