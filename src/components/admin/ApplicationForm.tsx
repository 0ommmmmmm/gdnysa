import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPLICATION_STATUSES,
  MENTORSHIP_PROGRAMS,
  TARGET_EXAMS,
  type MentorshipApplication,
} from "@/types/admin";

interface ApplicationFormProps {
  application: MentorshipApplication;
  saving?: boolean;
  onSave: (changes: Partial<MentorshipApplication>) => void;
  onCancel?: () => void;
}

/** Editable form for a single application (admin side). */
export function ApplicationForm({
  application,
  saving,
  onSave,
  onCancel,
}: ApplicationFormProps) {
  const [draft, setDraft] = useState<MentorshipApplication>(application);

  const set = <K extends keyof MentorshipApplication>(
    key: K,
    value: MentorshipApplication[K]
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={draft.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={draft.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={draft.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={draft.status}
            onValueChange={(v) => set("status", v as MentorshipApplication["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {APPLICATION_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target Exam</Label>
          <Select value={draft.target_exam} onValueChange={(v) => set("target_exam", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {TARGET_EXAMS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Preferred Program</Label>
          <Select
            value={draft.preferred_program}
            onValueChange={(v) => set("preferred_program", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {MENTORSHIP_PROGRAMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Message</Label>
        <Textarea
          id="message"
          rows={3}
          value={draft.message ?? ""}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="internal_notes">Internal Notes</Label>
        <Textarea
          id="internal_notes"
          rows={3}
          value={draft.internal_notes ?? ""}
          onChange={(e) => set("internal_notes", e.target.value)}
          placeholder="Visible to admins only"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
