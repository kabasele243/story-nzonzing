import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for client-side usage with Clerk authentication
 * This hook provides a Supabase client that automatically uses the Clerk session token
 */
export function useSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await getToken({ template: 'supabase' });

        const headers = new Headers(options.headers);
        if (clerkToken) {
          headers.set('Authorization', `Bearer ${clerkToken}`);
        }

        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });

  return supabase;
}

/**
 * Create a basic Supabase client without authentication
 * Use this for public data access only
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
