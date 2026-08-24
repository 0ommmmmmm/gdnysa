/**
 * Frontend service layer for mentorship applications.
 *
 * NOTE: No backend is connected yet. Every function below is a clearly marked
 * placeholder. Windsurf should replace the bodies with Supabase queries while
 * keeping these signatures, so the UI needs no changes.
 */

import type {
  ApplicationStatus,
  DashboardStats,
  MentorshipApplication,
  MentorshipApplicationFormData,
} from "@/types/admin";

export interface SubmitResult {
  success: boolean;
  message?: string;
}

const NOT_CONNECTED =
  "Backend is not connected yet. Wire this call up to Supabase.";

/**
 * Public "Join Now" form submission.
 *
 * TODO(Windsurf): replace with
 *   await supabase.from("mentorship_applications").insert(data)
 */
export async function submitApplication(
  data: MentorshipApplicationFormData
): Promise<SubmitResult> {
  // Simulated round-trip so the UI loading state behaves realistically.
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[submitApplication] payload (not persisted):", data);
  }

  return { success: true };
}

/**
 * TODO(Windsurf): select from Supabase (with filters / pagination / realtime).
 * Returns an empty list so the UI renders its empty state.
 */
export async function fetchApplications(): Promise<MentorshipApplication[]> {
  return [];
}

/** TODO(Windsurf): select a single application by id. */
export async function fetchApplication(
  _id: string
): Promise<MentorshipApplication | null> {
  return null;
}

/** TODO(Windsurf): update status column. */
export async function updateApplicationStatus(
  _id: string,
  _status: ApplicationStatus
): Promise<void> {
  throw new Error(NOT_CONNECTED);
}

/** TODO(Windsurf): update editable fields + internal notes. */
export async function updateApplication(
  _id: string,
  _changes: Partial<MentorshipApplication>
): Promise<void> {
  throw new Error(NOT_CONNECTED);
}

/** TODO(Windsurf): delete row. */
export async function deleteApplication(_id: string): Promise<void> {
  throw new Error(NOT_CONNECTED);
}

/**
 * TODO(Windsurf): compute from Supabase counts.
 * Returns null so the dashboard shows "--" placeholders.
 */
export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  return null;
}
