import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);
