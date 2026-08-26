/**
 * EquiFlow Supabase Client (src/supabase.js)
 * 
 * Provides connection to Supabase cloud PostgreSQL database for Layer 1 & Layer 2.
 * Uses environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.log("ℹ️ Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) not set. Running in local reactive state mode.");
}
