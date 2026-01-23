import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings, Trash2 } from "lucide-react";

export default function SitesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Siteler</h2>
                    <p className="text-muted-foreground">Platforma bağlı web sitelerinizi yönetin.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Site Ekle
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {['tech-blog.com', 'saas-landing.io', 'ecommerce-shop.net'].map((site, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-bold">{site}</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                Son tarama: 10 dakika önce
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span>Pages: 45</span>
                                <span className="text-green-600">Active</span>
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <Button size="sm" variant="outline" className="w-full">
                                    Raporu Gör
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Simple variant prop support for button if we expand it later
// Currently ignoring variant prop in Button component for MVP simplicity
