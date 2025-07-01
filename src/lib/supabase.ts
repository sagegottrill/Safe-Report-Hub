import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oragklaytwvfwipvamnd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYWdrbGF5dHd2ZndpcHZhbW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjc1NjksImV4cCI6MjA2Njk0MzU2OX0.D3gagJkGpe0Cbhvi-8pGGGTJZQQYRfnF1FzhFhaDnrU';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Map form data to Supabase schema
function mapReportToSupabase(report: any) {
  return {
    // Required fields
    category: report.category || report.sector || '',
    urgency: report.urgency || 'medium',
    message: report.message || report.description || '',
    location: report.location || '',
    is_anonymous: report.is_anonymous ?? report.isAnonymous ?? false,
    platform: report.platform || 'web',
    impact: report.impact || '',
    perpetrator: report.perpetrator || '',
    date: report.date || report.timestamp || report.incidentDate || new Date().toISOString(),
    // Optional: add more mappings as needed
    email: report.email || '',
    phone: report.phone || '',
    reporter_id: report.reporterId || '',
    immediate_danger: report.immediateDanger ?? false,
    contact_details: report.contactDetails || '',
    // Add any other fields your Supabase table supports
  };
}

export async function saveReport(report: any) {
  const mapped = mapReportToSupabase(report);
  const { data, error } = await supabase
    .from('reports')
    .insert([mapped]);
  if (error) {
    // Log the full error object as a string
    console.error('[Supabase] Report submission error:', JSON.stringify(error, null, 2), '\nPayload:', mapped);
    alert('Supabase error: ' + JSON.stringify(error, null, 2) + '\nPayload: ' + JSON.stringify(mapped, null, 2));
  }
  return { data, error };
}

export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
} 