import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MultiSectoralDashboard from '@/components/admin/MultiSectoralDashboard';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-official border-l-4 border-l-danger">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Total Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">1,247</div>
              <p className="text-xs text-text-light">
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-nigerian-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Active Users</CardTitle>
              <Users className="h-4 w-4 text-nigerian-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-blue">892</div>
              <p className="text-xs text-text-light">
                <span className="text-success">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Urgent Cases</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">89</div>
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
              <div className="text-2xl font-bold text-success">94%</div>
              <p className="text-xs text-text-light">
                <span className="text-success">+2%</span> from last month
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
                    {[
                      { id: 1, sector: 'GBV', category: 'Domestic Violence', urgency: 'High', time: '2 hours ago' },
                      { id: 2, sector: 'Education', category: 'School Safety', urgency: 'Medium', time: '4 hours ago' },
                      { id: 3, sector: 'Water', category: 'Water Quality', urgency: 'High', time: '6 hours ago' },
                      { id: 4, sector: 'GBV', category: 'Sexual Harassment', urgency: 'Medium', time: '8 hours ago' },
                      { id: 5, sector: 'Education', category: 'Bullying', urgency: 'Low', time: '12 hours ago' }
                    ].map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            report.sector === 'GBV' ? 'bg-danger' :
                            report.sector === 'Education' ? 'bg-nigerian-blue' : 'bg-nigerian-green'
                          }`} />
                          <div>
                            <p className="font-medium text-sm text-text">{report.category}</p>
                            <p className="text-xs text-text-light">{report.sector} • {report.time}</p>
                          </div>
                        </div>
                        <Badge variant={
                          report.urgency === 'High' ? 'destructive' :
                          report.urgency === 'Medium' ? 'secondary' : 'outline'
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
                    {[
                      { sector: 'GBV', reports: 456, urgent: 34, responseTime: '2.3h', icon: Shield, color: 'text-danger' },
                      { sector: 'Education', reports: 389, urgent: 23, responseTime: '4.1h', icon: GraduationCap, color: 'text-nigerian-blue' },
                      { sector: 'Water', reports: 402, urgent: 32, responseTime: '3.7h', icon: Droplets, color: 'text-nigerian-green' }
                    ].map((sector) => (
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
                  Manage user access and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-text-light mb-4" />
                  <p className="text-text-light">User management features coming soon...</p>
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
                  <Settings className="h-12 w-12 mx-auto text-text-light mb-4" />
                  <p className="text-text-light">Settings configuration coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts */}
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-text">
            <strong>System Notice:</strong> The analytics dashboard is currently showing mock data for demonstration purposes. 
            In production, this will be connected to real-time data from your database.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage; 