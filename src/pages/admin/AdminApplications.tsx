import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ApplicationFilters } from "@/components/admin/ApplicationFilters";
import { ApplicationTable } from "@/components/admin/ApplicationTable";
import { ApplicationDetails } from "@/components/admin/ApplicationDetails";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/admin/EmptyState";
import { LoadingState } from "@/components/admin/LoadingState";
import { downloadApplicationPdf } from "@/lib/applicationPdf";
import {
  fetchApplications,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
} from "@/services/applications";
import {
  emptyApplicationFilters,
  type ApplicationFilterState,
  type ApplicationStatus,
  type MentorshipApplication,
} from "@/types/admin";

export default function AdminApplications() {
  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilterState>(emptyApplicationFilters);
  const [selected, setSelected] = useState<MentorshipApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MentorshipApplication | null>(null);

  useEffect(() => {
    let active = true;
    fetchApplications()
      .then((rows) => active && setApplications(rows))
      .catch((err: any) => active && toast.error("Failed to load applications", { description: err.message }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return applications.filter((a) => {
      if (filters.status !== "all" && a.status !== filters.status) return false;
      if (filters.target_exam !== "all" && a.target_exam !== filters.target_exam) return false;
      if (filters.preferred_program !== "all" && a.preferred_program !== filters.preferred_program)
        return false;
      if (!q) return true;
      return [a.full_name, a.email, a.phone].some((v) => v.toLowerCase().includes(q));
    });
  }, [applications, filters]);

  const applyLocalUpdate = (id: string, changes: Partial<MentorshipApplication>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...changes } : prev));
  };

  const handleStatusChange = async (a: MentorshipApplication, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(a.id, status);
      applyLocalUpdate(a.id, { status });
      toast.success(`Marked as ${status}`);
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    }
  };

  const handleSave = async (changes: Partial<MentorshipApplication>) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateApplication(selected.id, changes);
      applyLocalUpdate(selected.id, changes);
      toast.success("Application updated");
      setEditing(false);
    } catch (err: any) {
      toast.error("Failed to save changes", { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDialogStatusChange = async (status: ApplicationStatus) => {
    if (!selected) return;
    await handleStatusChange(selected, status);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteApplication(target.id);
      setApplications((prev) => prev.filter((a) => a.id !== target.id));
      if (selected?.id === target.id) setDetailsOpen(false);
      toast.success("Application deleted");
    } catch (err: any) {
      toast.error("Failed to delete application", { description: err.message });
    }
  };

  return (
    <AdminLayout title="Applications" description="All Join Now form submissions">
      <div className="space-y-5">
        <ApplicationFilters value={filters} onChange={setFilters} />

        {loading ? (
          <LoadingState label="Loading applications..." />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-9 w-9" />}
            title="No applications yet"
            description="Every Join Now submission will be listed here."
          />
        ) : (
          <ApplicationTable
            applications={visible}
            onView={(a) => {
              setSelected(a);
              setEditing(false);
              setDetailsOpen(true);
            }}
            onEdit={(a) => {
              setSelected(a);
              setEditing(true);
              setDetailsOpen(true);
            }}
            onStatusChange={handleStatusChange}
            onDelete={(a) => setDeleteTarget(a)}
            onDownloadPdf={downloadApplicationPdf}
          />
        )}
      </div>

      <ApplicationDetails
        application={selected}
        open={detailsOpen}
        editing={editing}
        saving={saving}
        onOpenChange={setDetailsOpen}
        onSave={handleSave}
        onStatusChange={handleDialogStatusChange}
        onDelete={() => selected && setDeleteTarget(selected)}
        onDownloadPdf={() => selected && downloadApplicationPdf(selected)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this application?"
        description="The application record will be permanently removed."
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}