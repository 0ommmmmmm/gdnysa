import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/admin";

const styles: Record<ApplicationStatus, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  pending: "bg-accent/20 text-accent-foreground border-accent/40",
  approved: "bg-secondary/30 text-secondary-foreground border-secondary/50",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const labels: Record<ApplicationStatus, string> = {
  new: "New",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status], className)}>
      {labels[status]}
    </Badge>
  );
}
