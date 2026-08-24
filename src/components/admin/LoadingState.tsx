import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  label = "Loading...",
  rows = 4,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}
