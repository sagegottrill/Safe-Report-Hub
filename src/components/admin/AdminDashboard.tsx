import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Search, AlertTriangle, TrendingUp, Users, FileText, Shield, Activity, MapPin, Clock, CheckCircle, Home, Trash2 } from 'lucide-react';
import ReportReviewModal from './ReportReviewModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { saveAs } from 'file-saver';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
// @ts-ignore: jsPDF types may be missing if not installed
import jsPDF from 'jspdf';
// @ts-ignore: jsPDF-AutoTable types may be missing if not installed
import 'jspdf-autotable';
import CryptoJS from 'crypto-js';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  const { reports, updateReport, deleteReport } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedExportReports, setSelectedExportReports] = useState<string[]>([]);
  const [exportDestination, setExportDestination] = useState('hdx');
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useTranslation();

  // RBAC filtering
  let filteredReports = reports;
  if (user.role === 'field_officer' || user.role === 'case_worker') {
    if (user.allowedCategories) {
      filteredReports = filteredReports.filter(r => user.allowedCategories.includes(r.type.replace(/\s+/g, '_').toLowerCase()));
    }
    if (user.region) {
      filteredReports = filteredReports.filter(r => r.region === user.region);
    }
  } else if (user.role === 'country_admin') {
    if (user.region) {
      filteredReports = filteredReports.filter(r => r.region === user.region);
    }
  }

  filteredReports = filteredReports.filter(report => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.id && report.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.caseId && report.caseId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.type.replace(/\s+/g, '_').toLowerCase() === categoryFilter;
    const matchesUrgency = urgencyFilter === 'all' || (report.urgency || 'medium') === urgencyFilter;
    const matchesRegion = regionFilter === 'all' || (report.region || 'Unknown') === regionFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesUrgency && matchesRegion;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleReviewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleUpdateReport = (reportId: string, updates) => {
    updateReport(reportId, updates);
  };

  const highRiskReports = reports.filter(r => (r.riskScore || 0) >= 8);
  const newReports = reports.filter(r => r.status === 'new');
  const flaggedReports = reports.filter(r => r.flagged);

  // Analytics data
  const reportsPerDay = Object.entries(filteredReports.reduce((acc, r) => {
    const day = new Date(r.date).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {})).map(([date, count]) => ({ date, count }));
  const categoryDist = Object.entries(filteredReports.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {})).map(([type, value]) => ({ name: type, value }));
  const regionDist = Object.entries(filteredReports.reduce((acc, r) => {
    const region = r.region || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {})).map(([region, value]) => ({ region, value }));
  const COLORS = ['#1976D2', '#B3E5FC', '#F5F5DC', '#FBC02D', '#D32F2F', '#388E3C', '#B388FF'];

  // Export handlers
  const handleExportCSV = () => {
    if (!filteredReports.length) {
      toast.error('No reports to export.');
      return;
    }
    const csv = [
      'ID,Type,Date,Platform,Description,Status,Urgency,Region,Anonymous,Flagged',
      ...filteredReports.map(r => [
        r.id, r.type, r.date, r.platform, r.description.replace(/\n/g, ' '), r.status, r.urgency || 'N/A', r.region || 'N/A', r.isAnonymous, r.flagged
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'reports.csv');
    toast.success('CSV exported.');
  };

  const handleExportPDF = () => {
    if (!filteredReports.length) {
      toast.error('No reports to export.');
      return;
    }
    const doc = new jsPDF();
    doc.text('Incident Reports', 14, 16);
    const tableColumn = ['ID', 'Type', 'Date', 'Platform', 'Description', 'Status', 'Urgency', 'Region', 'Anonymous', 'Flagged'];
    const tableRows = filteredReports.map(r => [
      r.id,
      r.type,
      r.date,
      r.platform,
      r.description.replace(/\n/g, ' '),
      r.status,
      r.urgency || 'N/A',
      r.region || 'N/A',
      r.isAnonymous ? 'Yes' : 'No',
      r.flagged ? 'Yes' : 'No',
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('reports.pdf');
    toast.success('PDF exported.');
  };

  const handleSecureEmail = async () => {
    if (!filteredReports.length) {
      toast.error('No reports to export.');
      return;
    }
    try {
      const response = await fetch('/api/send-secure-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredReports),
      });
      if (response.ok) {
        toast.success('Secure email sent!');
      } else {
        toast.error('Failed to send secure email.');
      }
    } catch (err) {
      toast.error('Failed to send secure email.');
    }
  };

  const handleOpenExportModal = () => {
    setSelectedExportReports([]);
    setExportDestination('hdx');
    setExportStatus('idle');
    setExportModalOpen(true);
  };

  const handleExportToHub = async () => {
    if (!selectedExportReports.length) {
      toast.error('No reports selected for export.');
      return;
    }
    setExportStatus('idle');
    const reportsToExport = filteredReports.filter(r => selectedExportReports.includes(r.id));
    const anonymized = reportsToExport.map(r => ({
      type: r.type,
      date: r.date,
      platform: r.platform,
      description: r.description,
      status: r.status,
      urgency: r.urgency || 'N/A',
      region: r.region || 'N/A',
      flagged: r.flagged,
    }));
    try {
      await fetch(exportDestination === 'hdx' ? 'https://example.com/hdx-maiduguri' : 'https://example.com/fedran-neuropsychiatry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anonymized),
      });
      setExportStatus('success');
      toast.success('Export successful!');
    } catch {
      setExportStatus('error');
      toast.error('Export failed. Try again.');
    }
  };

  // Helper to decrypt description
  function decryptDescription(encrypted: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, 'safeaid-demo-key');
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encrypted;
    } catch {
      return encrypted;
    }
  }

  // Helper to generate a caseId if missing
  function generateCaseId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'SR-';
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-green-100 p-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 p-3 rounded-2xl shadow-lg flex items-center justify-center" style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.18)' }}>
            <Home className="h-10 w-10 text-white drop-shadow-md" />
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm bg-green-100 text-green-800 border-green-200 px-3 py-2 rounded-full font-semibold">
            <Shield className="h-5 w-5 mr-1 text-green-600" />
            {user.role.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-2">
        <Card className="bg-white border-blue-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-blue-700 flex items-center gap-2"><FileText className="h-7 w-7 text-blue-600" />Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900">{filteredReports.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              {reports.length} total in system
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-red-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-red-700 flex items-center gap-2"><AlertTriangle className="h-7 w-7 text-red-600" />High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-red-900">{highRiskReports.length}</div>
            <p className="text-xs text-red-600 mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-yellow-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-yellow-700 flex items-center gap-2"><Clock className="h-7 w-7 text-yellow-600" />New Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-900">{newReports.length}</div>
            <p className="text-xs text-yellow-600 mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-green-700 flex items-center gap-2"><CheckCircle className="h-7 w-7 text-green-600" />Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-900">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Successfully handled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700">
            <Search className="h-6 w-6 text-gray-500" />
            Filter & Search Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <Input
              placeholder="Search by ID, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1 lg:col-span-2"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gender_based_violence">Gender-Based Violence</SelectItem>
                <SelectItem value="child_protection">Child Protection</SelectItem>
                <SelectItem value="forced_displacement">Forced Displacement</SelectItem>
                <SelectItem value="food_insecurity">Food Insecurity</SelectItem>
                <SelectItem value="water_sanitation">Water/Sanitation</SelectItem>
                <SelectItem value="shelter_issues">Shelter Issues</SelectItem>
                <SelectItem value="health_emergencies">Health Emergencies</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(reports.map(r => r.region || 'Unknown'))).map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Reports Table */}
      <Card className="rounded-2xl shadow-lg border border-green-100 bg-white/90">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-green-700">
              <FileText className="h-7 w-7 text-green-600" />
              Manage Reports
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>Export CSV</Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>Export PDF</Button>
              <Button variant="outline" size="sm" onClick={handleOpenExportModal}>Submit to Hub</Button>
            </div>
          </div>
          <CardDescription>
            Review, update, and manage all submitted reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anonymous</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flagged</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.id} className={`${report.flagged ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.caseId || generateCaseId()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.type}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.platform}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{(() => {
                      const desc = decryptDescription(report.description);
                      const isEncrypted = report.description.startsWith('U2FsdGVkX1');
                      if (isEncrypted || !desc || !desc.trim() || desc === report.description) {
                        return report.caseId || generateCaseId();
                      }
                      return desc.substring(0, 100) + '...';
                    })()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <Badge className={`${getStatusColor(report.status)}`}>
                        {report.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.urgency || 'N/A'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.region || 'N/A'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.isAnonymous ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{report.flagged ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 flex gap-2 items-center">
                      <Button size="sm" variant="outline" className="rounded-full p-2" onClick={() => handleReviewReport(report)}>
                        <Shield className="h-5 w-5 text-blue-600" />
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-full p-2" onClick={() => deleteReport(report.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <h3 className="font-semibold text-base mb-2 text-gray-700">Reports Per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportsPerDay}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="count" fill="#1976D2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <h3 className="font-semibold text-base mb-2 text-gray-700">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                {categoryDist.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <h3 className="font-semibold text-base mb-2 text-gray-700">Location Heatmap</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={regionDist}>
              <XAxis dataKey="region" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#FBC02D" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Reports to Humanitarian Data Hub</DialogTitle>
          </DialogHeader>
          <div className="mb-2">
            <label className="block text-xs font-semibold mb-1">Destination</label>
            <select value={exportDestination} onChange={e => setExportDestination(e.target.value)} className="border rounded px-2 py-1 text-sm w-full">
              <option value="hdx">{t('ocha_maiduguri_office', 'OCHA Maiduguri Office')}</option>
              <option value="fedran">{t('fedral_neuropsychiatry_hospital_maiduguri', 'Fedral Neuro-psychiatry Hospital Maiduguri')}</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold mb-1">Select Reports</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {filteredReports.map(r => (
                <div key={r.id} className="flex items-center gap-2 mb-1">
                  <input type="checkbox" checked={selectedExportReports.includes(r.id)} onChange={e => {
                    if (e.target.checked) setSelectedExportReports(prev => [...prev, r.id]);
                    else setSelectedExportReports(prev => prev.filter(id => id !== r.id));
                  }} />
                  <span className="text-xs">{r.type} ({r.date})</span>
                </div>
              ))}
            </div>
          </div>
          {exportStatus === 'success' && <div className="text-green-600 text-xs mb-2">Export successful!</div>}
          {exportStatus === 'error' && <div className="text-red-600 text-xs mb-2">Export failed. Try again.</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleExportToHub} disabled={selectedExportReports.length === 0}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportReviewModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        onUpdateReport={handleUpdateReport}
      />
    </div>
  );
};

export default AdminDashboard;