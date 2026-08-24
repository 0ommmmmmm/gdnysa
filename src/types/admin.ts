/**
 * Shared frontend data contracts for G-Dnyasa.
 *
 * These types are intentionally backend-agnostic. When Supabase is wired up
 * (via Windsurf), map the database rows directly onto these interfaces.
 */

export type ApplicationStatus = "new" | "pending" | "approved" | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "pending",
  "approved",
  "rejected",
];

export const TARGET_EXAMS = [
  "GATE Geology",
  "CSIR-NET",
  "IIT JAM",
  "University Exams",
] as const;

export const MENTORSHIP_PROGRAMS = [
  "Quartz (Basic)",
  "Garnet (Silver)",
  "Diamond (Gold)",
] as const;

/** Payload produced by the public "Join Now" form. */
export interface MentorshipApplicationFormData {
  full_name: string;
  email: string;
  phone: string;
  target_exam: string;
  preferred_program: string;
  message?: string;
}

/** A stored application row (public form data + admin-managed fields). */
export interface MentorshipApplication extends MentorshipApplicationFormData {
  id: string;
  status: ApplicationStatus;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

/** A stored contact-form message. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApplicationFilterState {
  search: string;
  status: ApplicationStatus | "all";
  target_exam: string | "all";
  preferred_program: string | "all";
}

export const emptyApplicationFilters: ApplicationFilterState = {
  search: "",
  status: "all",
  target_exam: "all",
  preferred_program: "all",
};
