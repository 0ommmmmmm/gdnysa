# Supabase Configuration Issue - ACTION REQUIRED

## Root Cause
The Join/Registration form is failing with a 401 Unauthorized error because the Supabase API key in your `.env` file is invalid.

## Current Invalid Configuration
```env
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ANQSJnmsaHSfa2yZNYELdQ_p-6ur3Rws
```

This is a placeholder key, not a real Supabase JWT token. Real Supabase anon/public keys start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Required Action

You need to replace the invalid key with your actual Supabase project key:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (project ID: `hrujpyrdbhrwsnkbunvn`)
3. Navigate to **Project Settings** → **API**
4. Copy the **anon public** key (not the service_role key)
5. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://hrujpyrdbhrwsnkbunvn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste-your-actual-key-here
VITE_SUPABASE_PROJECT_ID=hrujpyrdbhrwsnkbunvn
```

6. Restart your development server after updating the `.env` file

## Security Notes
- **NEVER** use the service_role key in frontend code
- The anon/public key is safe to use in frontend applications
- The anon key has limited permissions (only what RLS policies allow)
- Do not commit `.env` files to version control

## What Was Fixed

### Files Changed:
1. **`.env.example`** - Created a template file with proper Supabase configuration instructions
2. **`src/integrations/supabase/client.ts`** - Added validation to detect invalid API keys at startup
3. **`src/services/applications.ts`** - Improved error handling with better error messages
4. **`src/services/messages.ts`** - Improved error handling with better error messages
5. **`src/pages/Join.tsx`** - Added detailed error logging in development mode
6. **`src/pages/Contact.tsx`** - Added detailed error logging in development mode

### Database Configuration (Already Correct)
- RLS policies are properly configured to allow anonymous inserts
- The `joining_form` table exists with correct schema
- INSERT policies allow `anon` and `authenticated` roles

### Error Handling Improvements
- Invalid API keys now show: "Configuration error. Please contact support."
- Network errors now show: "Network error. Please check your connection and try again."
- Development mode logs detailed errors to console for debugging
- User-facing messages are friendly and actionable

## Verification Steps

After updating the `.env` file:

1. Restart the dev server: `npm run dev`
2. Navigate to the Join Now page
3. Fill in all required fields
4. Submit the form
5. Verify success message appears
6. Check browser console for any remaining errors
7. Verify the record appears in Supabase dashboard

## Current Database RLS Policies

The database already has the correct policies:
- **`joining_form`**: Anyone can insert (anon, authenticated) with basic validation
- **`contact_submissions`**: Anyone can insert (anon, authenticated) with basic validation
- Both tables have SELECT restricted to authenticated users only (admin access)

No database changes are needed - only the frontend API key needs to be corrected.
