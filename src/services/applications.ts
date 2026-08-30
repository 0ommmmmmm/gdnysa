/**
 * Frontend service layer for mentorship applications.
 */

import { supabase } from "@/integrations/supabase/client";
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

/**
 * Public "Join Now" form submission.
 */
export async function submitApplication(
  data: MentorshipApplicationFormData
): Promise<SubmitResult> {
  const { error } = await supabase.from("joining_form").insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    target_exam: data.target_exam,
    preferred_program: data.preferred_program,
    message: data.message || null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "You've already submitted an application with this email and phone number."
      );
    }

    // Better error messages for common issues
    if (error.message.includes("Invalid API key") || error.message.includes("401")) {
      console.error("Supabase API Error: Invalid API key. Please check your VITE_SUPABASE_PUBLISHABLE_KEY in .env file.");
      throw new Error("Configuration error. Please contact support.");
    }

    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      console.error("Supabase Network Error: Failed to connect to Supabase. Please check your internet connection and VITE_SUPABASE_URL.");
      throw new Error("Network error. Please check your connection and try again.");
    }

    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }

  return { success: true };
}

export async function fetchApplications(): Promise<MentorshipApplication[]> {
  const { data, error } = await supabase
    .from("joining_form")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    target_exam: row.target_exam,
    preferred_program: row.preferred_program,
    message: row.message || undefined,
    status: row.status as ApplicationStatus,
    internal_notes: row.internal_notes || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at || undefined,
  }));
}

export async function fetchApplication(
  id: string
): Promise<MentorshipApplication | null> {
  const { data, error } = await supabase
    .from("joining_form")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return {
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    target_exam: data.target_exam,
    preferred_program: data.preferred_program,
    message: data.message || undefined,
    status: data.status as ApplicationStatus,
    internal_notes: data.internal_notes || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at || undefined,
  };
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<void> {
  const { error } = await supabase
    .from("joining_form")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateApplication(
  id: string,
  changes: Partial<MentorshipApplication>
): Promise<void> {
  const updateData: Record<string, unknown> = {};

  if (changes.full_name !== undefined) updateData.full_name = changes.full_name;
  if (changes.email !== undefined) updateData.email = changes.email;
  if (changes.phone !== undefined) updateData.phone = changes.phone;
  if (changes.target_exam !== undefined) updateData.target_exam = changes.target_exam;
  if (changes.preferred_program !== undefined) updateData.preferred_program = changes.preferred_program;
  if (changes.message !== undefined) updateData.message = changes.message || null;
  if (changes.status !== undefined) updateData.status = changes.status;
  if (changes.internal_notes !== undefined) updateData.internal_notes = changes.internal_notes || null;

  const { error } = await supabase
    .from("joining_form")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from("joining_form")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  const { data, error } = await supabase
    .from("joining_form")
    .select("status");

  if (error) {
    throw new Error(error.message);
  }

  const stats: DashboardStats = {
    total: data.length,
    new: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  for (const row of data) {
    const status = row.status as ApplicationStatus;
    if (status === "new") stats.new++;
    else if (status === "pending") stats.pending++;
    else if (status === "approved") stats.approved++;
    else if (status === "rejected") stats.rejected++;
  }

  return stats;
}
