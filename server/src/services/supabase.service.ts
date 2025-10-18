import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';
import { env } from '../config';

/**
 * Create a Supabase client for server-side usage with Clerk authentication
 * This function extracts the Clerk token from the request and uses it for Supabase auth
 */
export async function createSupabaseClient(req: Request): Promise<{
  supabase: SupabaseClient;
  userId: string | null;
}> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  let clerkUserId: string | null = null;

  // Verify Clerk token if present
  if (token) {
    try {
      const verified = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
      });
      clerkUserId = verified.sub;
    } catch (error) {
      console.error('Error verifying Clerk token:', error);
    }
  }

  // Create Supabase client with the verified user context
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      headers: {
        // Pass the Clerk user ID as a custom header for RLS policies
        'x-clerk-user-id': clerkUserId || '',
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return { supabase, userId: clerkUserId };
}

/**
 * Create a Supabase admin client that bypasses RLS
 * Use this for administrative operations only
 */
export function createSupabaseAdminClient(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
