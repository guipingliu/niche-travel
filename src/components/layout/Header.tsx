"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 bg-white/50 backdrop-blur-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Page Title could go here */}
                <h1 className="text-lg font-semibold text-gray-800">管理控制台</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="搜索..."
                        className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-black/5 text-sm w-64 transition-all"
                    />
                </div>

                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-gray-900">管理员</p>
                        <p className="text-xs text-gray-500">超级管理员</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
