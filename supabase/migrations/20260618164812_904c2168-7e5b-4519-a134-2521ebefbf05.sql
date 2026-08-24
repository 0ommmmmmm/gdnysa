
-- 1. Switch admin to the new credential email derived from username "admin.gdnyasa"
UPDATE public.admin_config SET admin_email = 'admin.gdnyasa@gdnyasa.app' WHERE id = true;
INSERT INTO public.admin_config (id, admin_email) VALUES (true, 'admin.gdnyasa@gdnyasa.app')
ON CONFLICT (id) DO UPDATE SET admin_email = EXCLUDED.admin_email;

-- 2. Joining form: internal notes + updated_at, prevent duplicate (email,phone) submissions, admin manage rights
ALTER TABLE public.joining_form
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Prevent duplicates by email AND phone combo
CREATE UNIQUE INDEX IF NOT EXISTS joining_form_unique_email_phone
  ON public.joining_form (lower(email), phone);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS joining_form_touch_updated_at ON public.joining_form;
CREATE TRIGGER joining_form_touch_updated_at
BEFORE UPDATE ON public.joining_form
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Admin can update / delete joining_form rows
DROP POLICY IF EXISTS "Admins manage joining_form updates" ON public.joining_form;
CREATE POLICY "Admins manage joining_form updates" ON public.joining_form
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete joining_form" ON public.joining_form;
CREATE POLICY "Admins delete joining_form" ON public.joining_form
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin SELECT (in case missing)
DROP POLICY IF EXISTS "Admins read joining_form" ON public.joining_form;
CREATE POLICY "Admins read joining_form" ON public.joining_form
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Re-grant authenticated SELECT (was previously revoked for GraphQL hardening; PostgREST also needs it)
GRANT SELECT, UPDATE, DELETE ON public.joining_form TO authenticated;

-- 3. Enable realtime on joining_form
ALTER TABLE public.joining_form REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='joining_form'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.joining_form';
  END IF;
END $$;
