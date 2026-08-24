import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Mail } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats } from "@/services/applications";
import type { DashboardStats as Stats } from "@/types/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchDashboardStats()
      .then((s) => active && setStats(s))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of mentorship applications"
    >
      <div className="space-y-6">
        <DashboardStats stats={stats} loading={loading} />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-base">Recent Applications</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/applications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<FileText className="h-8 w-8" />}
                title="No applications yet"
                description="Submitted Join Now forms will appear here."
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-base">Recent Messages</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/messages">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Mail className="h-8 w-8" />}
                title="No messages yet"
                description="Contact form submissions will appear here."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
