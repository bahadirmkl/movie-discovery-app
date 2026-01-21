const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    backdrop_path?: string;
    genre_ids?: number[];
}

export interface MovieDetails extends Movie {
    genres: { id: number; name: string }[];
    runtime: number;
    tagline: string;
    credits: {
        cast: { id: number; name: string; character: string; profile_path: string | null }[];
    };
    similar: {
        results: Movie[];
    };
}

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams({
        api_key: API_KEY!,
        language: 'en-US',
        ...params,
    });

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch data from TMDB: ${res.statusText}`);
    }

    return res.json();
}

export async function getTrendingMovies(): Promise<Movie[]> {
    const data = await fetchTMDB('/trending/movie/week');
    return data.results;
}

export async function getMovie(id: string): Promise<MovieDetails> {
    const data = await fetchTMDB(`/movie/${id}`, {
        append_to_response: 'credits,similar',
    });
    return data;
}

export async function searchMovies(query: string): Promise<Movie[]> {
    const data = await fetchTMDB('/search/movie', { query });
    return data.results;
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
    if (!path) return '/placeholder-movie.jpg'; // You might want to add a placeholder image
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
