import { Eye, MailOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ContactMessage } from "@/types/admin";

interface ContactMessagesTableProps {
  messages: ContactMessage[];
  onView: (message: ContactMessage) => void;
  onToggleRead: (message: ContactMessage) => void;
}

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export function ContactMessagesTable({
  messages,
  onView,
  onToggleRead,
}: ContactMessagesTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m) => (
              <TableRow key={m.id} className={m.is_read ? "" : "font-medium"}>
                <TableCell>{m.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.email}</TableCell>
                <TableCell>{m.subject}</TableCell>
                <TableCell className="max-w-[260px] truncate text-muted-foreground">
                  {m.message}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(m.created_at)}
                </TableCell>
                <TableCell>
                  <Badge variant={m.is_read ? "outline" : "default"}>
                    {m.is_read ? "Read" : "Unread"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="View message" onClick={() => onView(m)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={m.is_read ? "Mark as unread" : "Mark as read"}
                    onClick={() => onToggleRead(m)}
                  >
                    {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{m.subject}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {m.name} · {m.email}
                </p>
              </div>
              <Badge variant={m.is_read ? "outline" : "default"}>
                {m.is_read ? "Read" : "Unread"}
              </Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.message}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onView(m)}>
                View
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onToggleRead(m)}>
                {m.is_read ? "Mark unread" : "Mark read"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
