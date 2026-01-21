'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // specific import if needed, or use native
import { CalendarIcon, Star, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { logMovie } from "@/app/actions";

interface LogMovieDialogProps {
    movie: {
        id: number;
        title: string;
        poster_path: string;
    };
}

export default function LogMovieDialog({ movie }: LogMovieDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await logMovie(movie, rating, review, date);
            setOpen(false);
            // Reset form
            setRating(0);
            setReview("");
        } catch (error) {
            console.error(error);
            alert("Failed to log movie");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4" />
                    Log or Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log {movie.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Watched On</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full justify-start text-left font-normal"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            rating >= star
                                                ? "fill-green-500 text-green-500"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Review (Optional)</label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Add your thoughts..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging..." : "Log Movie"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
