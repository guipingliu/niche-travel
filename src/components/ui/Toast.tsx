'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // 触发入场动画
        requestAnimationFrame(() => {
            setIsVisible(true);
        });

        // 自动关闭
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // 等待退场动画完成
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!mounted) return null;

    const toastContent = (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 min-w-[320px] max-w-md">
            <div
                className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg shadow-lg
                    backdrop-blur-sm border transition-all duration-300 ease-out
                    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                    ${type === 'success'
                        ? 'bg-green-50/95 border-green-200 text-green-800'
                        : 'bg-red-50/95 border-red-200 text-red-800'
                    }
                `}
            >
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className={`
                        flex-shrink-0 rounded-md p-1 transition-colors
                        ${type === 'success'
                            ? 'hover:bg-green-100 text-green-600'
                            : 'hover:bg-red-100 text-red-600'
                        }
                    `}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return createPortal(toastContent, document.body);
}

interface ToastContainerState {
    message: string;
    type: ToastType;
    id: number;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastContainerState[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { message, type, id }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ top: `${1 + index * 5}rem` }}
                    className="fixed right-4 z-50"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </>
    );

    return {
        showToast,
        ToastContainer,
        success: (message: string) => showToast(message, 'success'),
        error: (message: string) => showToast(message, 'error'),
    };
}
