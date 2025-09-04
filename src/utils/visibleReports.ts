export function getVisibleReports(reports: any[]) {
  return (reports || [])
    .filter(r => !r.hidden)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
} 