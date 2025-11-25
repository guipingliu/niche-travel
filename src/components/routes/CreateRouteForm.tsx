"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft, Save, Plus, GripVertical, Trash2, Upload, Map as MapIcon, ImageIcon } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import Link from "next/link";
import { Giver } from "@/types";

interface CreateRouteFormProps {
    givers: Giver[];
}

export function CreateRouteForm({ givers }: CreateRouteFormProps) {
    const { success, error: showError } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [groupSize, setGroupSize] = useState<number>(10);
    const [intensity, setIntensity] = useState<number>(1);
    // 保存所有图片（包括封面）
    const [images, setImages] = useState<string[]>([]);
    const [selectedGiverId, setSelectedGiverId] = useState<string>(givers[0]?.id || "");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");

    // Itinerary State
    const [itinerary, setItinerary] = useState([
        { day: 1, title: "第一天", description: "", activities: [{ name: "", image: "" }] }
    ]);

    const handleAddTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleAddDay = () => {
        setItinerary([
            ...itinerary,
            { day: itinerary.length + 1, title: `第 ${itinerary.length + 1} 天`, description: "", activities: [{ name: "", image: "" }] }
        ]);
    };

    const handleUpdateDay = (index: number, field: string, value: string) => {
        const newItinerary = [...itinerary];
        // @ts-ignore
        newItinerary[index][field] = value;
        setItinerary(newItinerary);
    };

    const handleAddActivity = (dayIndex: number) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities.push({ name: "", image: "" });
        setItinerary(newItinerary);
    };

    const handleUpdateActivity = (dayIndex: number, activityIndex: number, field: string, value: string) => {
        const newItinerary = [...itinerary];
        // @ts-ignore
        newItinerary[dayIndex].activities[activityIndex][field] = value;
        setItinerary(newItinerary);
    };

    const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
        const newItinerary = [...itinerary];
        newItinerary[dayIndex].activities.splice(activityIndex, 1);
        setItinerary(newItinerary);
    };

    const handleSubmit = async () => {
        setLoading(true);

        // Handle pending tag
        let finalTags = [...tags];
        const trimmedTag = newTag.trim();
        if (trimmedTag && !finalTags.includes(trimmedTag)) {
            finalTags.push(trimmedTag);
        }

        try {
            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    price,
                    duration: '',
                    intensity,
                    groupSize,
                    tags: finalTags,
                    images,
                    nextDeparture: null,
                    mapImage: null,
                    giverId: selectedGiverId,
                    itinerary,
                }),
            });
            if (!response.ok) throw new Error('创建失败');
            const data = await response.json();
            success('路线创建成功!');
            router.push('/routes');
        } catch (err) {
            console.error(err);
            showError('创建路线失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const selectedGiver = givers.find(g => g.id === selectedGiverId);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link
                    href="/routes"
                    className="flex items-center text-sm text-gray-500 hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    返回路线列表
                </Link>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.back()}>取消</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "创建中..." : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                创建路线
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="p-6 space-y-6">
                        {/* Cover Image Upload */}
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer border-2 border-dashed border-gray-200 hover:border-black transition-colors">
                            {coverImage ? (
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-sm">点击上传封面图片</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const result = reader.result as string;
                                        setCoverImage(result);
                                        setImages((prev) => [...prev, result]);
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">路线标题</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例如：上海弄堂深度游"
                                className="w-full text-2xl font-bold border-b border-gray-200 focus:border-black focus:outline-none py-2 bg-transparent placeholder:text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="输入路线的详细描述..."
                                rows={4}
                                className="w-full text-gray-600 border rounded-md p-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none"
                            />
                        </div>
                    </Card>

                    {/* Itinerary Builder */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">行程安排</h3>
                            <Button variant="outline" size="sm" onClick={handleAddDay}>
                                <Plus className="w-4 h-4 mr-2" />
                                添加天数
                            </Button>
                        </div>

                        {itinerary.map((day, index) => (
                            <Card key={index} className="p-6 relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 group-hover:bg-black transition-colors rounded-l-xl" />
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary">第 {day.day} 天</Badge>
                                            <input
                                                type="text"
                                                value={day.title}
                                                onChange={(e) => handleUpdateDay(index, "title", e.target.value)}
                                                className="font-semibold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-black focus:outline-none flex-1"
                                            />
                                        </div>
                                        <textarea
                                            value={day.description}
                                            onChange={(e) => handleUpdateDay(index, "description", e.target.value)}
                                            placeholder="当天的简要描述..."
                                            className="w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-gray-300"
                                            rows={2}
                                        />

                                        <div className="space-y-2 pl-4 border-l border-gray-100">
                                            {day.activities.map((activity, actIndex) => (
                                                <div key={actIndex} className="flex items-center gap-2 group/act">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/act:bg-black transition-colors" />
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={activity.name}
                                                            onChange={(e) => handleUpdateActivity(index, actIndex, "name", e.target.value)}
                                                            placeholder="具体的活动安排..."
                                                            className="flex-1 text-sm bg-transparent border-none p-0 focus:ring-0 text-gray-700 placeholder:text-gray-300"
                                                        />
                                                        <div className="relative">
                                                            <button className={`p-1 rounded-md transition-colors ${activity.image ? 'text-blue-600 bg-blue-50' : 'text-gray-300 hover:text-gray-500'}`}>
                                                                <ImageIcon className="w-4 h-4" />
                                                            </button>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                title="上传活动图片"
                                                                onChange={(e) => {
                                                                    if (e.target.files?.[0]) {
                                                                        const url = URL.createObjectURL(e.target.files[0]);
                                                                        handleUpdateActivity(index, actIndex, "image", url);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveActivity(index, actIndex)}
                                                        className="opacity-0 group-hover/act:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleAddActivity(index)}
                                                className="text-xs text-blue-600 hover:underline flex items-center mt-2"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                添加活动
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <Card className="p-6 space-y-6">
                        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">设置</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">价格 (元)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full pl-7 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">成团人数</label>
                                <input
                                    type="number"
                                    value={groupSize}
                                    onChange={(e) => setGroupSize(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">强度 (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value))}
                                    className="w-full accent-black"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>轻松</span>
                                    <span>极强</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">标签</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                                            {tag}
                                            <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">×</button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="新标签"
                                        className="flex-1 text-xs border rounded px-2 py-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="text-xs border border-dashed border-gray-300 rounded px-2 py-1 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-4">领队</h3>
                        <select
                            className="w-full p-2 border rounded-md text-sm mb-4"
                            value={selectedGiverId}
                            onChange={(e) => setSelectedGiverId(e.target.value)}
                        >
                            {givers.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>

                        {selectedGiver && (
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedGiver.avatar}
                                    alt={selectedGiver.name}
                                    className="w-10 h-10 rounded-full bg-gray-100"
                                />
                                <div>
                                    <p className="font-medium text-sm">{selectedGiver.name}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">{selectedGiver.bio}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
