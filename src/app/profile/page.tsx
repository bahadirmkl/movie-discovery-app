import { createClient } from "@/lib/supabase/server";
import { getUserStats } from "@/lib/db";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const stats = await getUserStats(user.id);

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Card */}
                <Card className="w-full md:w-1/3">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src="" /> {/* Add avatar upload later */}
                            <AvatarFallback className="text-2xl">{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.email?.split('@')[0]}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Heart className="w-4 h-4" />
                                <span>Favorites</span>
                            </div>
                            <span className="font-bold">{stats.favoritesCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                <span>Reviews</span>
                            </div>
                            <span className="font-bold">{stats.reviewsCount}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>

                    {stats.recentReviews.length > 0 ? (
                        <div className="grid gap-4">
                            {stats.recentReviews.map((review: any) => (
                                <Card key={review.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm italic mb-2">"{review.comment}"</p>
                                        <Link
                                            href={`/movie/${review.movie_id}`}
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            View Movie
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                            No recent activity. Start reviewing movies!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
