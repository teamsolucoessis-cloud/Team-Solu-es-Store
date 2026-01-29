import { createClient } from '@supabase/supabase-js';

// Substitua pelos seus dados do painel Supabase (Settings > API)
const supabaseUrl = 'https://yqsygtsixbozkzzrxuez.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxc3lndHNpeGJvemt6enJ4dWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjI0NDQsImV4cCI6MjA4NTI5ODQ0NH0.qi11GnjR-A_KxIT4y2x__PQ9lxyT9bfctZekXhX4KMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);