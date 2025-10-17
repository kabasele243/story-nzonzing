import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Create a Supabase client for server-side usage in Next.js Server Components
 * This uses the Clerk session token for authentication
 */
export async function createSupabaseServerClient() {
  const { getToken } = await auth();
  const clerkToken = await getToken({ template: 'supabase' });

  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: clerkToken
        ? {
            Authorization: `Bearer ${clerkToken}`,
          }
        : {},
    },
  });
}

/**
 * Create a Supabase admin client for server-side operations
 * This bypasses RLS policies - use with caution
 */
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
