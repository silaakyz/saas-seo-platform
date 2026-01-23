import Link from "next/link";
import { LayoutDashboard, Globe, FileText, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Sitelerim", icon: Globe, href: "/sites" },
    { name: "İçerikler", icon: FileText, href: "/articles" },
    { name: "Crawler Durumu", icon: Activity, href: "/crawler" },
    { name: "Ayarlar", icon: Settings, href: "/settings" },
];

export function Sidebar() {
    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-primary">AutoSEO.ai</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
