import { getAttractions } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, MapPin, Star } from "lucide-react";

export default async function AttractionsPage() {
    const attractions = await getAttractions();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">景点库</h2>
                    <p className="text-gray-500 mt-1">发掘小众秘境和独特景点。</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    添加景点
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractions.map((attraction) => (
                    <Card key={attraction.id} className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={attraction.images[0]}
                                alt={attraction.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute top-3 right-3">
                                <Badge className="bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/30">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {attraction.hiddenGemScore}/10
                                </Badge>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <div className="flex items-center gap-1 text-xs text-gray-300 mb-2">
                                    <MapPin className="w-3 h-3" />
                                    {attraction.location}
                                </div>
                                <h3 className="text-xl font-bold mb-2 leading-tight">{attraction.name}</h3>
                                <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    {attraction.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                                    {attraction.vibeTags.map((tag) => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-1 rounded-sm backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
