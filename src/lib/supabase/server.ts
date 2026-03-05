import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Lazy-load to avoid build-time errors
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// For backward compatibility
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
