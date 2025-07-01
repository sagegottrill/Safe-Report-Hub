import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oragklaytwvfwipvamnd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYWdrbGF5dHd2ZndpcHZhbW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjc1NjksImV4cCI6MjA2Njk0MzU2OX0.D3gagJkGpe0Cbhvi-8pGGGTJZQQYRfnF1FzhFhaDnrU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveReport(report: {
  category: string;
  urgency: string;
  message: string;
  location?: string;
  is_anonymous?: boolean;
  platform?: string;
  impact?: string;
  perpetrator?: string;
  date?: string;
}) {
  const { data, error } = await supabase
    .from('reports')
    .insert([report]);
  return { data, error };
}

export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
} 