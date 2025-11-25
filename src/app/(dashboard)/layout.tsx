import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/providers/ToastProvider";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-8 mt-16">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
