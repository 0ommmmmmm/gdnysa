-- Comprehensive fix for admin dashboard permissions
-- This ensures all necessary permissions are in place for the admin to access data

-- 1. Fix has_role function permissions (already done, but ensuring it's correct)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Ensure admin user has the admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('b4277368-c93a-4431-a5e8-5ec69c1c94ae', 'admin')
ON CONFLICT (user_id, role) DO UPDATE SET role = EXCLUDED.role;

-- 3. Ensure table permissions are correct for authenticated users
-- joining_form
GRANT SELECT ON public.joining_form TO authenticated;
GRANT UPDATE ON public.joining_form TO authenticated;
GRANT DELETE ON public.joining_form TO authenticated;

-- contact_submissions
GRANT SELECT ON public.contact_submissions TO authenticated;
GRANT UPDATE ON public.contact_submissions TO authenticated;
GRANT DELETE ON public.contact_submissions TO authenticated;

-- user_roles
GRANT SELECT ON public.user_roles TO authenticated;

-- admin_config
GRANT SELECT ON public.admin_config TO authenticated;

-- 4. Recreate admin policies to ensure they work correctly
-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view joining_form" ON public.joining_form;
DROP POLICY IF EXISTS "Admins manage joining_form updates" ON public.joining_form;
DROP POLICY IF EXISTS "Admins delete joining_form" ON public.joining_form;
DROP POLICY IF EXISTS "Admins read joining_form" ON public.joining_form;

-- Create new admin policies for joining_form
CREATE POLICY "Admins can view joining_form"
  ON public.joining_form FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage joining_form updates"
  ON public.joining_form FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete joining_form"
  ON public.joining_form FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing policies for contact_submissions
DROP POLICY IF EXISTS "Admins can view contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins update contact_submissions" ON public.contact_submissions;

-- Create new admin policies for contact_submissions
CREATE POLICY "Admins can view contact_submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update contact_submissions"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
