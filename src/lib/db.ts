
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
        release_date: "",
        vote_average: 0,
    }));
}

export async function getUserStats(userId: string) {
    const supabase = await createClient()

    const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    const { data: recentReviews } = await supabase
        .from('reviews')
        .select('*, movie_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        favoritesCount: favoritesCount || 0,
        reviewsCount: reviewsCount || 0,
        recentReviews: recentReviews || []
    }
}
