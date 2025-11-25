"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, ArrowRight, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push("/routes");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Image with Parallax-like feel */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="w-full max-w-[420px] p-1 relative z-10"
            >
                {/* Glass Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="p-8 md:p-10 relative z-10">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6 border border-white/20"
                            >
                                <Globe className="w-6 h-6 text-white" />
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl font-light text-white mb-3 tracking-tight"
                            >
                                Niche Travel
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-white/40 text-sm tracking-wide"
                            >
                                开启您的非凡之旅
                            </motion.p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-2"
                            >
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">邮箱</label>
                                <div className={`relative group transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02]' : ''}`}>
                                    <div className={`absolute inset-0 bg-white/5 rounded-xl transition-all duration-300 ${focusedInput === 'email' ? 'opacity-100 blur-sm bg-white/10' : 'opacity-0'}`} />
                                    <div className="relative flex items-center">
                                        <Mail className={`absolute left-4 w-4 h-4 transition-colors duration-300 ${focusedInput === 'email' ? 'text-white' : 'text-white/30'}`} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedInput('email')}
                                            onBlur={() => setFocusedInput(null)}
                                            placeholder="admin@nichetravel.com"
                                            className="w-full pl-11 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all text-sm font-light"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="space-y-2"
                            >
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">密码</label>
                                <div className={`relative group transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
                                    <div className={`absolute inset-0 bg-white/5 rounded-xl transition-all duration-300 ${focusedInput === 'password' ? 'opacity-100 blur-sm bg-white/10' : 'opacity-0'}`} />
                                    <div className="relative flex items-center">
                                        <Lock className={`absolute left-4 w-4 h-4 transition-colors duration-300 ${focusedInput === 'password' ? 'text-white' : 'text-white/30'}`} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedInput('password')}
                                            onBlur={() => setFocusedInput(null)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all text-sm font-light"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full py-6 text-sm font-medium bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-xl mt-2 relative overflow-hidden group"
                                    disabled={loading}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                                            />
                                            登录中...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            登录 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 text-center"
                        >
                            <a href="#" className="text-xs text-white/30 hover:text-white transition-colors duration-300">
                                忘记密码？
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 text-center w-full z-10"
            >
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
                    &copy; 2024 Niche Travel Inc.
                </p>
            </motion.div>
        </div>
    );
}
