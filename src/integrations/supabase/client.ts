
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ixmhtkzxnwytimeidpma.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bWh0a3p4bnd5dGltZWlkcG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjYzMDAsImV4cCI6MjA1ODUwMjMwMH0.mvA7hlXznXqrG-EP-e1y0kmgD8kTl8TMyGpSNEjLfSw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
