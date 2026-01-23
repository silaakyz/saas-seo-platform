import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, Globe, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Otonom SEO motorunun anlık durumu.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-green-600">Sistem Aktif</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Site</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 bu ay eklendi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İşlenen İçerik</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">+180 yeni versiyon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Günlük Crawl</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+540</div>
            <p className="text-xs text-muted-foreground">Son 24 saat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Otonom Görevler</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground">Scheduler çalışıyor</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mockups */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Crawl Tamamlandı - site-{i}.com</p>
                    <p className="text-sm text-muted-foreground">
                      15 yeni makale bulundu, 3 link eklendi.
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">2dk önce</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sistem Sağlığı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span>Crawler Engine</span>
                <span className="text-green-600 font-bold">Ready</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Database</span>
                <span className="text-green-600 font-bold">Connected</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>AI Service (Mock)</span>
                <span className="text-yellow-600 font-bold">Limited</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Orchestrator</span>
                <span className="text-green-600 font-bold">Running</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
