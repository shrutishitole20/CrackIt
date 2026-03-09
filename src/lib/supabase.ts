import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing. Please add them to your Vercel project settings.');
}

// Improved mock to prevent "is not a function" errors
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    signUp: async () => ({ data: { user: null }, error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel.') }),
    signInWithPassword: async () => ({ data: { session: null }, error: new Error('Supabase not configured.') }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ order: () => ({ data: [], error: null }) }),
      in: () => ({ data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: () => ({ data: null, error: null }),
      }),
    }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error('Supabase not configured.') }),
    }),
  },
} as any;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
