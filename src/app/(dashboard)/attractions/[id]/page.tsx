import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, Save, Upload, MapPin, Star, Plus } from "lucide-react";
import Link from "next/link";

export default async function AttractionEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Mock data for now since we don't have a real backend fetch for single attraction yet in this view
    // In a real app, we would fetch based on params.id
    const attraction = {
        id: "a1",
        name: "The Forgotten Library",
        location: "Old Town District",
        description: "A private library hidden inside an old factory building. Only opens on weekends.",
        hiddenGemScore: 9,
        vibeTags: ["Quiet", "Retro", "Books"],
        images: ["https://images.unsplash.com/photo-1507842217121-9d59754baebc?auto=format&fit=crop&q=80&w=800"],
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Link
                    href="/attractions"
                    className="flex items-center text-sm text-gray-500 hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    返回景点库
                </Link>
                <Button>
                    <Save className="w-4 h-4 mr-2" />
                    保存更改
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">景点名称</label>
                            <input
                                type="text"
                                defaultValue={attraction.name}
                                className="w-full text-xl font-bold border-b border-gray-200 focus:border-black focus:outline-none py-2 bg-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                            <div className="relative">
                                <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    defaultValue={attraction.location}
                                    className="w-full pl-6 py-2 border-b border-gray-200 focus:border-black focus:outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                            <textarea
                                defaultValue={attraction.description}
                                rows={4}
                                className="w-full text-gray-600 border rounded-md p-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none"
                            />
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6">
                        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">小众指数</h3>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">秘境得分</label>
                                <span className="text-2xl font-bold text-black">{attraction.hiddenGemScore}<span className="text-sm text-gray-400 font-normal">/10</span></span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                defaultValue={attraction.hiddenGemScore}
                                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                分数越高，知道这个地方的人越少。
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">氛围标签</label>
                            <div className="flex flex-wrap gap-2">
                                {attraction.vibeTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-black hover:text-white transition-colors">
                                        {tag}
                                    </Badge>
                                ))}
                                <button className="text-xs border border-dashed border-gray-300 rounded-full px-3 py-1 text-gray-500 hover:border-gray-400 hover:text-gray-700">
                                    + 添加氛围
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-1 overflow-hidden">
                        <div className="aspect-[4/5] relative rounded-lg overflow-hidden group">
                            <img
                                src={attraction.images[0]}
                                alt={attraction.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" size="sm">
                                    <Upload className="w-4 h-4 mr-2" />
                                    更换封面
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                <Plus className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
