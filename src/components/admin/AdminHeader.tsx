import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <SidebarTrigger />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-serif text-lg font-semibold text-foreground md:text-xl">
            {title}
          </h1>
          {description && (
            <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
