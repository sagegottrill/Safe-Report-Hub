import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Search, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react';
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

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  const { reports, updateReport } = useAppContext();
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

  return (
    <div className="p-2 md:p-6 space-y-3 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs md:text-base text-gray-600">Monitor and manage incident reports</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-blue-700">{reports.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">New Reports</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-yellow-700">{newReports.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">High Risk / Flagged</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-red-700">{highRiskReports.length} / {flaggedReports.length}</div>
            <div className="text-xs text-red-700">Flagged: {flaggedReports.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-2 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Anonymous</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-purple-700">
              {reports.filter(r => r.isAnonymous).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-2 md:p-6">
          <CardTitle className="text-sm md:text-base">Report Management</CardTitle>
          <CardDescription className="text-xs md:text-sm">Filter and manage incident reports</CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6 pt-0">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-3 md:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 md:left-3 top-2 md:top-3 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 h-8 md:h-10 text-xs md:text-sm"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 h-8 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mb-4" aria-label="Report filters and export options">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
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
              <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Urgency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(reports.map(r => r.region || 'Unknown'))).map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={handleExportCSV} disabled={!filteredReports.length}>Export CSV</Button>
            <Button size="sm" variant="outline" onClick={handleExportPDF}>Export PDF</Button>
            <Button size="sm" variant="outline" onClick={handleSecureEmail}>Secure Email</Button>
            <Button size="sm" variant="outline" onClick={handleOpenExportModal} disabled={!filteredReports.length}>Submit to Humanitarian Hub</Button>
          </div>

          <div className="space-y-2 md:space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8" aria-live="polite">
                No reports match the current filters.
              </div>
            ) : (
              filteredReports.map(report => (
                <div key={report.id} className={`border rounded-lg p-2 md:p-4 hover:bg-gray-50 transition-colors ${report.flagged ? 'border-red-400 bg-red-50' : ''}`}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 md:mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-1 md:gap-3">
                      <h4 className="font-medium text-xs md:text-sm">{report.type}</h4>
                      <Badge className={`${getStatusColor(report.status)} text-xs`}>
                        {report.status.replace('-', ' ')}
                      </Badge>
                      {report.riskScore && (
                        <Badge className={`${getRiskColor(report.riskScore)} text-xs`}>
                          Risk: {report.riskScore}/10
                        </Badge>
                      )}
                      {report.urgency && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">{report.urgency}</Badge>
                      )}
                      {report.flagged && (
                        <Badge className="bg-red-600 text-white text-xs">Flagged</Badge>
                      )}
                      {report.isAnonymous && (
                        <Badge variant="outline" className="text-xs">Anonymous</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(report.date).toLocaleDateString()} | {report.region || 'N/A'}
                    </div>
                  </div>
                  
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                    {report.description.substring(0, 100)}...
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div className="flex flex-wrap gap-2 md:gap-4 text-xs text-gray-500">
                      <span>Platform: {report.platform}</span>
                      <span>ID: {report.id.substring(0, 6)}</span>
                      {report.caseId && (
                        <span>Case ID: {report.caseId}</span>
                      )}
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-6 md:h-8"
                        onClick={() => handleReviewReport(report)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-xs mb-2">Reports Per Day</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={reportsPerDay}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="count" fill="#1976D2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-xs mb-2">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
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
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-xs mb-2">Location Heatmap</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={regionDist}>
              <XAxis dataKey="region" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#FBC02D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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