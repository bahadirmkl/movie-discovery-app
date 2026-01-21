'use client';

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Genre {
    id: number;
    name: string;
}

interface GenreFilterProps {
    genres: Genre[];
}

export default function GenreFilter({ genres }: GenreFilterProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleGenreClick = (id: number) => {
        router.push(`/genre/${id}`);
    };

    const handleAllClick = () => {
        router.push('/');
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <Button
                variant={pathname === '/' ? "default" : "outline"}
                size="sm"
                onClick={handleAllClick}
                className="whitespace-nowrap rounded-full"
            >
                All
            </Button>
            {genres.map((genre) => (
                <Button
                    key={genre.id}
                    variant={pathname === `/genre/${genre.id}` ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleGenreClick(genre.id)}
                    className="whitespace-nowrap rounded-full"
                >
                    {genre.name}
                </Button>
            ))}
        </div>
    );
}
