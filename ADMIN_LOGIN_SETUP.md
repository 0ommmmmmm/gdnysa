# G-Dnyasa Admin Login - Setup Instructions

## Root Cause Analysis

### Authentication Method
The admin login uses **Supabase Auth** with role-based authorization:
- Login credentials are verified by Supabase Auth
- Admin authorization is checked via the `has_role()` database function
- Session management is handled by Supabase Auth

### Login Flow
1. User enters email/password in `/admin/login`
2. `adminLogin()` in `src/services/adminAuth.ts` normalizes the identifier
3. Calls `supabase.auth.signInWithPassword()` for authentication
4. Calls `supabase.rpc("has_role", { _user_id, _role: "admin" })` for authorization
5. If both succeed, redirects to `/admin/dashboard`

### Current Issue
The login is failing because **the admin user account does not exist in Supabase Auth**.

### Database Configuration
The database is configured correctly:
- **Configured admin email**: `admin.gdnyasa@gdnyasa.app` (from migration `20260618164812_904c2168-7e5b-4519-a134-2521ebefbf05.sql`)
- **Admin role system**: Uses `user_roles` table with `app_role` enum
- **Role assignment trigger**: Automatically assigns admin role to matching email on signup
- **Single admin enforcement**: Only one admin account allowed

### The Problem
The database expects the admin user to be created in Supabase Auth with email `admin.gdnyasa@gdnyasa.app`, but this user does not exist. The database has the configuration but no actual auth user.

## Files Modified

### 1. `src/services/adminAuth.ts`
- **Changed domain normalization**: From `@gdnyasa.com` to `@gdnyasa.app` to match database config
- **Added error logging**: Detailed console logging in development mode for debugging
- **Improved error handling**: Better error messages for authentication and role check failures

### 2. `src/pages/admin/AdminLogin.tsx`
- **Updated placeholder**: Changed from `admin@gdnyasa.com` to `admin.gdnyasa@gdnyasa.app`
- **Added error logging**: Console logging in development mode for debugging

### 3. `supabase/migrations/20260525174958_419243d5-e189-40ba-9134-a1fe291dfb1e.sql`
- **Fixed permissions**: Added `GRANT EXECUTE ON FUNCTION public.has_role TO authenticated`
- **Previously**: Function was completely locked down, preventing role checks

### 4. `supabase/migrations/20260830234500_fix_has_role_permissions.sql` (NEW)
- **Migration to fix permissions**: Ensures authenticated users can call `has_role()`

### 5. `supabase/functions/bootstrap-admin/index.ts` (NEW)
- **Admin bootstrap function**: Secure way to create the initial admin user
- **Security features**:
  - Verifies email matches configured admin email in `admin_config`
  - Uses service role key (server-side only)
  - Prevents duplicate admin creation
  - Only callable from server environment

## Solution: Create the Admin User

### Option 1: Use the Bootstrap Function (Recommended)

The bootstrap function allows you to securely create the admin user:

1. **Deploy the function**:
   ```bash
   cd /Users/om/Downloads/g-dnyasa
   npx supabase functions deploy bootstrap-admin
   ```

2. **Call the function** (requires service role key):
   ```bash
   curl -X POST 'https://hrujpyrdbhrwsnkbunvn.supabase.co/functions/v1/bootstrap-admin' \
     -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "email": "admin.gdnyasa@gdnyasa.app",
       "password": "YOUR_SECURE_PASSWORD"
     }'
   ```

3. **Login with the created credentials**:
   - Email: `admin.gdnyasa@gdnyasa.app`
   - Password: The password you set in step 2

### Option 2: Create via Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select project `hrujpyrdbhrwsnkbunvn`
3. Navigate to **Authentication** → **Users**
4. Click **"Add user"** → **"Create new user"**
5. Enter:
   - **Email**: `admin.gdnyasa@gdnyasa.app`
   - **Password**: Your secure password
   - **Auto Confirm User**: ✅ enabled
6. Click **"Create user"**

The database trigger will automatically assign the admin role since the email matches the configured admin email.

### Option 3: Use Supabase CLI

```bash
cd /Users/om/Downloads/g-dnyasa
npx supabase auth create-user \
  --email admin.gdnyasa@gdnyasa.app \
  --password YOUR_SECURE_PASSWORD \
  --confirm
```

## Apply Database Migration

To fix the `has_role` permissions issue:

```bash
cd /Users/om/Downloads/g-dnyasa
npx supabase db push
```

This will apply the migration `20260830234500_fix_has_role_permissions.sql` to ensure authenticated users can call the `has_role()` function.

## Verification Steps

After creating the admin user:

1. **Restart the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to admin login**: http://localhost:8080/admin/login

3. **Enter credentials**:
   - Email: `admin.gdnyasa@gdnyasa.app`
   - Password: The password you set

4. **Verify successful login**:
   - Should redirect to `/admin/dashboard`
   - Should see admin dashboard with applications and messages

5. **Check browser console**:
   - No authentication errors
   - No role check errors

6. **Test logout**:
   - Logout and verify you're redirected to login
   - Unauthorized users cannot access admin routes

## Security Notes

- ✅ **No passwords in source code**: All passwords stored in Supabase Auth
- ✅ **No VITE_* secrets**: No sensitive data in browser-accessible variables
- ✅ **RLS enabled**: Database security policies active
- ✅ **Role-based authorization**: Uses `has_role()` function for admin checks
- ✅ **Single admin enforcement**: Database prevents multiple admin accounts
- ✅ **Service role limited**: Only used in server-side functions
- ✅ **No plaintext passwords**: Supabase Auth handles password hashing

## Admin Credentials

- **Email**: `admin.gdnyasa@gdnyasa.app`
- **Password**: Set during user creation (choose a strong password)
- **Domain**: Uses `@gdnyasa.app` (not `@gdnyasa.com`)

## Troubleshooting

### Login still fails after creating user

1. **Check browser console** for specific error messages
2. **Verify email matches exactly**: `admin.gdnyasa@gdnyasa.app`
3. **Check database** for user role assignment:
   ```sql
   SELECT * FROM public.user_roles WHERE role = 'admin';
   ```
4. **Verify admin_config**:
   ```sql
   SELECT * FROM public.admin_config;
   ```
5. **Check migration status**:
   ```bash
   npx supabase migration list
   ```

### Role check fails

If `has_role()` function fails, ensure the migration has been applied:
```bash
npx supabase db push
```

### Authentication succeeds but authorization fails

This means the user exists but doesn't have the admin role. Check:
1. Email matches configured admin email in `admin_config`
2. Trigger assigned the role correctly
3. No conflicting roles exist

## Summary

The root cause was that the admin user account `admin.gdnyasa@gdnyasa.app` did not exist in Supabase Auth, even though the database was configured to expect it. The solution is to create this user using one of the provided methods, then the existing authentication system will work correctly.

The code changes made improve error handling and fix a permissions issue that was preventing role checks from working properly.
