'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdvancedFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [year, setYear] = useState(searchParams.get("year") || "");
    const [minRating, setMinRating] = useState(Number(searchParams.get("rating")) || 5);
    const [genre, setGenre] = useState(searchParams.get("genre") || "");
    const [isOpen, setIsOpen] = useState(false);

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (year) params.set("year", year);
        if (minRating > 0) params.set("rating", minRating.toString());
        if (genre) params.set("genre", genre);

        // We navigate to /search, but wait, /search is typically for query. 
        // Let's use /search for discovery too or create /discover? 
        // Let's keep /search but support these params.
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "Hide Filters" : "Advanced Filters"}
                </Button>
            </div>

            {isOpen && (
                <div className="bg-card p-4 rounded-lg border grid grid-cols-1 md:grid-cols-4 gap-4 items-end animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 2023"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min={1900}
                            max={2030}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Min Rating: {minRating}</Label>
                        <Slider
                            defaultValue={[minRating]}
                            max={10}
                            step={1}
                            onValueChange={(vals) => setMinRating(vals[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Genre</Label>
                        {/* Hardcoded for MVP speed, ideally fetch from API */}
                        <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="28">Action</SelectItem>
                                <SelectItem value="12">Adventure</SelectItem>
                                <SelectItem value="16">Animation</SelectItem>
                                <SelectItem value="35">Comedy</SelectItem>
                                <SelectItem value="80">Crime</SelectItem>
                                <SelectItem value="18">Drama</SelectItem>
                                <SelectItem value="27">Horror</SelectItem>
                                <SelectItem value="878">Sci-Fi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleFilter} className="w-full">
                        Apply Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
