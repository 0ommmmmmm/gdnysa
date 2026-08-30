/**
 * Frontend service layer for contact messages.
 */

import { supabase } from "@/integrations/supabase/client";
import type { ContactMessage } from "@/types/admin";

/** Payload produced by the public Contact form. */
export interface ContactMessageFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SubmitResult {
  success: boolean;
  message?: string;
}

/**
 * Public Contact form submission.
 */
export async function submitContactMessage(
  data: ContactMessageFormData
): Promise<SubmitResult> {
  const { error } = await supabase
    .from("contact_submissions")
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

  if (error) {
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


export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    is_read: row.status !== "pending",
    created_at: row.created_at,
  }));
}

export async function setMessageRead(
  id: string,
  isRead: boolean
): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: isRead ? "read" : "pending" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
