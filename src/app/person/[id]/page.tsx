import { getPerson, getImageUrl } from "@/lib/tmdb";
import MovieCard from "@/components/movie/MovieCard";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    // We could fetch here for dynamic title but for speed/simplicity:
    return {
        title: "Person Details",
    };
}

export default async function PersonPage({ params }: PageProps) {
    const { id } = await params;
    let person;

    try {
        person = await getPerson(id);
    } catch (error) {
        return <div className="container py-8 text-destructive">Failed to load person details.</div>;
    }

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="flex-shrink-0">
                    <img
                        src={getImageUrl(person.profile_path)}
                        alt={person.name}
                        className="w-48 md:w-72 rounded-lg shadow-xl object-cover"
                    />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{person.name}</h1>
                    {person.birthday && (
                        <p className="text-muted-foreground">
                            Born: {person.birthday} {person.place_of_birth && `in ${person.place_of_birth}`}
                        </p>
                    )}

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-xl font-semibold mb-2">Biography</h3>
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {person.biography || "No biography available."}
                        </p>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-2xl font-bold mb-6">Known For</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* Sort by popularity or release date? TMDB sends credits unsorted or strictly by ID sometimes. 
                        Usually we want most popular. TMDB doesn't return popularity in basic credits always.
                        Let's just show them. Limiting to 20 for briefness or showing all?
                        Let's format dates.
                    */}
                    {person.movie_credits.cast
                        .filter(m => m.poster_path) // Only show movies with posters
                        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)) // Sort by rating roughly
                        .slice(0, 20)
                        .map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                </div>
            </section>
        </div>
    );
}
