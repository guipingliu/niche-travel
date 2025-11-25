"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Compass, Lightbulb, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "路线管理", href: "/routes", icon: Map },
    { label: "景点库", href: "/attractions", icon: Compass },
    { label: "旅行锦囊", href: "/suggestions", icon: Lightbulb },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-xl tracking-tight">Niche Travel</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-black text-white shadow-lg shadow-black/10"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-black")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">设置</span>
                </button>
                <button
                    onClick={() => {
                        // Simulate logout delay
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 500);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">退出登录</span>
                </button>
            </div>
        </aside>
    );
}
