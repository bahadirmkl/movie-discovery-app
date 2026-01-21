import Link from "next/link";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <Link href={`/movie/${movie.id}`}>
            <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg h-full border-none bg-accent/20">
                <div className="aspect-[2/3] relative">
                    <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 text-lg mb-1" title={movie.title}>
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(movie.release_date).getFullYear() || "N/A"}</span>
                        <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
