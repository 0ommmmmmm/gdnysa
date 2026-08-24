CREATE TABLE public.joining_form (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  target_exam TEXT NOT NULL,
  preferred_program TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.joining_form ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit joining form"
ON public.joining_form
FOR INSERT
TO public
WITH CHECK (true);
