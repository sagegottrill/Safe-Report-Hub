import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, AlertTriangle, CheckCircle, Activity, Users, Settings, BarChart, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChartContainer } from '@/components/ui/chart';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  BarChart as RechartsBarChart
} from 'recharts';

const mockUsers = [
  { id: 1, name: 'Jane Doe', email: 'admin.jane@example.com', role: 'admin' },
  { id: 2, name: 'John Smith', email: 'officer.john@example.com', role: 'officer' },
  { id: 3, name: 'Mary Johnson', email: 'user.mary@example.com', role: 'user' },
];

const mockChannels = [
  { name: 'Web', status: 'Online' },
  { name: 'SMS', status: 'Online' },
  { name: 'USSD', status: 'Offline' },
  { name: 'Email', status: 'Online' },
];

const mockLogs = [
  { time: '2024-06-01 10:00', message: 'SMS channel error: Timeout' },
  { time: '2024-06-01 09:45', message: 'USSD channel offline' },
  { time: '2024-06-01 09:30', message: 'Web channel online' },
];

const mockAuditLogs = [
  { time: '2024-06-01 10:05', action: 'User promoted: John Smith to officer' },
  { time: '2024-06-01 09:50', action: 'Broadcast sent to all users' },
  { time: '2024-06-01 09:20', action: 'User demoted: Mary Johnson to user' },
];

const mockTrends = [
  { date: '2024-05-28', count: 2 },
  { date: '2024-05-29', count: 4 },
  { date: '2024-05-30', count: 3 },
  { date: '2024-05-31', count: 5 },
  { date: '2024-06-01', count: 6 },
];

const GovernorPanel: React.FC = () => {
  const { user, logout, reports } = useAppContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  // Modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  // User management state
  const [users, setUsers] = useState(mockUsers);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Set initial fallback data immediately to prevent flash
      setAnalytics({
        totalReports: reports.length,
        gbvReports: reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv')).length,
        educationReports: reports.filter(r => r.type?.includes('education')).length,
        waterReports: reports.filter(r => r.type?.includes('water')).length,
        urgentReports: reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length,
        recentReports: reports.filter(r => {
          const reportDate = new Date(r.date);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return reportDate > oneDayAgo;
        }).length,
        anonymousReports: reports.filter(r => r.isAnonymous).length,
        followUpRequired: reports.filter(r => r.status === 'new' || r.urgency === 'high').length
      });
      
      try {
        const res = await fetch('/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err: any) {
        console.error('Analytics fetch error:', err);
        // Keep the fallback data that was already set
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [reports]);

  if (!user || user.role !== 'governor') {
    return null;
  }

  // Remove fallback to mock/demo data for metrics
  let totalReports = reports.length;
  let urgentReports = reports.filter(r => (r.riskScore || 0) >= 8 || r.urgency === 'critical').length;
  let resolvedReports = reports.filter(r => r.status === 'resolved').length;
  let underReviewReports = reports.filter(r => r.status === 'under-review').length;

  // Generate real trend data from reports
  const generateTrendData = () => {
    const trends = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const count = reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.toISOString().split('T')[0] === dateKey;
      }).length;
      trends.push({ date: dateKey, count });
    }
    
    return trends;
  };

  const realTrends = generateTrendData();

  // User management actions
  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  // Policy tools actions
  const handleBroadcast = () => {
    alert(`Broadcast sent: ${broadcastMsg}`);
    setBroadcastMsg('');
  };

  const handleExportLogs = () => {
    const csv = mockAuditLogs.map(l => `${l.time},${l.action}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('Governor Panel')}</h1>
              <p className="text-gray-600 mt-1">{t('Multi-sectoral crisis management and analytics')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('Total Reports')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                  <p className="text-sm text-green-600">{t('All time')}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('Urgent Cases')}</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentReports}</p>
                  <p className="text-sm text-red-600">{t('Critical & High')}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('Resolved')}</p>
                  <p className="text-2xl font-bold text-gray-900">{resolvedReports}</p>
                  <p className="text-sm text-green-600">{t('Cases closed')}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('Under Review')}</p>
                  <p className="text-2xl font-bold text-gray-900">{underReviewReports}</p>
                  <p className="text-sm text-yellow-600">{t('Being processed')}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Activity className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governor Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management */}
          <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition" tabIndex={0}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                    <Users className="h-6 w-6 text-gray-500" />{t('User Management')}
                  </CardTitle>
                  <CardDescription>{t('View, promote, or demote admins and officers.')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p className="text-xs mt-2 text-blue-500">{t('Manage Users')}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('User Management')}</DialogTitle>
                <DialogDescription>{t('Promote or demote users below.')}</DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="admin">Admin</option>
                          <option value="officer">Officer</option>
                          <option value="user">User</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUserModalOpen(false)}>{t('Close')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* System Health */}
          <Dialog open={systemModalOpen} onOpenChange={setSystemModalOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition" tabIndex={0}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                    <Settings className="h-6 w-6 text-gray-500" />{t('System Health')}
                  </CardTitle>
                  <CardDescription>{t('Status of all reporting channels, uptime, error logs.')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p className="text-xs mt-2 text-blue-500">{t('View System Status')}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('System Health')}</DialogTitle>
                <DialogDescription>{t('Channel status and error logs.')}</DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Channels</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChannels.map(c => (
                      <TableRow key={c.name}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Error Logs</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLogs.map(l => (
                      <TableRow key={l.time}>
                        <TableCell>{l.time}</TableCell>
                        <TableCell>{l.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSystemModalOpen(false)}>{t('Close')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Policy Tools */}
          <Dialog open={policyModalOpen} onOpenChange={setPolicyModalOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition" tabIndex={0}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                    <FileText className="h-6 w-6 text-gray-500" />{t('Policy Tools')}
                  </CardTitle>
                  <CardDescription>{t('Broadcast messages, export data, audit logs, etc.')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p className="text-xs mt-2 text-blue-500">{t('Access Policy Tools')}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Policy Tools')}</DialogTitle>
                <DialogDescription>{t('Broadcast and audit logs.')}</DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Broadcast Message</h4>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button onClick={handleBroadcast} className="mb-4">Send Broadcast</Button>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Audit Logs</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAuditLogs.map(l => (
                      <TableRow key={l.time}>
                        <TableCell>{l.time}</TableCell>
                        <TableCell>{l.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" onClick={handleExportLogs} className="mt-2">Export Logs (CSV)</Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPolicyModalOpen(false)}>{t('Close')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Analytics & Trends */}
          <Dialog open={analyticsModalOpen} onOpenChange={setAnalyticsModalOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition" tabIndex={0}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                    <BarChart className="h-6 w-6 text-gray-500" />{t('Analytics & Trends')}
                  </CardTitle>
                  <CardDescription>{t('Charts, heatmaps, and trends.')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p className="text-xs mt-2 text-blue-500">{t('View Analytics')}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Analytics & Trends')}</DialogTitle>
                <DialogDescription>{t('Reports trend (real-time data)')}</DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <ChartContainer config={{ trend: { color: '#2563eb', label: 'Reports' } }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsBarChart data={realTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#2563eb" name="Reports" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAnalyticsModalOpen(false)}>{t('Close')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GovernorPanel; 