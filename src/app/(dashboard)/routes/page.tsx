import Link from "next/link";
import { Plus, Calendar, Users, Zap } from "lucide-react";
import { getRoutes } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function RoutesPage() {
    const routes = await getRoutes();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">路线管理</h2>
                    <p className="text-gray-500 mt-1">管理您的独特旅行体验。</p>
                </div>
                <Link href="/routes/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        创建路线
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                    <Link key={route.id} href={`/routes/${route.id}`} className="block group">
                        <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={route.images[0]}
                                    alt={route.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                    ¥{route.price}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="font-normal">
                                        {route.duration}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                        <span>强度: {route.intensity}/5</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                    {route.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                    {route.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {route.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={route.giver.avatar}
                                            alt={route.giver.name}
                                            className="w-8 h-8 rounded-full bg-gray-100"
                                        />
                                        <div className="text-xs">
                                            <p className="font-medium text-gray-900">{route.giver.name}</p>
                                            <p className="text-gray-500">领队</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Users className="w-3 h-3" />
                                        <span>最多 {route.groupSize} 人</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
