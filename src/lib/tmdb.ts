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
    videos: {
        results: { key: string; name: string; type: string; site: string }[];
    };
}

export interface Genre {
    id: number;
    name: string;
}

export interface PersonDetails {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    place_of_birth: string | null;
    profile_path: string | null;
    movie_credits: {
        cast: Movie[];
    };
}

export interface DiscoverParams {
    year?: string;
    minRating?: string;
    withGenres?: string;
    page?: string;
    query?: string;
}

// Helper for caching strategy (Next.js default fetch cache serves well for this MVP)
async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams({
        api_key: API_KEY!,
        language: 'en-US',
        ...params,
    });

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch data from TMDB: ${res.statusText}`);
    }

    return res.json();
}

export async function getTrendingMovies(page: number = 1): Promise<Movie[]> {
    const data = await fetchTMDB('/trending/movie/week', { page: page.toString() });
    return data.results;
}

export async function getMovie(id: string): Promise<MovieDetails> {
    const data = await fetchTMDB(`/movie/${id}`, {
        append_to_response: 'credits,similar,videos',
    });
    return data;
}

export async function searchMovies(query: string): Promise<Movie[]> {
    const data = await fetchTMDB('/search/movie', { query });
    return data.results;
}

export async function getGenres(): Promise<Genre[]> {
    const data = await fetchTMDB('/genre/movie/list');
    return data.genres;
}

export async function getMoviesByGenre(genreId: string, page: number = 1): Promise<Movie[]> {
    const data = await fetchTMDB('/discover/movie', {
        with_genres: genreId,
        page: page.toString()
    });
    return data.results;
}

export async function getPerson(id: string): Promise<PersonDetails> {
    const data = await fetchTMDB(`/person/${id}`, {
        append_to_response: 'movie_credits',
    });
    return data;
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
    if (!path) return '/placeholder-movie.jpg'; // You might want to add a placeholder image
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function discoverMovies(params: DiscoverParams): Promise<Movie[]> {
    const queryParams: Record<string, string> = {};

    if (params.year) queryParams['primary_release_year'] = params.year;
    if (params.minRating) queryParams['vote_average.gte'] = params.minRating;
    if (params.withGenres) queryParams['with_genres'] = params.withGenres;
    if (params.page) queryParams['page'] = params.page;

    queryParams['sort_by'] = 'popularity.desc';
    queryParams['vote_count.gte'] = '100';

    const data = await fetchTMDB('/discover/movie', queryParams);
    return data.results;
}
