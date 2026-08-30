import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats, fetchApplications } from "@/services/applications";
import { fetchMessages } from "@/services/messages";
import type {
  DashboardStats as Stats,
  MentorshipApplication,
  ContactMessage,
} from "@/types/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<MentorshipApplication[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchDashboardStats()
      .then((s) => active && setStats(s))
      .catch((err: any) => {
        if (active) toast.error("Failed to load stats", { description: err.message });
      })
      .finally(() => active && setStatsLoading(false));

    Promise.all([fetchApplications(), fetchMessages()])
      .then(([apps, msgs]) => {
        if (!active) return;
        setRecentApplications(apps.slice(0, 5));
        setRecentMessages(msgs.slice(0, 5));
      })
      .catch((err: any) => {
        if (active) toast.error("Failed to load recent activity", { description: err.message });
      })
      .finally(() => active && setListsLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard" description="Overview of mentorship applications">
      <div className="space-y-6">
        <DashboardStats stats={stats} loading={statsLoading} />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-base">Recent Applications</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/applications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {listsLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
              ) : recentApplications.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-8 w-8" />}
                  title="No applications yet"
                  description="Submitted Join Now forms will appear here."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {recentApplications.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{a.full_name}</p>
                        <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {a.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
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
              {listsLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
              ) : recentMessages.length === 0 ? (
                <EmptyState
                  icon={<Mail className="h-8 w-8" />}
                  title="No messages yet"
                  description="Contact form submissions will appear here."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {recentMessages.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{m.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.name} · {m.email}
                        </p>
                      </div>
                      <Badge variant={m.is_read ? "outline" : "default"} className="shrink-0">
                        {m.is_read ? "Read" : "Unread"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}