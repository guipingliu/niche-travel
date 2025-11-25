// src/components/providers/ToastProvider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastType } from "@/components/ui/Toast";



interface ToastContextProps {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

interface ProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ProviderProps> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<ToastType>("success");
    const [visible, setVisible] = useState(false);

    const showToast = (type: ToastType, message: string) => {
        setToastType(type);
        setToastMessage(message);
        setVisible(true);
        // hide after 3 seconds
        setTimeout(() => setVisible(false), 3000);
    };

    const contextValue: ToastContextProps = {
        success: (msg) => showToast("success", msg),
        error: (msg) => showToast("error", msg),
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {visible && <Toast type={toastType} message={toastMessage} onClose={() => setVisible(false)} />}
        </ToastContext.Provider>
    );
};
