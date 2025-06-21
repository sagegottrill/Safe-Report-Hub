import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Papa from 'papaparse';

// Replace with your public Google Sheet CSV URL
const PUBLIC_GOOGLE_SHEET_URL = 'YOUR_PUBLIC_GOOGLE_SHEET_CSV_URL_HERE';

interface Report {
  Timestamp: string;
  Category: string;
  Message: string;
  Tags: string;
  Urgency: string;
}

type SortKey = keyof Report;

const PublicDashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'Timestamp', direction: 'descending' });

  useEffect(() => {
    const fetchReports = async () => {
      if (PUBLIC_GOOGLE_SHEET_URL === 'YOUR_PUBLIC_GOOGLE_SHEET_CSV_URL_HERE') {
        setError('Please update the public Google Sheet URL in PublicDashboard.tsx');
        setLoading(false);
        return;
      }
      try {
        Papa.parse(PUBLIC_GOOGLE_SHEET_URL, {
          download: true,
          header: true,
          complete: (result) => {
            const typedData = result.data as Report[];
            setReports(typedData.filter(row => row.Timestamp)); // Filter out empty rows
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to fetch or parse report data.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const sortedReports = useMemo(() => {
    let sortableItems = [...reports];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [reports, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <div className="text-center p-8">Loading reports...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Public Reports</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('Timestamp')}>
                  Timestamp <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('Category')}>
                  Category <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('Urgency')}>
                  Urgency <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.Timestamp}</TableCell>
                <TableCell>{report.Category}</TableCell>
                <TableCell className="max-w-sm truncate">{report.Message}</TableCell>
                <TableCell>{report.Tags}</TableCell>
                <TableCell>{report.Urgency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PublicDashboard; 