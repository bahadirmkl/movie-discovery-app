
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    user_email: string;
    rating: number;
    comment: string | null;
    created_at: string;
}

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border rounded-xl bg-card/50">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-xl border space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>
                                    {review.user_email?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">
                                    {review.user_email?.split('@')[0] || "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {review.comment && (
                        <p className="text-foreground/90 leading-relaxed text-sm">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
