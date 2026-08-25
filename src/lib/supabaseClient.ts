import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client.
 *
 * This uses the SERVICE ROLE key, which bypasses Row Level Security
 * entirely. That's intentional here: every read/write to `stories` already
 * goes through our own validated Next.js Route Handlers (title/body length
 * checks, collection whitelist, rate limiting), so the DB itself can stay
 * locked down (RLS enabled, zero public policies — see supabase/schema.sql)
 * and only this server-side client can touch it at all.
 *
 * NEVER:
 *   - import this file from a Client Component ('use client')
 *   - prefix these env vars with NEXT_PUBLIC_
 *   - send SUPABASE_SERVICE_ROLE_KEY to the browser in any form
 */

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local ' +
      '(see .env.local.example) and to your host\u2019s environment variables in production.'
  );
}

export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});