import { Check, Clock, Download, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApplicationForm } from "./ApplicationForm";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import type { ApplicationStatus, MentorshipApplication } from "@/types/admin";

interface ApplicationDetailsProps {
  application: MentorshipApplication | null;
  open: boolean;
  editing?: boolean;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (changes: Partial<MentorshipApplication>) => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
  onDownloadPdf: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

export function ApplicationDetails({
  application,
  open,
  editing,
  saving,
  onOpenChange,
  onSave,
  onStatusChange,
  onDelete,
  onDownloadPdf,
}: ApplicationDetailsProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{application.full_name}</DialogTitle>
          <DialogDescription>
            Submitted {new Date(application.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {editing ? (
          <ApplicationForm
            application={application}
            saving={saving}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={application.full_name} />
              <Field label="Email" value={application.email} />
              <Field label="Phone" value={application.phone} />
              <Field label="Target Exam" value={application.target_exam} />
              <Field label="Preferred Program" value={application.preferred_program} />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Current Status
                </p>
                <div className="mt-1">
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </div>
            </div>

            <Field label="Additional Message" value={application.message ?? ""} />
            <Field label="Internal Notes" value={application.internal_notes ?? ""} />
          </div>
        )}

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onStatusChange("approved")}>
            <Check className="mr-1.5 h-4 w-4" /> Approve
          </Button>
          <Button size="sm" variant="outline" onClick={() => onStatusChange("rejected")}>
            <X className="mr-1.5 h-4 w-4" /> Reject
          </Button>
          <Button size="sm" variant="outline" onClick={() => onStatusChange("pending")}>
            <Clock className="mr-1.5 h-4 w-4" /> Pending
          </Button>
          <Button size="sm" variant="outline" onClick={onDownloadPdf}>
            <Download className="mr-1.5 h-4 w-4" /> Download PDF
          </Button>
          <Button size="sm" variant="destructive" className="ml-auto" onClick={onDelete}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
