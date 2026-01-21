'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dices, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
// We need a server action to get a random movie ID because we can't fetch easily in client
import { getRandomMovieId } from "@/app/actions";

export default function RandomPickerButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRandomPick = async () => {
        setIsLoading(true);
        try {
            const randomId = await getRandomMovieId();
            if (randomId) {
                router.push(`/movie/${randomId}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={handleRandomPick}
            disabled={isLoading}
            className="hidden md:flex gap-2"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dices className="w-4 h-4" />}
            Ne İzlesem?
        </Button>
    );
}
