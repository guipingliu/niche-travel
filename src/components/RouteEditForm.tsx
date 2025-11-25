'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ChevronLeft, Save, Plus, GripVertical, Trash2, Map as MapIcon, ImageIcon } from "lucide-react";
import Link from "next/link";
import type { Route, RouteDay, Activity } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";

export default function RouteEditForm({ initialRoute }: { initialRoute: Route }) {
    const router = useRouter();
    const { success, error: showError } = useToast();
    const [route, setRoute] = useState<Route>(initialRoute);
    const [isSaving, setIsSaving] = useState(false);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !route.tags.includes(trimmed)) {
            setRoute(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setRoute(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // 处理基本字段更新
    const updateField = (field: keyof Route, value: any) => {
        setRoute(prev => ({ ...prev, [field]: value }));
    };

    // 处理行程天数更新
    const updateItineraryDay = (dayIndex: number, field: keyof RouteDay, value: any) => {
        setRoute(prev => ({
            ...prev,
            itinerary: prev.itinerary.map((day, idx) =>
                idx === dayIndex ? { ...day, [field]: value } : day
            )
        }));
    };

    // 处理活动更新
    const updateActivity = (dayIndex: number, activityIndex: number, field: keyof Activity, value: any) => {
        setRoute(prev => ({
            ...prev,
            itinerary: prev.itinerary.map((day, dIdx) =>
                dIdx === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.map((act, aIdx) =>
                            aIdx === activityIndex ? { ...act, [field]: value } : act
                        )
                    }
                    : day
            )
        }));
    };

    // 删除活动
    const deleteActivity = (dayIndex: number, activityIndex: number) => {
        setRoute(prev => ({
            ...prev,
            itinerary: prev.itinerary.map((day, dIdx) =>
                dIdx === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex)
                    }
                    : day
            )
        }));
    };

    // 添加活动
    const addActivity = (dayIndex: number) => {
        setRoute(prev => ({
            ...prev,
            itinerary: prev.itinerary.map((day, dIdx) =>
                dIdx === dayIndex
                    ? {
                        ...day,
                        activities: [...day.activities, { name: '新活动' }]
                    }
                    : day
            )
        }));
    };

    // 添加天数
    const addDay = () => {
        const newDay: RouteDay = {
            id: `temp-${Date.now()}`,
            day: route.itinerary.length + 1,
            title: `第 ${route.itinerary.length + 1} 天`,
            description: '',
            activities: []
        };
        setRoute(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, newDay]
        }));
    };

    // 保存更改
    const handleSave = async () => {
        setIsSaving(true);

        // Handle pending tag
        let finalRoute = { ...route };
        const trimmedTag = newTag.trim();
        if (trimmedTag && !finalRoute.tags.includes(trimmedTag)) {
            finalRoute.tags = [...finalRoute.tags, trimmedTag];
        }

        try {
            const response = await fetch(`/api/routes/${route.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalRoute),
            });

            if (!response.ok) {
                throw new Error('保存失败');
            }

            const updatedRoute = await response.json();
            setRoute(updatedRoute);

            // 显示成功提示
            success('保存成功!');

            // 延迟返回列表页,让用户看到成功提示
            setTimeout(() => {
                router.push('/routes');
            }, 1500);
        } catch (err) {
            console.error('保存失败:', err);
            showError('保存失败,请重试');
        } finally {
            setIsSaving(false);
        }
    };

    // 放弃更改
    const handleCancel = () => {
        if (confirm('确定要放弃所有更改吗?')) {
            // 重置为初始数据
            setRoute(initialRoute);
            // 或者返回列表页
            router.push('/routes');
        }
    };

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
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        放弃
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? '保存中...' : '保存更改'}
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
                            {route.images[0] ? (
                                <img src={route.images[0]} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-sm">点击上传封面图片</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="更换封面图片"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">路线标题</label>
                            <input
                                type="text"
                                value={route.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full text-2xl font-bold border-b border-gray-200 focus:border-black focus:outline-none py-2 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                            <textarea
                                value={route.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                rows={4}
                                className="w-full text-gray-600 border rounded-md p-3 focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none"
                            />
                        </div>
                    </Card>

                    {/* Generated Map */}
                    {route.mapImage && (
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-gray-500" />
                                <h3 className="font-semibold text-gray-900">路线地图</h3>
                            </div>
                            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={route.mapImage} alt="Route Map" className="w-full h-full object-cover" />
                            </div>
                        </Card>
                    )}

                    {/* Itinerary Builder */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">行程安排</h3>
                            <Button variant="outline" size="sm" onClick={addDay}>
                                <Plus className="w-4 h-4 mr-2" />
                                添加天数
                            </Button>
                        </div>

                        {route.itinerary.map((day, dayIndex) => (
                            <Card key={day.id} className="p-6 relative group">
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
                                                onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                                                className="font-semibold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-black focus:outline-none flex-1"
                                            />
                                        </div>
                                        <textarea
                                            value={day.description}
                                            onChange={(e) => updateItineraryDay(dayIndex, 'description', e.target.value)}
                                            className="w-full text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none"
                                            rows={2}
                                        />

                                        <div className="space-y-2 pl-4 border-l border-gray-100">
                                            {day.activities.map((activity, actIndex) => (
                                                <div key={actIndex} className="flex items-center gap-2 group/act">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/act:bg-black transition-colors" />
                                                    <div className="flex-1 flex items-center gap-2">
                                                        {activity.image && (
                                                            <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <input
                                                            type="text"
                                                            value={activity.name}
                                                            onChange={(e) => updateActivity(dayIndex, actIndex, 'name', e.target.value)}
                                                            className="flex-1 text-sm bg-transparent border-none p-0 focus:ring-0 text-gray-700"
                                                        />
                                                        {!activity.image && (
                                                            <ImageIcon className="w-4 h-4 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => deleteActivity(dayIndex, actIndex)}
                                                        className="opacity-0 group-hover/act:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addActivity(dayIndex)}
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
                                        value={route.price}
                                        onChange={(e) => updateField('price', parseInt(e.target.value))}
                                        className="w-full pl-7 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">成团人数</label>
                                <input
                                    type="number"
                                    value={route.groupSize}
                                    onChange={(e) => updateField('groupSize', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">强度 (1-5)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={route.intensity}
                                    onChange={(e) => updateField('intensity', parseInt(e.target.value))}
                                    className="w-full accent-black"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>轻松</span>
                                    <span className="font-medium text-black">{route.intensity}</span>
                                    <span>极强</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">标签</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {route.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-gray-200">
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
                        <div className="flex items-center gap-3">
                            <img
                                src={route.giver.avatar}
                                alt={route.giver.name}
                                className="w-10 h-10 rounded-full bg-gray-100"
                            />
                            <div>
                                <p className="font-medium text-sm">{route.giver.name}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{route.giver.bio}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                            更换领队
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
