'use client';

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Check if this exists, might need standard textarea
import { addReview } from "@/app/actions";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    movieId: number;
}

export default function ReviewForm({ movieId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a rating");

        setIsSubmitting(true);
        try {
            await addReview(movieId, rating, comment);
            setComment("");
            setRating(0);
        } catch (error) {
            console.error(error);
            alert("Failed to post review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border">
            <h3 className="text-xl font-semibold">Write a Review</h3>

            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={cn(
                                "w-8 h-8 transition-colors",
                                (hoverRating || rating) >= star
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted-foreground"
                            )}
                        />
                    </button>
                ))}
            </div>

            <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Share your thoughts about the movie..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Review"}
            </Button>
        </form>
    );
}
