import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvqxrhvffhkkufzptimx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cXhyaHZmZmhra3VmenB0aW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDQ1MjUsImV4cCI6MjA2NDY4MDUyNX0.ucf5C3hSxC9CGVKmgMpVW1-JFsgDLumOJhdVm2ulL2E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);