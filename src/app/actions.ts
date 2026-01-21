'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(movie: {
    id: number
    title: string
    poster_path: string
}) {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('User must be logged in to favorite movies')
    }

    // Check if already favorited
    const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movie.id)
        .single()

    if (existingFavorite) {
        // Remove if exists
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('movie_id', movie.id)

        if (error) throw new Error(error.message)

        revalidatePath(`/movie/${movie.id}`)
        return { isFavorited: false }
    } else {
        // Add if not exists
        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: user.id,
                movie_id: movie.id,
                movie_title: movie.title,
                movie_poster_path: movie.poster_path,
            })

        if (error) throw new Error(error.message)

        revalidatePath(`/movie/${movie.id}`)
        return { isFavorited: true }
    }
}

export async function getIsFavorited(movieId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single()

    return !!data
}

export async function addReview(movieId: number, rating: number, comment: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('User must be logged in to review')
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            movie_id: movieId,
            rating,
            comment,
            user_email: user.email,
        })

    if (error) throw new Error(error.message)

    revalidatePath(`/movie/${movieId}`)
    return { success: true }
}

export async function getReviews(movieId: number) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false })

    return data || []
}

export async function getRandomMovieId() {
    // Fetch a random page from 1 to 500 (TMDB limit)
    const randomPage = Math.floor(Math.random() * 500) + 1;
    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

    try {
        const res = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&vote_count.gte=100&page=${randomPage}`, { next: { revalidate: 0 } }); // No cache for random
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const randomMovieIndex = Math.floor(Math.random() * data.results.length);
            return data.results[randomMovieIndex].id;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function logMovie(movie: { id: number; title: string; poster_path: string }, rating: number, review: string, date: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Must be logged in to log movies')

    const { error } = await supabase
        .from('diary')
        .insert({
            user_id: user.id,
            movie_id: movie.id,
            movie_title: movie.title,
            movie_poster_path: movie.poster_path,
            rating,
            review,
            watched_on: date
        })

    if (error) throw new Error(error.message)

    revalidatePath('/diary')
    revalidatePath(`/movie/${movie.id}`)
    return { success: true }
}

export async function getDiaryLogs(userId?: string) {
    const supabase = await createClient()
    let query = supabase.from('diary').select('*').order('watched_on', { ascending: false })

    if (userId) {
        query = query.eq('user_id', userId)
    } else {
        // If no userId, get current user's diary
        const { data: { user } } = await supabase.auth.getUser()
        if (user) query = query.eq('user_id', user.id)
        else return []
    }

    const { data } = await query
    return data || []
}

export async function createList(title: string, description: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { error } = await supabase
        .from('lists')
        .insert({
            user_id: user.id,
            title,
            description
        })

    if (error) throw new Error(error.message)
    revalidatePath('/lists')
    return { success: true }
}

export async function getUserLists() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('lists')
        .select('*, list_items(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function addMovieToList(listId: number, movie: { id: number; title: string; poster_path: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Must be logged in')

    const { data: list } = await supabase
        .from('lists')
        .select('user_id')
        .eq('id', listId)
        .single()

    if (!list || list.user_id !== user.id) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('list_items')
        .insert({
            list_id: listId,
            movie_id: movie.id,
            movie_title: movie.title,
            movie_poster_path: movie.poster_path
        })

    if (error) {
        if (error.code === '23505') return { success: false, message: 'Movie already in list' }
        throw new Error(error.message)
    }

    revalidatePath('/lists')
    return { success: true }
}
