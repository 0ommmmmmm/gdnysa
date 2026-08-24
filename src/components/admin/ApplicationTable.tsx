import {
  Eye,
  Pencil,
  Check,
  X,
  Clock,
  Trash2,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import type { ApplicationStatus, MentorshipApplication } from "@/types/admin";

export interface ApplicationTableActions {
  onView: (application: MentorshipApplication) => void;
  onEdit: (application: MentorshipApplication) => void;
  onStatusChange: (application: MentorshipApplication, status: ApplicationStatus) => void;
  onDelete: (application: MentorshipApplication) => void;
  onDownloadPdf: (application: MentorshipApplication) => void;
}

interface ApplicationTableProps extends ApplicationTableActions {
  applications: MentorshipApplication[];
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function ApplicationTable({
  applications,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
  onDownloadPdf,
}: ApplicationTableProps) {
  const menu = (application: MentorshipApplication) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-popover">
        <DropdownMenuItem onClick={() => onView(application)}>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(application)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onStatusChange(application, "approved")}>
          <Check className="mr-2 h-4 w-4" /> Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(application, "rejected")}>
          <X className="mr-2 h-4 w-4" /> Reject
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(application, "pending")}>
          <Clock className="mr-2 h-4 w-4" /> Mark Pending
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDownloadPdf(application)}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(application)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Desktop / tablet: scrollable table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Target Exam</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{a.email}</TableCell>
                <TableCell className="text-muted-foreground">{a.phone}</TableCell>
                <TableCell>{a.target_exam}</TableCell>
                <TableCell>{a.preferred_program}</TableCell>
                <TableCell>
                  <ApplicationStatusBadge status={a.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(a.created_at)}
                </TableCell>
                <TableCell className="text-right">{menu(a)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {applications.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{a.full_name}</p>
                <p className="truncate text-sm text-muted-foreground">{a.email}</p>
                <p className="text-sm text-muted-foreground">{a.phone}</p>
              </div>
              {menu(a)}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <ApplicationStatusBadge status={a.status} />
              <span>{a.target_exam}</span>
              <span>·</span>
              <span>{a.preferred_program}</span>
              <span>·</span>
              <span>{formatDate(a.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
