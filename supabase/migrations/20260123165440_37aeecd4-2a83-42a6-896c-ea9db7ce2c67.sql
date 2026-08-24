-- Create contact_submissions table for Contact form
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentorship_registrations table for Join form
CREATE TABLE public.mentorship_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  target_exam TEXT NOT NULL,
  preferred_program TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert access (forms can be submitted by anyone)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can register for mentorship"
ON public.mentorship_registrations
FOR INSERT
WITH CHECK (true);

-- Admin read access would need authenticated users - for now using service role only
-- These can be viewed via the Lovable Cloud dashboard