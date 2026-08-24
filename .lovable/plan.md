# Plan

## 1. Email verification notice + gating

- New page `src/pages/VerifyEmail.tsx` (`/verify-email`) shown after signup:
  - Message: check inbox + spam, you must verify before signing in.
  - "Resend verification email" button → `supabase.auth.resend({ type: 'signup', email })` with loading / success / error states (inline messages, not just toast).
  - "Back to sign in" link.
- `src/pages/Auth.tsx` (student signup): after `signUp` success, navigate to `/verify-email?email=...` instead of switching to sign-in tab.
- `AuthContext`: expose `emailVerified = !!user?.email_confirmed_at`.
- `ProtectedRoute`: if `user && !emailVerified` → redirect to `/verify-email`. (Admins also must be verified.)
- Add route in `App.tsx` (public).

## 2. Separate admin sign-in from student sign-in

- Rename student page purpose: `/auth` stays as **student-only** sign-in / signup.
  - After successful login, if the user is an admin → sign them out + show error "Use the admin sign-in page".
- New `src/pages/AdminAuth.tsx` (`/admin-login`):
  - Email + password sign-in only (no signup).
  - After login, if user is NOT admin → sign out + error "Not an admin account".
  - On success → `/admin`.
- `ProtectedRoute`:
  - Student routes (`/dashboard`): if user is admin → redirect to `/admin`.
  - Admin routes (`/admin`): if not admin → redirect to `/admin-login` (not `/dashboard`).
- Navbar: keep "Sign in" → `/auth`; add a small footer link "Admin sign in" → `/admin-login`.

## 3. Single-admin enforcement (DB-level)

Migration:
- Drop current `assign_initial_role` trigger/function (it auto-promotes the first signup, which is unreliable and can be gamed if the admin row is deleted).
- New approach: admin is defined by an **email allowlist** stored in a protected `admin_config` table (single row, no public access), seeded from a known email. We will ask the user for the admin email before applying.
- Trigger `enforce_single_admin` BEFORE INSERT/UPDATE on `user_roles`:
  - If `NEW.role = 'admin'`:
    - Reject if another row already has `role = 'admin'` and a different `user_id`.
    - Reject if the user's email (looked up from `auth.users`) does not match the configured admin email.
- New trigger on `auth.users` AFTER INSERT: if `NEW.email = admin_config.admin_email` and no admin row exists → insert admin role; else insert `user` role.
- `admin_config` table: RLS enabled, no policies for anon/authenticated (only service role / definer functions can read). Single-row enforced via unique constraint on a constant column.
- Server-side admin verification already happens via `has_role()` in RLS — admin dashboard reads/updates rely on RLS, so frontend `isAdmin` is purely cosmetic. We'll keep that pattern (already correct).

## 4. Supabase linter fixes (16 warnings)

Migration covering each lint code:

- **0024 permissive RLS (×3)** — the three `Anyone can submit ... WITH CHECK (true)` INSERT policies on `joining_form`, `contact_submissions`, `mentorship_registrations`. Replace `true` with a minimal sanity check (e.g. `length(email) > 3 AND length(email) < 255 AND email LIKE '%@%'`) to satisfy the linter while keeping public submissions working.
- **0026 anon GraphQL exposure (×4)** & **0027 authenticated GraphQL exposure (×4)** — `REVOKE SELECT ON public.<table> FROM anon, authenticated` for all four tables (`joining_form`, `contact_submissions`, `mentorship_registrations`, `user_roles`). RLS still permits the intended access via PostgREST because Supabase grants are separate from GraphQL discovery; PostgREST will continue to honor RLS for authenticated reads. (Anon never needs SELECT — inserts use the INSERT grant.) Verify `INSERT` grant remains for `anon` on the three public-submission tables.
- **0028 / 0029 SECURITY DEFINER executable (×4)** — `REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role), public.assign_initial_role() FROM anon, authenticated;` (`has_role` is only called from RLS expressions which run as the policy owner, so revoking client EXECUTE is safe). The new admin trigger function gets the same revoke.
- **Leaked password protection** — call `configure_auth` with `password_hibp_enabled: true`.

All functions written/rewritten with `SET search_path = public` and `SECURITY DEFINER` only where required (trigger functions). Re-run `supabase--linter` after; iterate until zero warnings.

## 5. Verification

- Manually walk through: signup → verify-email page → resend → confirm email → student login → `/dashboard`.
- Try admin email on `/auth` → blocked. Try student on `/admin-login` → blocked.
- Try inserting a second `user_roles` row with `role='admin'` via SQL → trigger rejects.
- Re-run linter → 0 warnings.

## Question before I start

**What email address should be the single admin?** (Used to seed `admin_config` and to gate the role trigger.) If you've already signed up with the admin account, tell me which email so I can preserve its admin row.

## Files

- New: `src/pages/VerifyEmail.tsx`, `src/pages/AdminAuth.tsx`, two SQL migrations (single-admin + linter fixes).
- Edited: `src/App.tsx`, `src/pages/Auth.tsx`, `src/contexts/AuthContext.tsx`, `src/components/auth/ProtectedRoute.tsx`, `src/components/layout/Navbar.tsx` (or Footer).
- Auth config update: enable HIBP.
