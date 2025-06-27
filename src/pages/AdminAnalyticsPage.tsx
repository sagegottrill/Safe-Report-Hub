import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MultiSectoralDashboard from '@/components/admin/MultiSectoralDashboard';
import { useAppContext } from '@/contexts/AppContext';
import { 
  BarChart3, 
  Download, 
  Settings, 
  Users, 
  Shield, 
  GraduationCap, 
  Droplets,
  TrendingUp,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustIndicator, SecurityBadge, OfficialStamp } from '@/components/ui/trust-indicators';

const AdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reports, user } = useAppContext();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Set initial fallback data immediately to prevent flash
      const fallbackData = {
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
      };
      
      setAnalyticsData(fallbackData);
      setLoading(false); // Set loading to false immediately
      
      try {
        const response = await fetch('/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err: any) {
        console.error('Analytics fetch error:', err);
        // Keep the fallback data that was already set
      }
    };

    fetchAnalytics();
  }, [reports]);

  // Calculate real-time metrics
  const totalReports = analyticsData?.totalReports || reports.length;
  const urgentCases = analyticsData?.urgentReports || reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length;
  const recentReports = analyticsData?.recentReports || reports.filter(r => {
    const reportDate = new Date(r.date);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return reportDate > oneDayAgo;
  }).length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const responseRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const activeUsers = user ? 1 : 0; // This would be calculated from actual user data

  // Calculate percentage changes (mock for now, would be real in production)
  const totalReportsChange = '+12%';
  const activeUsersChange = '+8%';
  const responseRateChange = '+2%';

  // Get recent reports for display
  const recentReportsList = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((report, index) => ({
      id: index + 1,
      sector: report.type?.split('_')[0]?.toUpperCase() || 'OTHER',
      category: report.type?.replace(/_/g, ' ') || 'Unknown',
      urgency: report.urgency || 'medium',
      time: new Date(report.date).toLocaleString()
    }));

  // Calculate sector performance
  const sectorPerformance = [
    {
      sector: 'GBV',
      reports: reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv')).length,
      urgent: reports.filter(r => (r.type?.includes('gender') || r.type?.includes('gbv')) && (r.urgency === 'high' || r.urgency === 'critical')).length,
      responseTime: '2.3h',
      icon: Shield,
      color: 'text-danger'
    },
    {
      sector: 'Education',
      reports: reports.filter(r => r.type?.includes('education')).length,
      urgent: reports.filter(r => r.type?.includes('education') && (r.urgency === 'high' || r.urgency === 'critical')).length,
      responseTime: '4.1h',
      icon: GraduationCap,
      color: 'text-nigerian-blue'
    },
    {
      sector: 'Water',
      reports: reports.filter(r => r.type?.includes('water')).length,
      urgent: reports.filter(r => r.type?.includes('water') && (r.urgency === 'high' || r.urgency === 'critical')).length,
      responseTime: '3.7h',
      icon: Droplets,
      color: 'text-nigerian-green'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-nigerian-green" />
          <p className="text-text-light">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-official border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-nigerian-green p-3 rounded-full shadow-official">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">Admin Analytics Center</h1>
                <p className="text-text-light mt-1">Official Government Analytics Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OfficialStamp>Admin Access</OfficialStamp>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="btn-official-outline flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrustIndicator type="security" size="md">
              Secure Analytics
            </TrustIndicator>
            <TrustIndicator type="verified" size="md">
              Real-time Data
            </TrustIndicator>
            <TrustIndicator type="official" size="md">
              Government Monitored
            </TrustIndicator>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-official border-l-4 border-l-danger">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Total Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">{totalReports.toLocaleString()}</div>
              <p className="text-xs text-text-light">
                <span className="text-success">{totalReportsChange}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-nigerian-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Active Users</CardTitle>
              <Users className="h-4 w-4 text-nigerian-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-blue">{activeUsers.toLocaleString()}</div>
              <p className="text-xs text-text-light">
                <span className="text-success">{activeUsersChange}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Urgent Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{urgentCases}</div>
              <p className="text-xs text-text-light">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{responseRate}%</div>
              <p className="text-xs text-text-light">
                <span className="text-success">{responseRateChange}</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="btn-official flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button variant="outline" className="btn-official-outline flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <MultiSectoralDashboard />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reports */}
              <Card className="card-official">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-nigerian-green" />
                    <span>Recent Reports</span>
                  </CardTitle>
                  <CardDescription>
                    Latest reports across all sectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReportsList.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            report.sector === 'GBV' ? 'bg-danger' :
                            report.sector === 'EDUCATION' ? 'bg-nigerian-blue' : 'bg-nigerian-green'
                          }`} />
                          <div>
                            <p className="font-medium text-sm text-text">{report.category}</p>
                            <p className="text-xs text-text-light">{report.sector} • {report.time}</p>
                          </div>
                        </div>
                        <Badge variant={
                          report.urgency === 'high' ? 'destructive' :
                          report.urgency === 'medium' ? 'secondary' : 'outline'
                        }>
                          {report.urgency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sector Performance */}
              <Card className="card-official">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-nigerian-blue" />
                    <span>Sector Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Performance metrics by sector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorPerformance.map((sector) => (
                      <div key={sector.sector} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <sector.icon className={`h-5 w-5 ${sector.color}`} />
                          <div>
                            <p className="font-medium text-text">{sector.sector}</p>
                            <p className="text-sm text-text-light">{sector.reports} reports</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-text">{sector.urgent} urgent</p>
                          <p className="text-xs text-text-light">{sector.responseTime} avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="card-official">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-nigerian-blue" />
                  <span>User Management</span>
                </CardTitle>
                <CardDescription>
                  Manage system users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-text-light">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-official">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-nigerian-green" />
                  <span>System Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure system preferences and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-text-light">Settings configuration coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 