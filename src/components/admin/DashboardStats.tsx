import { FileText, Sparkles, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats as DashboardStatsType } from "@/types/admin";

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
  loading?: boolean;
}

const cards = [
  { key: "total", label: "Total Applications", icon: FileText },
  { key: "new", label: "New Applications", icon: Sparkles },
  { key: "pending", label: "Pending Applications", icon: Clock },
  { key: "approved", label: "Approved Applications", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected Applications", icon: XCircle },
] as const;

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="font-serif text-3xl font-semibold text-foreground">
              {loading ? "…" : stats ? stats[key] : "--"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
