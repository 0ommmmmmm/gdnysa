-- Fix has_role function permissions to allow authenticated users to call it
-- This is required for admin authentication to work properly

-- First, revoke all existing permissions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;

-- Then grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
