'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";

interface VideoDialogProps {
    videos: { key: string; name: string; type: string; site: string }[];
}

export default function VideoDialog({ videos }: VideoDialogProps) {
    const trailer = videos.find(
        (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );

    if (!trailer) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="rounded-full gap-2 text-lg px-8">
                    <Play className="fill-current w-5 h-5" />
                    Watch Trailer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none overflow-hidden">
                <div className="aspect-video w-full">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                        title={trailer.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="border-none"
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
}
