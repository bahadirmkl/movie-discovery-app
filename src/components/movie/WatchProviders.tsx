import { WatchProvidersResult, getImageUrl } from "@/lib/tmdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorPlay, CreditCard, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface WatchProvidersProps {
    providers: WatchProvidersResult | null;
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
    if (!providers) return null;

    const hasStream = providers.flatrate && providers.flatrate.length > 0;
    const hasRent = providers.rent && providers.rent.length > 0;
    const hasBuy = providers.buy && providers.buy.length > 0;

    if (!hasStream && !hasRent && !hasBuy) return null;

    return (
        <Card className="mt-8">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5 text-primary" />
                    Where to Watch
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {hasStream && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                            Stream
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {providers.flatrate!.map((provider) => (
                                <div key={provider.provider_id} className="flex flex-col items-center gap-1 w-12">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                                        <Image
                                            src={getImageUrl(provider.logo_path, 'original')}
                                            alt={provider.provider_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-[10px] text-center leading-tight line-clamp-2 w-full text-muted-foreground">
                                        {provider.provider_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasRent && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> Rent
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {providers.rent!.map((provider) => (
                                <div key={provider.provider_id} className="flex flex-col items-center gap-1 w-12">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                                        <Image
                                            src={getImageUrl(provider.logo_path, 'original')}
                                            alt={provider.provider_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-[10px] text-center leading-tight line-clamp-2 w-full text-muted-foreground">
                                        {provider.provider_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasBuy && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                            <ShoppingCart className="w-3 h-3" /> Buy
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {providers.buy!.map((provider) => (
                                <div key={provider.provider_id} className="flex flex-col items-center gap-1 w-12">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                                        <Image
                                            src={getImageUrl(provider.logo_path, 'original')}
                                            alt={provider.provider_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-[10px] text-center leading-tight line-clamp-2 w-full text-muted-foreground">
                                        {provider.provider_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t mt-4">
                    Data provided by <a href="https://www.justwatch.com" target="_blank" className="underline hover:text-white">JustWatch</a>
                </div>
            </CardContent>
        </Card>
    );
}
