'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    movieId: number
    title: string
    posterPath: string
    initialIsFavorited: boolean
    isLoggedIn: boolean
}

export default function FavoriteButton({
    movieId,
    title,
    posterPath,
    initialIsFavorited,
    isLoggedIn,
}: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleToggle = async () => {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        // Optimistic update
        const newState = !isFavorited
        setIsFavorited(newState)

        startTransition(async () => {
            try {
                const result = await toggleFavorite({
                    id: movieId,
                    title,
                    poster_path: posterPath,
                })

                // Ensure state matches server response if something went wrong or logic differs
                setIsFavorited(result.isFavorited)
            } catch (error) {
                // Revert on error
                setIsFavorited(!newState)
                console.error(error);
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "rounded-full transition-colors",
                isFavorited && "bg-red-50 hover:bg-red-100 border-red-200"
            )}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "h-6 w-6 transition-colors",
                    isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
            />
            <span className="sr-only">Toggle Favorite</span>
        </Button>
    )
}
