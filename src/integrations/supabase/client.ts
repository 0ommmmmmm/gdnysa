import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check that VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your .env file.'
  );
}

// Validate that the key looks like a real Supabase JWT (should start with eyJhbGci)
if (!SUPABASE_PUBLISHABLE_KEY.startsWith('eyJhbGci')) {
  console.error(
    'Invalid Supabase API key format. The key should be a JWT token starting with "eyJhbGci".',
    '\nCurrent key starts with:', SUPABASE_PUBLISHABLE_KEY.substring(0, 20),
    '\nPlease replace it with your actual Supabase anon/public key from https://supabase.com/dashboard'
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);