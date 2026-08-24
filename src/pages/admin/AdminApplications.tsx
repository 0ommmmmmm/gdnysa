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
import { fetchApplications } from "@/services/applications";
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
  const [deleteTarget, setDeleteTarget] = useState<MentorshipApplication | null>(null);

  useEffect(() => {
    let active = true;
    // TODO(Windsurf): swap for a Supabase query + realtime subscription.
    fetchApplications()
      .then((rows) => active && setApplications(rows))
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
      if (
        filters.preferred_program !== "all" &&
        a.preferred_program !== filters.preferred_program
      )
        return false;
      if (!q) return true;
      return [a.full_name, a.email, a.phone].some((v) => v.toLowerCase().includes(q));
    });
  }, [applications, filters]);

  const notConnected = () =>
    toast.info("Not connected yet", {
      description: "This action will work once the backend is connected.",
    });

  const handleStatusChange = (_a: MentorshipApplication, _status: ApplicationStatus) =>
    notConnected();

  return (
    <AdminLayout
      title="Applications"
      description="All Join Now form submissions"
    >
      <div className="space-y-5">
        <ApplicationFilters value={filters} onChange={setFilters} />

        {loading ? (
          <LoadingState label="Loading applications..." />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-9 w-9" />}
            title="No applications yet"
            description="Once the backend is connected, every Join Now submission will be listed here."
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
        onOpenChange={setDetailsOpen}
        onSave={notConnected}
        onStatusChange={notConnected}
        onDelete={() => selected && setDeleteTarget(selected)}
        onDownloadPdf={() => selected && downloadApplicationPdf(selected)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this application?"
        description="The application record will be permanently removed."
        onConfirm={() => {
          setDeleteTarget(null);
          notConnected();
        }}
      />
    </AdminLayout>
  );
}
