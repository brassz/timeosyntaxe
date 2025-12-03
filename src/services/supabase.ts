import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yzmxyqtfbthtrlnhrnpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bXh5cXRmYnRodHJsbmhybnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3ODUwMjcsImV4cCI6MjA3NTM2MTAyN30.Cn9MFWJ8VEFKEEy6sNAPR0h14nHKkaj-XcA7k10pu24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
