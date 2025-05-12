import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lxjppgymqevvkwkijbmw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4anBwZ3ltcWV2dmt3a2lqYm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzY0MDUsImV4cCI6MjA1ODM1MjQwNX0.myHftj2BNwDv8b-o4218m3Um1mIwOfq0Jzvc7mQM8GQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);