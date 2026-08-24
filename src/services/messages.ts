/**
 * Frontend service layer for contact messages.
 * Placeholder only — Windsurf will connect these to Supabase.
 */

import type { ContactMessage } from "@/types/admin";

const NOT_CONNECTED =
  "Backend is not connected yet. Wire this call up to Supabase.";

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
 *
 * TODO(Windsurf): replace the body with the real Supabase implementation, e.g.
 *   const { error } = await supabase.from("contact_messages").insert(data);
 *   if (error) throw new Error(error.message);
 *   return { success: true };
 */
export async function submitContactMessage(
  data: ContactMessageFormData
): Promise<SubmitResult> {
  // Simulated round-trip so the UI loading state behaves realistically.
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[submitContactMessage] payload (not persisted):", data);
  }

  return { success: true };
}


/** TODO(Windsurf): select from Supabase. */
export async function fetchMessages(): Promise<ContactMessage[]> {
  return [];
}

/** TODO(Windsurf): update is_read column. */
export async function setMessageRead(
  _id: string,
  _isRead: boolean
): Promise<void> {
  throw new Error(NOT_CONNECTED);
}

/** TODO(Windsurf): delete row. */
export async function deleteMessage(_id: string): Promise<void> {
  throw new Error(NOT_CONNECTED);
}
