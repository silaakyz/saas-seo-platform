import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <header className="flex h-16 items-center border-b bg-card px-8">
                    <h2 className="text-lg font-semibold">Panel</h2>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
