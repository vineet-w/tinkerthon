import { createClient } from "@supabase/supabase-js";

// Provide fallback placeholders during the build phase to prevent "supabaseUrl is required" errors
// when Next.js statically evaluates the modules. The actual environment variables 
// will be used at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);
