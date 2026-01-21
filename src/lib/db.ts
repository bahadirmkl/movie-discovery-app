
import { createClient } from "@/lib/supabase/server";

export async function getFavorites() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!data) return [];

    // Transform to match Movie interface somewhat or just return what we have.
    // We stored minimal info.
    return data.map(f => ({
        id: f.movie_id,
        title: f.movie_title,
        poster_path: f.movie_poster_path,
        release_date: "", // We didn't store this, but MovieCard handles missing dates gracefully or we could update schema
        vote_average: 0, // We didn't store this
    }));
}
