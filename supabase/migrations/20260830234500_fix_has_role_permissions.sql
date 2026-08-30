-- Fix has_role function permissions to allow authenticated users to call it
-- This is required for admin authentication to work properly

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
