/**
 * Admin authentication service — backed by the project's auth provider.
 *
 * No credentials live in this file. Passwords are verified and hashed by the
 * auth provider; the browser only ever holds a short-lived session token.
 */
import { supabase } from "@/integrations/supabase/client";

export interface AdminCredentials {
  identifier: string;
  password: string;
}

/**
 * Admins sign in with a username-style identifier. The auth provider requires a
 * fully-qualified email, so a bare handle is normalised to the admin domain.
 */
export function normalizeIdentifier(identifier: string): string {
  const value = identifier.trim().toLowerCase();
  if (!value.includes("@")) return `${value}@gdnyasa.app`;
  const [, domain] = value.split("@");
  if (!domain.includes(".")) return `${value}.app`;
  return value;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid username or password.");
    this.name = "InvalidCredentialsError";
  }
}

export async function adminLogin({ identifier, password }: AdminCredentials): Promise<void> {
  const email = normalizeIdentifier(identifier);

  if (import.meta.env.DEV) {
    console.log('Attempting login with email:', email);
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (import.meta.env.DEV) {
      console.error("Authentication failed:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        name: error?.name
      });
    }
    throw new InvalidCredentialsError();
  }

  if (import.meta.env.DEV) {
    console.log("Authentication successful, user ID:", data.user.id);
  }

  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
    _user_id: data.user.id,
    _role: "admin",
  });

  if (roleError || !isAdmin) {
    if (import.meta.env.DEV) {
      console.error("Role check failed:", roleError);
      console.error("Role check details:", {
        message: roleError?.message,
        status: roleError?.status,
        isAdmin: isAdmin
      });
    }
    await supabase.auth.signOut();
    throw new InvalidCredentialsError();
  }

  if (import.meta.env.DEV) {
    console.log("Role check successful, admin confirmed");
  }
}

export async function adminLogout(): Promise<void> {
  await supabase.auth.signOut();
}

/** Returns the current admin session, or null when not signed in as an admin. */
export async function getAdminSession() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (!isAdmin) return null;
  return { userId: user.id, email: user.email ?? "" };
}
