'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    baseUrl: string; // e.g. / or /genre/123
}

export default function Pagination({ currentPage, baseUrl }: PaginationProps) {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;

        // Construct simplified URL for now
        // If baseUrl already has params we need to be careful (e.g. /search?q=foo)
        // But for Home and Genre pages it's mostly path based or single param.
        // We assume baseUrl is clean path. 

        const separator = baseUrl.includes('?') ? '&' : '?';
        router.push(`${baseUrl}${separator}page=${newPage}`);
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">Page {currentPage}</span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
            // We don't know total pages easily without returning metadata from server actions
            // Simply assume there is a next page for infinite discovery feeling or until empty
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
