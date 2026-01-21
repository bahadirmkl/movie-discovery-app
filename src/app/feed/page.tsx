import { getDiaryLogs } from "@/app/actions"; // getDiaryLogs handles empty user logic for global feed
import { Card, CardContent } from "@/components/ui/card";
import { Star, Activity } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function FeedPage() {
    const logs = await getDiaryLogs(); // Fetch all logs

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Activity className="w-8 h-8" />
                Activity Feed
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logs.length > 0 ? (
                    logs.map((log: any) => (
                        <Card key={log.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="flex">
                                <Link href={`/movie/${log.movie_id}`} className="w-1/3 relative aspect-[2/3]">
                                    <Image
                                        src={getImageUrl(log.movie_poster_path)}
                                        alt={log.movie_title}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold line-clamp-1 mb-1">
                                            <Link href={`/movie/${log.movie_id}`} className="hover:underline">
                                                {log.movie_title}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < log.rating ? "fill-green-500 text-green-500" : "text-muted-foreground/30"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {log.review && (
                                            <p className="text-sm italic text-foreground/80 line-clamp-3 mb-2">
                                                "{log.review}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                                        <Avatar className="w-6 h-6">
                                            <AvatarFallback className="text-[10px]">U</AvatarFallback>
                                        </Avatar>
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">A User</span> watched {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No activity yet. Be the first to log a movie!
                    </div>
                )}
            </div>
        </div>
    );
}
