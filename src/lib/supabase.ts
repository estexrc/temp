
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (typeof window !== 'undefined') {
    if (!supabaseUrl) console.error('Supabase Error: NEXT_PUBLIC_SUPABASE_URL is missing');
    if (!supabaseAnonKey) console.error('Supabase Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');

    // Safety check for malformed keys (too short, etc.)
    if (supabaseAnonKey && supabaseAnonKey.length < 20) {
        console.error('Supabase Error: NEXT_PUBLIC_SUPABASE_ANON_KEY seems dangerously short/malformed');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
