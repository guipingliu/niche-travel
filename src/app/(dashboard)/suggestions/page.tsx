import { getSuggestions } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Lightbulb, User, Calendar } from "lucide-react";

export default async function SuggestionsPage() {
    const suggestions = await getSuggestions();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">旅行锦囊</h2>
                    <p className="text-gray-500 mt-1">社区分享的旅行建议和文化指南。</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    新建锦囊
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-black">
                        <div className="flex items-start justify-between mb-4">
                            <Badge variant="secondary" className="mb-2">
                                {suggestion.category}
                            </Badge>
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                        </div>

                        <h3 className="text-xl font-bold mb-3">{suggestion.title}</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            {suggestion.content}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                <span>{suggestion.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                <span>{suggestion.createdAt}</span>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Add New Placeholder */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors cursor-pointer min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">添加快速建议</span>
                </div>
            </div>
        </div>
    );
}
