import { createClient } from "@/lib/supabase/server";
import { getDiaryLogs } from "@/app/actions";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { format } from "date-fns";

export default async function DiaryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const logs = await getDiaryLogs();

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Calendar className="w-8 h-8" />
                My Diary
            </h1>

            <div className="space-y-4">
                {logs.length > 0 ? (
                    logs.map((log: any) => (
                        <div key={log.id} className="flex gap-4 p-4 border-b hover:bg-muted/50 transition-colors">
                            <div className="flex-shrink-0 w-16 md:w-24 relative aspect-[2/3]">
                                <Image
                                    src={getImageUrl(log.movie_poster_path)}
                                    alt={log.movie_title}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <div className="flex-1 py-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{log.movie_title}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            Watched on {format(new Date(log.watched_on), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < log.rating ? "fill-green-500 text-green-500" : "text-muted-foreground/30"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {log.review && (
                                    <p className="mt-2 text-sm text-foreground/90 line-clamp-3">
                                        {log.review}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        Your diary is empty. Go log some movies!
                    </div>
                )}
            </div>
        </div>
    );
}
