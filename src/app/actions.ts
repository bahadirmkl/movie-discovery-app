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
