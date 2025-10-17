import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Create a Supabase client for server-side usage with Clerk authentication
 * This function extracts the Clerk token from the request and uses it for Supabase auth
 */
export async function createSupabaseClient(req: Request) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  let clerkUserId: string | null = null;

  // Verify Clerk token if present
  if (token) {
    try {
      const verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      clerkUserId = verified.sub;
    } catch (error) {
      console.error('Error verifying Clerk token:', error);
    }
  }

  // Create Supabase client with the verified user context
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Middleware to verify Clerk authentication and attach user context
 */
export async function requireAuth(req: Request, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Attach user info to request
    (req as any).userId = verified.sub;
    (req as any).user = verified;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}
