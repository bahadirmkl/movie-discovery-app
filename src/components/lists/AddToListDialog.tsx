'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListPlus, Check, Loader2 } from "lucide-react";
import { getUserLists, addMovieToList } from "@/app/actions";
import { cn } from "@/lib/utils";

interface AddToListDialogProps {
    movie: {
        id: number;
        title: string;
        poster_path: string;
    };
}

export default function AddToListDialog({ movie }: AddToListDialogProps) {
    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addingToListId, setAddingToListId] = useState<number | null>(null);

    // Fetch lists when dialog opens
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            getUserLists()
                .then(data => {
                    setLists(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [open]);

    const handleAdd = async (listId: number) => {
        setAddingToListId(listId);
        try {
            await addMovieToList(listId, movie);
            // Ideally show success state, but for now just maybe disable or show check
            // For MVP, simple alert or toast. Let's toggle icon.
            alert("Added to list!");
            setOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to add to list");
        } finally {
            setAddingToListId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <ListPlus className="w-4 h-4" />
                    Add to List
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : lists.length > 0 ? (
                        <div className="grid gap-2">
                            {lists.map(list => (
                                <Button
                                    key={list.id}
                                    variant="ghost"
                                    className="w-full justify-start text-left h-auto py-3 px-4 flex flex-col items-start gap-1"
                                    onClick={() => handleAdd(list.id)}
                                    disabled={!!addingToListId}
                                >
                                    <span className="font-semibold">{list.title}</span>
                                    <span className="text-xs text-muted-foreground">{list.list_items?.[0]?.count || 0} movies</span>
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-4">
                            No lists found. Create one in your profile!
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
