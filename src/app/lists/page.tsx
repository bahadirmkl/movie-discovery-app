import { createClient } from "@/lib/supabase/server";
import { getUserLists } from "@/app/actions";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";
import CreateListDialog from "@/components/lists/CreateListDialog";

export default async function ListsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const lists = await getUserLists();

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <List className="w-8 h-8" />
                    My Lists
                </h1>
                <CreateListDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.length > 0 ? (
                    lists.map((list: any) => (
                        <Card key={list.id} className="hover:bg-muted/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="group-hover:text-primary transition-colors">{list.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {list.description || "No description"}
                                </p>
                                <p className="text-xs font-semibold">
                                    {list.list_items?.[0]?.count || 0} movies
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-dashed border-2 rounded-lg">
                        You haven't created any lists yet.
                    </div>
                )}
            </div>
        </div>
    );
}
