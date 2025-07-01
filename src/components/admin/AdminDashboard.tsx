import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Shield,
  School,
  Droplets,
  Heart,
  FileText,
  Eye,
  Settings,
  Download,
  Filter,
  Search,
  Calendar,
  Bell,
  Trash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import ReportReviewModal from './ReportReviewModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { getReports } from '@/lib/supabase';

interface ReportData {
  id: string;
  type: string;
  impact: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  date: string;
  description: string;
  name?: string;
  email?: string;
  phone?: string;
  reporterEmail?: string;
}

// Predefined admin users (same as in AppContext)
const PREDEFINED_ADMINS = [
  {
    id: 'admin-daniel',
    email: 'admin.daniel@bictdareport.com',
    password: '123456',
    name: 'Daniel Admin',
    phone: 'N/A',
    role: 'admin'
  },
  {
    id: 'admin-sj',
    email: 'admin.s.j@bictdareport.com',
    password: '123456',
    name: 'S.J. Admin',
    phone: 'N/A',
    role: 'admin'
  }
];

const AdminDashboard: React.FC<{ user: any }> = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [partnerHubOpen, setPartnerHubOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState('GBV');
  const [customExportOpen, setCustomExportOpen] = useState(false);
  const [exportType, setExportType] = useState('all');
  const [exportId, setExportId] = useState('');
  const [exportIdRange, setExportIdRange] = useState({ from: '', to: '' });
  const [exportDate, setExportDate] = useState<Date | undefined>(undefined);
  const [exportDateRange, setExportDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [exportSector, setExportSector] = useState<string[]>([]);

  const sectorOptions = [
    { value: 'GBV', label: 'GBV' },
    { value: 'Education', label: 'Education' },
    { value: 'Water', label: 'Water' },
    { value: 'Humanitarian', label: 'Humanitarian' },
  ];

  useEffect(() => {
    getReports().then(({ data, error }) => {
      if (!error) setReports(data || []);
    });
  }, []);

  // Filter reports by search term
  const filteredReports = useMemo(() => reports.filter(report =>
    report.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((report.impact ? (Array.isArray(report.impact) ? report.impact.join(', ') : String(report.impact)) : '').toLowerCase().includes(searchTerm.toLowerCase())) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [reports, searchTerm]);

  // Helper function to get user info by reporterId
  const getUserInfo = (reporterId: string, report: any) => {
    // Check predefined admins first
    const predefinedAdmin = PREDEFINED_ADMINS.find(u => u.id === reporterId);
    if (predefinedAdmin) {
      return predefinedAdmin;
    }
    // Otherwise, use info from the report itself
    return {
      name: report.name || 'Unknown',
      email: report.email || report.reporterEmail || 'N/A',
      phone: report.phone || 'N/A'
    };
  };

  // Export reports as CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(reports.map(r => {
      const userInfo = getUserInfo(r.reporterId || '', r);
      return {
        ID: r.id,
        Name: userInfo.name || '',
        Email: userInfo.email || r.reporterEmail || '',
        Phone: userInfo.phone || '',
        Type: r.type,
        Impact: r.impact,
        Status: r.status,
        Urgency: r.urgency,
        Region: r.region,
        Date: r.date,
        Description: r.description
      };
    }));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export reports as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Incident Reports', 10, 10);
    reports.forEach((r, i) => {
      doc.text(`${i + 1}. ${r.type} - ${r.impact} - ${r.status} - ${r.region} - ${r.date}`, 10, 20 + i * 10);
    });
    doc.save('all_reports.pdf');
  };

  // Add export menu handler
  const handleExportPartnerHub = () => {
    setPartnerHubOpen(true);
  };

  const handlePartnerHubSubmit = () => {
    // Simulate sending reports to the selected office
    console.log(`Exported ${reports.length} reports to ${selectedOffice} office.`);
    setPartnerHubOpen(false);
    toast.success(`Reports submitted to ${selectedOffice} office!`);
  };

  // Delete report
  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  // Update report handler
  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updates } : r));
  };

  // Calculate stats from real data
  const totalReports = reports.length;
  const activeCases = reports.filter(r => r.status === 'new' || r.status === 'under-review').length;
  const resolvedCases = reports.filter(r => r.status === 'resolved').length;
  // For now, response time is not tracked, so set as 'N/A'
  const responseTime = 'N/A';

  // Calculate date ranges for change indicators
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const reportsThisMonth = reports.filter(r => {
    const reportDate = new Date(r.date);
    return reportDate >= lastMonth;
  }).length;
  
  const reportsLastMonth = reports.filter(r => {
    const reportDate = new Date(r.date);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    return reportDate >= twoMonthsAgo && reportDate < lastMonth;
  }).length;

  const activeCasesThisMonth = reports.filter(r => {
    const reportDate = new Date(r.date);
    return reportDate >= lastMonth && (r.status === 'new' || r.status === 'under-review');
  }).length;

  const resolvedCasesThisMonth = reports.filter(r => {
    const reportDate = new Date(r.date);
    return reportDate >= lastMonth && r.status === 'resolved';
  }).length;

  // Helper to get the best available sector/type
  const getSector = (report: any) => report.type || report.sector || 'N/A';
  // Helper to get the best available category/impact
  const getCategory = (report: any) => Array.isArray(report.impact) ? report.impact.join(', ') : report.impact || report.category || 'N/A';
  // Helper to get the best available urgency/priority
  const getUrgency = (report: any) => report.urgency || report.priority || 'N/A';
  // Helper to get the best available region/location
  const getRegion = (report: any) => report.region || report.location || 'N/A';
  // Helper to get the best available date
  const getReportDate = (report: any) => report.date || report.timestamp || report.incidentDate || '';
  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // Calculate sector distribution
  const sectorCounts: Record<string, number> = {};
  reports.forEach(r => {
    const sector = getSector(r);
    sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
  });
  const sectorStats = Object.entries(sectorCounts).map(([sector, count]) => ({
    sector,
    count,
    percentage: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
    color: sector === 'GBV' ? 'bg-red-500' : sector === 'Education' ? 'bg-blue-500' : sector === 'Water' ? 'bg-cyan-500' : 'bg-green-500',
  }));

  // Calculate geographic distribution
  const regionCounts: Record<string, number> = {};
  reports.forEach(r => {
    if (r.region) regionCounts[r.region] = (regionCounts[r.region] || 0) + 1;
  });
  const regionStats = Object.entries(regionCounts).map(([region, count]) => ({ region, count }));

  // Stats for metrics cards with proper change indicators
  const stats = [
    {
      label: 'Total Reports',
      value: totalReports,
      change: reportsThisMonth > 0 ? `+${reportsThisMonth} this month` : 'No new reports this month',
      icon: <FileText className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Cases',
      value: activeCases,
      change: activeCasesThisMonth > 0 ? `+${activeCasesThisMonth} this month` : 'No new active cases this month',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Resolved',
      value: resolvedCases,
      change: resolvedCasesThisMonth > 0 ? `+${resolvedCasesThisMonth} this month` : 'No resolved cases this month',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Response Time',
      value: responseTime,
      change: 'Not tracked',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectorIcon = (type: string) => {
    switch (type) {
      case 'GBV': return <Shield className="h-4 w-4" />;
      case 'Education': return <School className="h-4 w-4" />;
      case 'Water': return <Droplets className="h-4 w-4" />;
      case 'Humanitarian': return <Heart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCustomExport = () => {
    setCustomExportOpen(true);
  };

  const handleCustomExportCSV = () => {
    let filtered = reports;
    if (exportType === 'single' && exportId) {
      filtered = reports.filter(r => r.id === exportId);
    } else if (exportType === 'range' && exportIdRange.from && exportIdRange.to) {
      const fromIdx = reports.findIndex(r => r.id === exportIdRange.from);
      const toIdx = reports.findIndex(r => r.id === exportIdRange.to);
      if (fromIdx !== -1 && toIdx !== -1) {
        filtered = reports.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
      }
    } else if (exportType === 'date' && exportDate) {
      filtered = reports.filter(r => new Date(r.date).toDateString() === exportDate.toDateString());
    } else if (exportType === 'dateRange' && exportDateRange.from && exportDateRange.to) {
      filtered = reports.filter(r => {
        const d = new Date(r.date);
        return d >= exportDateRange.from! && d <= exportDateRange.to!;
      });
    } else if (exportType === 'sector' && exportSector.length > 0) {
      filtered = reports.filter(r => exportSector.includes(r.type));
    }
    const csv = Papa.unparse(filtered.map(r => {
      const userInfo = getUserInfo(r.reporterId || '', r);
      return {
        ID: r.id,
        Name: userInfo.name || '',
        Email: userInfo.email || r.reporterEmail || '',
        Phone: userInfo.phone || '',
        Type: r.type,
        Impact: r.impact,
        Status: r.status,
        Urgency: r.urgency,
        Region: r.region,
        Date: r.date,
        Description: r.description
      };
    }));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setCustomExportOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Multi-sectoral crisis management and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <DropdownMenu open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>Export All Reports (CSV)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>Export All Reports (PDF)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>Export Analytics (PDF)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPartnerHub}>Export to Partner Hub</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCustomExport}>Custom Export...</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => navigate('/admin-analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </Button>
            </div>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <div className={stat.color}>{stat.icon}</div>
                      </div>
                    </div>
          </CardContent>
        </Card>
              ))}
            </div>

            {/* Sector Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reports by Sector</CardTitle>
                  <CardDescription>Distribution of reports across different sectors</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-4">
                    {sectorStats.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.sector || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.percentage} className="w-24" />
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
          </CardContent>
        </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest reports and updates</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-4">
                    {reports.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">No reports yet.</div>
                    ) : (
                      reports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getSectorIcon(getSector(report))}
                            <div>
                              <p className="font-medium text-sm">{getSector(report)} - {getCategory(report)}</p>
                              <p className="text-xs text-gray-600">{getRegion(report)}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
          </CardContent>
        </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Reports</CardTitle>
                    <CardDescription>Manage and track all submitted reports</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
          </CardHeader>
          <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">ID</th>
                        <th className="text-left p-3 font-medium">Reporter Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Phone</th>
                        <th className="text-left p-3 font-medium">Sector</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Priority</th>
                        <th className="text-left p-3 font-medium">Location</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="text-center p-3">No reports yet.</td>
                        </tr>
                      ) : (
                        reports.map((report) => {
                          const userInfo = getUserInfo(report.reporterId || '', report);
                          return (
                            <tr key={report.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium">{report.caseId || report.id}</td>
                              <td className="p-3 text-sm">{userInfo.name || 'Anonymous'}</td>
                              <td className="p-3 text-sm">{userInfo.email || report.reporterEmail || 'N/A'}</td>
                              <td className="p-3 text-sm">{userInfo.phone || 'N/A'}</td>
                              <td className="p-3 text-sm">{getSector(report)}</td>
                              <td className="p-3 text-sm">{getCategory(report)}</td>
                              <td className="p-3">
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge className={getPriorityColor(getUrgency(report))}>
                                  {getUrgency(report)}
                                </Badge>
                              </td>
                              <td className="p-3 text-sm">{getRegion(report)}</td>
                              <td className="p-3 text-sm">{formatDate(getReportDate(report))}</td>
                              <td className="p-3">
                                <Button variant="outline" size="sm" onClick={() => { setSelectedReport(report); setModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(report.id)}><Trash className="h-4 w-4" /></Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
        <CardHeader>
                  <CardTitle>Response Time Trends</CardTitle>
                  <CardDescription>Average response time by sector</CardDescription>
        </CardHeader>
        <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        GBV
                      </span>
                      <span className="font-medium">1.2 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <School className="h-4 w-4 text-blue-600" />
                        Education
                      </span>
                      <span className="font-medium">3.5 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        Water
                      </span>
                      <span className="font-medium">2.8 hours</span>
            </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        Humanitarian
                      </span>
                      <span className="font-medium">4.1 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Reports by location</CardDescription>
        </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionStats.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{item.region}</span>
                        </div>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure dashboard preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Email notifications for new reports</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS alerts for critical issues</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Weekly analytics reports</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Export</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" onClick={handleExportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export All Reports (CSV)
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleExportPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Analytics (PDF)
                      </Button>
                    </div>
                  </div>
          </div>
        </CardContent>
      </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ReportReviewModal report={selectedReport} isOpen={modalOpen} onClose={() => setModalOpen(false)} onUpdateReport={handleUpdateReport} />
      {/* Partner Hub Export Modal */}
      <Dialog open={partnerHubOpen} onOpenChange={setPartnerHubOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export to Partner Hub</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Office/Partner:</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedOffice}
              onChange={e => setSelectedOffice(e.target.value)}
            >
              <option value="GBV">GBV Office</option>
              <option value="Education">Education Office</option>
              <option value="Water">Water Office</option>
              <option value="Humanitarian">Humanitarian Office</option>
            </select>
          </div>
          <div className="bg-black text-green-400 font-mono rounded p-3 mb-4 h-32 overflow-auto text-xs">
            {`> Ready to export ${reports.length} reports to ${selectedOffice} office...`}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerHubOpen(false)}>Cancel</Button>
            <Button onClick={handlePartnerHubSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={customExportOpen} onOpenChange={setCustomExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Export</DialogTitle>
          </DialogHeader>
          <div className="mb-4 space-y-4">
            <div>
              <label className="block mb-2 font-medium">Export Type</label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="single">Single Report (by ID)</SelectItem>
                  <SelectItem value="range">Range (by ID)</SelectItem>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="dateRange">By Date Range</SelectItem>
                  <SelectItem value="sector">By Sector</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {exportType === 'single' && (
              <div>
                <label className="block mb-2 font-medium">Report ID</label>
                <input className="border rounded px-3 py-2 w-full" value={exportId} onChange={e => setExportId(e.target.value)} placeholder="Enter Report ID" />
              </div>
            )}
            {exportType === 'range' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-2 font-medium">From ID</label>
                  <input className="border rounded px-3 py-2 w-full" value={exportIdRange.from} onChange={e => setExportIdRange(r => ({ ...r, from: e.target.value }))} placeholder="Start ID" />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-medium">To ID</label>
                  <input className="border rounded px-3 py-2 w-full" value={exportIdRange.to} onChange={e => setExportIdRange(r => ({ ...r, to: e.target.value }))} placeholder="End ID" />
                </div>
              </div>
            )}
            {exportType === 'date' && (
              <div>
                <label className="block mb-2 font-medium">Date</label>
                <Calendar mode="single" selected={exportDate} onSelect={setExportDate} className="border rounded" />
              </div>
            )}
            {exportType === 'dateRange' && (
              <div>
                <label className="block mb-2 font-medium">Date Range</label>
                <Calendar mode="range" selected={exportDateRange} onSelect={setExportDateRange} className="border rounded" />
              </div>
            )}
            {exportType === 'sector' && (
              <div>
                <label className="block mb-2 font-medium">Sector(s)</label>
                <Select value={exportSector[0] || ''} onValueChange={v => setExportSector([v])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomExportOpen(false)}>Cancel</Button>
            <Button onClick={handleCustomExportCSV}>Export CSV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;