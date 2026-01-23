import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ExternalLink, Search } from "lucide-react";

// Quick Badge component since we didn't create it yet
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'Published': 'bg-green-100 text-green-800',
        'Draft': 'bg-yellow-100 text-yellow-800',
        'Optimized': 'bg-blue-100 text-blue-800',
        'Crawled': 'bg-slate-100 text-slate-800',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}

export default function ArticlesPage() {
    const articles = [
        { title: "AI SEO Nedir?", site: "tech-blog.com", status: "Published", views: 1205, date: "2024-01-20" },
        { title: "Next.js vs Remix", site: "tech-blog.com", status: "Optimized", views: 850, date: "2024-01-22" },
        { title: "SaaS Pazarlama Stratejileri", site: "saas-landing.io", status: "Crawled", views: 0, date: "2024-01-23" },
        { title: "E-Ticaret Dönüşüm Oranları", site: "ecommerce-shop.net", status: "Draft", views: 0, date: "2024-01-24" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">İçerikler</h2>
                    <p className="text-muted-foreground">Tüm sitelerinizdeki içeriklerin durumu.</p>
                </div>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Button variant="outline">Filtrele</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son İçerikler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {articles.map((article, i) => (
                            <div key={i} className="flex items-center">
                                <FileText className="h-9 w-9 text-muted-foreground bg-slate-100 p-2 rounded-full" />
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{article.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {article.site}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center space-x-4">
                                    <div className="text-sm text-muted-foreground flex items-center">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {article.date}
                                    </div>
                                    <StatusBadge status={article.status} />
                                    <Button size="sm" variant="ghost">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
