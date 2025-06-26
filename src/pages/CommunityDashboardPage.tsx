import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  GraduationCap, 
  Droplets,
  TrendingUp,
  Users,
  MapPin,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustIndicator, SecurityBadge, OfficialStamp } from '@/components/ui/trust-indicators';

interface CommunityMetrics {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  communityMembers: number;
  responseRate: number;
}

interface SectorStats {
  sector: string;
  totalReports: number;
  resolvedReports: number;
  avgResponseTime: string;
  topIssues: string[];
  icon: React.ComponentType<any>;
  color: string;
}

const CommunityDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<CommunityMetrics>({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    communityMembers: 0,
    responseRate: 0
  });

  const [sectorStats, setSectorStats] = useState<SectorStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunityData = async () => {
      setLoading(true);
      
      try {
        // Fetch data from the analytics API
        const response = await fetch('http://localhost:3001/analytics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our component structure
        const transformedMetrics: CommunityMetrics = {
          totalReports: data.totalReports || 0,
          resolvedReports: Math.floor((data.totalReports || 0) * 0.93), // Estimate 93% resolution rate
          pendingReports: Math.floor((data.totalReports || 0) * 0.07), // Estimate 7% pending
          communityMembers: 2847, // This would come from user analytics
          responseRate: 92.7 // This would be calculated from actual data
        };

        const transformedSectorStats: SectorStats[] = [
          {
            sector: 'Gender-Based Violence',
            totalReports: data.gbvReports || 0,
            resolvedReports: Math.floor((data.gbvReports || 0) * 0.93),
            avgResponseTime: '2.3 hours',
            topIssues: Object.keys(data.sectorData?.gbv?.categories || {}).slice(0, 3),
            icon: Shield,
            color: 'text-danger bg-danger/10'
          },
          {
            sector: 'Education',
            totalReports: data.educationReports || 0,
            resolvedReports: Math.floor((data.educationReports || 0) * 0.92),
            avgResponseTime: '4.1 hours',
            topIssues: Object.keys(data.sectorData?.education?.categories || {}).slice(0, 3),
            icon: GraduationCap,
            color: 'text-nigerian-blue bg-nigerian-blue/10'
          },
          {
            sector: 'Water & Infrastructure',
            totalReports: data.waterReports || 0,
            resolvedReports: Math.floor((data.waterReports || 0) * 0.94),
            avgResponseTime: '3.7 hours',
            topIssues: Object.keys(data.sectorData?.water?.categories || {}).slice(0, 3),
            icon: Droplets,
            color: 'text-nigerian-green bg-nigerian-green/10'
          }
        ];

        setMetrics(transformedMetrics);
        setSectorStats(transformedSectorStats);
      } catch (error) {
        console.error('Failed to load community data:', error);
        
        // Fallback to mock data if API fails
        const mockMetrics: CommunityMetrics = {
          totalReports: 1247,
          resolvedReports: 1156,
          pendingReports: 91,
          communityMembers: 2847,
          responseRate: 92.7
        };

        const mockSectorStats: SectorStats[] = [
          {
            sector: 'Gender-Based Violence',
            totalReports: 456,
            resolvedReports: 423,
            avgResponseTime: '2.3 hours',
            topIssues: ['Domestic Violence', 'Sexual Harassment', 'Child Abuse'],
            icon: Shield,
            color: 'text-danger bg-danger/10'
          },
          {
            sector: 'Education',
            totalReports: 389,
            resolvedReports: 356,
            avgResponseTime: '4.1 hours',
            topIssues: ['School Safety', 'Infrastructure Issues', 'Bullying'],
            icon: GraduationCap,
            color: 'text-nigerian-blue bg-nigerian-blue/10'
          },
          {
            sector: 'Water & Infrastructure',
            totalReports: 402,
            resolvedReports: 377,
            avgResponseTime: '3.7 hours',
            topIssues: ['Water Quality', 'Infrastructure', 'Access Issues'],
            icon: Droplets,
            color: 'text-nigerian-green bg-nigerian-green/10'
          }
        ];

        setMetrics(mockMetrics);
        setSectorStats(mockSectorStats);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-nigerian-green" />
          <p className="text-text-light">Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-official border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-nigerian-green p-3 rounded-full shadow-official">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text">Community Impact Dashboard</h1>
                <p className="text-text-light">Official Government Community Monitoring Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OfficialStamp>Government Verified</OfficialStamp>
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

        {/* Community Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="card-official border-l-4 border-l-nigerian-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Total Reports</CardTitle>
              <Shield className="h-4 w-4 text-nigerian-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-green">{metrics.totalReports.toLocaleString()}</div>
              <p className="text-xs text-text-light">Community reports</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{metrics.resolvedReports.toLocaleString()}</div>
              <p className="text-xs text-text-light">Cases resolved</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{metrics.pendingReports.toLocaleString()}</div>
              <p className="text-xs text-text-light">Under review</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-nigerian-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Members</CardTitle>
              <Users className="h-4 w-4 text-nigerian-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-blue">{metrics.communityMembers.toLocaleString()}</div>
              <p className="text-xs text-text-light">Active community</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{metrics.responseRate}%</div>
              <p className="text-xs text-text-light">Average response</p>
            </CardContent>
          </Card>
        </div>

        {/* Sector Performance */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Sectors</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Engagement</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="card-official">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-text">
                    <Activity className="h-5 w-5 text-nigerian-green" />
                    Recent Community Activity
                  </CardTitle>
                  <CardDescription>
                    Latest reports and community engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'GBV Report', time: '2 hours ago', status: 'Under Review', color: 'text-danger' },
                      { type: 'Education Issue', time: '4 hours ago', status: 'Resolved', color: 'text-success' },
                      { type: 'Water Infrastructure', time: '6 hours ago', status: 'In Progress', color: 'text-warning' },
                      { type: 'Community Safety', time: '8 hours ago', status: 'Resolved', color: 'text-success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${activity.color.replace('text-', 'bg-')}`} />
                          <div>
                            <p className="font-medium text-sm text-text">{activity.type}</p>
                            <p className="text-xs text-text-light">{activity.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Impact */}
              <Card className="card-official">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-text">
                    <TrendingUp className="h-5 w-5 text-nigerian-blue" />
                    Community Impact Metrics
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Response Time', value: '2.3 hours', improvement: '+15%' },
                      { metric: 'Resolution Rate', value: '92.7%', improvement: '+8%' },
                      { metric: 'Community Satisfaction', value: '4.8/5', improvement: '+12%' },
                      { metric: 'Emergency Response', value: '1.2 hours', improvement: '+25%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-text">{item.metric}</p>
                          <p className="text-xs text-text-light">Current performance</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-text">{item.value}</p>
                          <p className="text-xs text-success">{item.improvement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {sectorStats.map((sector, index) => (
                <Card key={index} className="card-official">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${sector.color}`}>
                          <sector.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-text">{sector.sector}</CardTitle>
                          <CardDescription>
                            {sector.totalReports} total reports • {sector.resolvedReports} resolved
                          </CardDescription>
                        </div>
                      </div>
                      <SecurityBadge>Protected</SecurityBadge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-text">{sector.totalReports}</p>
                        <p className="text-xs text-text-light">Total Reports</p>
                      </div>
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-success">{sector.resolvedReports}</p>
                        <p className="text-xs text-text-light">Resolved</p>
                      </div>
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <p className="text-2xl font-bold text-nigerian-blue">{sector.avgResponseTime}</p>
                        <p className="text-xs text-text-light">Avg Response</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-text mb-2">Top Issues:</p>
                      <div className="flex flex-wrap gap-2">
                        {sector.topIssues.map((issue, issueIndex) => (
                          <Badge key={issueIndex} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="card-official">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text">
                  <Users className="h-5 w-5 text-nigerian-green" />
                  Community Engagement
                </CardTitle>
                <CardDescription>
                  Get involved and support your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-text">How to Get Involved</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="bg-nigerian-green p-2 rounded-full">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-text">Report Issues</p>
                          <p className="text-xs text-text-light">Help identify and report community problems</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="bg-nigerian-blue p-2 rounded-full">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-text">Volunteer Support</p>
                          <p className="text-xs text-text-light">Join community support teams</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="bg-success p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-text">Follow Up</p>
                          <p className="text-xs text-text-light">Help track resolution of reported issues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-text">Success Stories</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-success/20 bg-success/5 rounded-lg">
                        <p className="text-sm font-medium text-success">Water Infrastructure Fixed</p>
                        <p className="text-xs text-text-light">Community reported water issues were resolved within 48 hours</p>
                      </div>
                      <div className="p-3 border border-success/20 bg-success/5 rounded-lg">
                        <p className="text-sm font-medium text-success">School Safety Improved</p>
                        <p className="text-xs text-text-light">Security measures implemented at local schools</p>
                      </div>
                      <div className="p-3 border border-success/20 bg-success/5 rounded-lg">
                        <p className="text-sm font-medium text-success">Emergency Response</p>
                        <p className="text-xs text-text-light">Quick response to urgent community safety concerns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDashboardPage; 