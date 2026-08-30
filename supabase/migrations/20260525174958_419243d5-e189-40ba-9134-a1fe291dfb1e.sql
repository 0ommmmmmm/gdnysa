
-- Drop legacy trigger explicitly
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.assign_initial_role() CASCADE;

-- admin_config
CREATE TABLE IF NOT EXISTS public.admin_config (
  id boolean PRIMARY KEY DEFAULT true,
  admin_email text NOT NULL,
  CONSTRAINT admin_config_singleton CHECK (id = true)
);
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_config (id, admin_email)
VALUES (true, lower('gdnyasa@gmail.com'))
ON CONFLICT (id) DO UPDATE SET admin_email = EXCLUDED.admin_email;

-- Role assignment trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE configured_admin text;
BEGIN
  SELECT lower(admin_email) INTO configured_admin FROM public.admin_config WHERE id = true;
  IF configured_admin IS NOT NULL AND lower(NEW.email) = configured_admin
     AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Single-admin enforcement
CREATE OR REPLACE FUNCTION public.enforce_single_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE configured_admin text; user_email text;
BEGIN
  IF NEW.role = 'admin' THEN
    SELECT lower(admin_email) INTO configured_admin FROM public.admin_config WHERE id = true;
    SELECT lower(email) INTO user_email FROM auth.users WHERE id = NEW.user_id;
    IF user_email IS DISTINCT FROM configured_admin THEN
      RAISE EXCEPTION 'Admin role can only be assigned to the configured admin email';
    END IF;
    IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE role = 'admin' AND user_id <> NEW.user_id
        AND (TG_OP = 'INSERT' OR id <> NEW.id)
    ) THEN
      RAISE EXCEPTION 'Only one admin account is allowed';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS enforce_single_admin_trigger ON public.user_roles;
CREATE TRIGGER enforce_single_admin_trigger
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_single_admin();

-- Tighten public INSERT policies
DROP POLICY IF EXISTS "Anyone can submit joining form" ON public.joining_form;
CREATE POLICY "Anyone can submit joining form" ON public.joining_form
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 4 AND 255 AND email LIKE '%_@_%.__%'
  AND length(full_name) BETWEEN 1 AND 200
  AND length(phone) BETWEEN 4 AND 50
);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 4 AND 255 AND email LIKE '%_@_%.__%'
  AND length(name) BETWEEN 1 AND 200
  AND length(subject) BETWEEN 1 AND 300
  AND length(message) BETWEEN 1 AND 5000
);

DROP POLICY IF EXISTS "Anyone can register for mentorship" ON public.mentorship_registrations;
CREATE POLICY "Anyone can register for mentorship" ON public.mentorship_registrations
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 4 AND 255 AND email LIKE '%_@_%.__%'
  AND length(full_name) BETWEEN 1 AND 200
  AND length(phone) BETWEEN 4 AND 50
);

-- Hide tables from GraphQL discovery
REVOKE SELECT ON public.joining_form FROM anon, authenticated;
REVOKE SELECT ON public.contact_submissions FROM anon, authenticated;
REVOKE SELECT ON public.mentorship_registrations FROM anon, authenticated;
REVOKE SELECT ON public.user_roles FROM anon, authenticated;
REVOKE SELECT ON public.admin_config FROM anon, authenticated;

GRANT SELECT ON public.joining_form TO authenticated;
GRANT SELECT ON public.contact_submissions TO authenticated;
GRANT SELECT ON public.mentorship_registrations TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

GRANT INSERT ON public.joining_form TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.mentorship_registrations TO anon, authenticated;

GRANT UPDATE ON public.joining_form TO authenticated;
GRANT UPDATE ON public.contact_submissions TO authenticated;
GRANT UPDATE ON public.mentorship_registrations TO authenticated;

-- Lock down SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_single_admin() FROM anon, authenticated, public;
