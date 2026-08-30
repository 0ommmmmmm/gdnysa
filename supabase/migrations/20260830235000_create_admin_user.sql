-- Create admin user via SQL (bypasses email rate limit)
-- This will create the user and assign admin role automatically via trigger

-- First, insert the user directly into auth.users (this requires service role)
-- Since we can't use service role in migrations, this migration will set up the configuration
-- and you'll need to create the user via the dashboard using "Create new user" (not "Invite")

-- Ensure admin_config has the correct email
INSERT INTO public.admin_config (id, admin_email)
VALUES (true, 'admin.gdnyasa@gdnyasa.app')
ON CONFLICT (id) DO UPDATE SET admin_email = EXCLUDED.admin_email;

-- The user creation should be done via Supabase Dashboard:
-- Authentication → Users → Add user → Create new user
-- Email: admin.gdnyasa@gdnyasa.app
-- Password: [your secure password]
-- Auto Confirm User: ✅ ENABLED
