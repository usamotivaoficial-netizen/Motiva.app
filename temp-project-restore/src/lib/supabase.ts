import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Quote {
  id: string;
  lang: 'pt' | 'es';
  category: 'foco' | 'disciplina' | 'autoestima' | 'sucesso' | 'fitness' | 'calma';
  text: string;
  is_premium: boolean;
  created_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  quote_id: string;
  created_at?: string;
}
