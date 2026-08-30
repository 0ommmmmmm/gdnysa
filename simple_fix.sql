-- Simple fix: Disable RLS temporarily for admin access
-- This grants direct table permissions to authenticated users

-- Disable RLS for admin tables (temporary fix)
ALTER TABLE public.joining_form DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.joining_form TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;

-- Enable RLS back with permissive policies
ALTER TABLE public.joining_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create simple permissive policies for authenticated users
DROP POLICY IF EXISTS "Authenticated users can manage joining_form" ON public.joining_form;
CREATE POLICY "Authenticated users can manage joining_form"
  ON public.joining_form FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage contact_submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated users can manage contact_submissions"
  ON public.contact_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
