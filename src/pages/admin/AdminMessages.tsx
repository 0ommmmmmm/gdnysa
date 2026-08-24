import { useEffect, useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContactMessagesTable } from "@/components/admin/ContactMessagesTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { LoadingState } from "@/components/admin/LoadingState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchMessages } from "@/services/messages";
import type { ContactMessage } from "@/types/admin";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [active, setActive] = useState<ContactMessage | null>(null);

  useEffect(() => {
    let alive = true;
    // TODO(Windsurf): swap for a Supabase query + realtime subscription.
    fetchMessages()
      .then((rows) => alive && setMessages(rows))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (readFilter === "read" && !m.is_read) return false;
      if (readFilter === "unread" && m.is_read) return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.message].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [messages, search, readFilter]);

  const notConnected = () =>
    toast.info("Not connected yet", {
      description: "This action will work once the backend is connected.",
    });

  return (
    <AdminLayout title="Contact Messages" description="Messages from the contact form">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, subject or message"
              className="pl-9"
              aria-label="Search messages"
            />
          </div>
          <Select value={readFilter} onValueChange={(v) => setReadFilter(v as typeof readFilter)}>
            <SelectTrigger className="sm:w-[170px]" aria-label="Filter by read state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="all">All messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <LoadingState label="Loading messages..." />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-9 w-9" />}
            title="No messages yet"
            description="Contact form submissions will appear here once the backend is connected."
          />
        ) : (
          <ContactMessagesTable
            messages={visible}
            onView={setActive}
            onToggleRead={notConnected}
          />
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{active?.subject}</DialogTitle>
            <DialogDescription>
              {active?.name} · {active?.email}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm text-foreground">{active?.message}</p>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
