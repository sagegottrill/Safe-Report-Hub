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

interface ReportData {
  id: string;
  type: string;
  impact: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  date: string;
  description: string;
}

const AdminDashboard: React.FC<{ user: any }> = () => {
  const navigate = useNavigate();
  const { reports, setReports } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [partnerHubOpen, setPartnerHubOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState('GBV');

  // Filter reports by search term
  const filteredReports = useMemo(() => reports.filter(report =>
    report.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((report.impact ? (Array.isArray(report.impact) ? report.impact.join(', ') : String(report.impact)) : '').toLowerCase().includes(searchTerm.toLowerCase())) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [reports, searchTerm]);

  // Export reports as CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredReports.map(r => ({
      ID: r.id,
      Type: r.type,
      Impact: r.impact,
      Status: r.status,
      Urgency: r.urgency,
      Region: r.region,
      Date: r.date,
      Description: r.description
    })));
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
    filteredReports.forEach((r, i) => {
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
    console.log(`Exported ${filteredReports.length} reports to ${selectedOffice} office.`);
    setPartnerHubOpen(false);
    toast.success(`Reports submitted to ${selectedOffice} office!`);
  };

  // Delete report
  const handleDelete = (id: string) => {
    setReports(prev => {
      const newReports = prev.filter(r => r.id !== id);
      localStorage.setItem('reports', JSON.stringify(newReports));
      return newReports;
    });
  };

  // Update report handler
  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => {
      const newReports = prev.map(r => r.id === reportId ? { ...r, ...updates } : r);
      localStorage.setItem('reports', JSON.stringify(newReports));
      return newReports;
    });
  };

  const stats = [
    { 
      label: 'Total Reports', 
      value: '1,247', 
      change: '+12%', 
      icon: <FileText className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Active Cases', 
      value: '355', 
      change: '+5%', 
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Resolved', 
      value: '892', 
      change: '+18%', 
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Response Time', 
      value: '2.4h', 
      change: '-15%', 
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const sectorStats = [
    { sector: 'GBV', count: 561, percentage: 45, color: 'bg-red-500' },
    { sector: 'Education', count: 374, percentage: 30, color: 'bg-blue-500' },
    { sector: 'Water', count: 187, percentage: 15, color: 'bg-cyan-500' },
    { sector: 'Humanitarian', count: 125, percentage: 10, color: 'bg-green-500' }
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
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
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
                          <span className="font-medium">{item.sector}</span>
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
                            {getSectorIcon(report.type)}
                            <div>
                              <p className="font-medium text-sm">{report.type} - {report.impact}</p>
                              <p className="text-xs text-gray-600">{report.region}</p>
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
                          <td colSpan={8} className="text-center p-3">No reports yet.</td>
                        </tr>
                      ) : (
                        filteredReports.map((report) => (
                          <tr key={report.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm font-medium">{report.id}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {getSectorIcon(report.type)}
                                <span className="text-sm">{report.type}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{Array.isArray(report.impact) ? report.impact.join(', ') : report.impact}</td>
                            <td className="p-3">
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={getPriorityColor(report.urgency)}>
                                {report.urgency}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">{report.region}</td>
                            <td className="p-3 text-sm">
                              {new Date(report.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Button variant="outline" size="sm" onClick={() => { setSelectedReport(report); setModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(report.id)}><Trash className="h-4 w-4" /></Button>
                            </td>
                          </tr>
                        ))
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
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Lagos
                      </span>
                      <span className="font-medium">342 reports</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Kano
                      </span>
                      <span className="font-medium">287 reports</span>
              </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Abuja
                      </span>
                      <span className="font-medium">234 reports</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Borno
                      </span>
                      <span className="font-medium">156 reports</span>
                    </div>
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
            {`> Ready to export ${filteredReports.length} reports to ${selectedOffice} office...`}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerHubOpen(false)}>Cancel</Button>
            <Button onClick={handlePartnerHubSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;