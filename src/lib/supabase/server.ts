import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

// Function to create a server-side client
export async function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
