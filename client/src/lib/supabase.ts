import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton client instance for frontend operations (e.g., storage upload, client-side queries)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to get user profile image from Supabase Storage bucket
 */
export const getStoragePublicUrl = (bucket: string, path: string): string => {
  if (!supabaseUrl) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
