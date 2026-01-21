import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Film } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/server";
import UserNav from "./UserNav";
import SearchInput from "@/components/search/SearchInput";

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Film className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            MovieApp
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Trending
                        </Link>
                    </nav>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <Film className="h-6 w-6" />
                            <span className="font-bold">MovieApp</span>
                        </Link>
                        <nav className="flex flex-col space-y-4 mt-8">
                            <Link href="/" className="text-foreground/60 transition-colors hover:text-foreground">
                                Trending
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <SearchInput />
                    </div>
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <UserNav user={user} />
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
