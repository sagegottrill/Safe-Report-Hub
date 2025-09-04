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
  Home,
  FileText,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustIndicator, SecurityBadge, OfficialStamp } from '@/components/ui/trust-indicators';
import { useAppContext } from '@/contexts/AppContext';
import { sectorLabels } from '@/components/report/SectorSelector';
import { getVisibleReports } from '@/utils/visibleReports';

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
  const { reports } = useAppContext();
  const [metrics, setMetrics] = useState<CommunityMetrics>({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    communityMembers: 0,
    responseRate: 0
  });

  const [sectorStats, setSectorStats] = useState<SectorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visibleReports = getVisibleReports(reports);

  useEffect(() => {
    const loadCommunityData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data from the analytics API
        const response = await fetch('/analytics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our component structure
        const transformedMetrics: CommunityMetrics = {
          totalReports: data.totalReports || 0,
          resolvedReports: data.resolvedReports || 0,
          pendingReports: data.pendingReports || 0,
          communityMembers: data.communityMembers || 0,
          responseRate: data.responseRate || 0
        };

        // Helper to infer sector from category/impact
        const inferSector = (report: any) => {
          const text = `${report.category || ''} ${report.impact || ''} ${report.description || ''}`.toLowerCase();
          if (text.match(/violence|rape|sexual|gbv|abuse|harassment|traffick/)) return 'gbv';
          if (text.match(/school|teacher|education|learning/)) return 'education';
          if (text.match(/water|sanitation|hygiene|infrastructure/)) return 'water';
          if (text.match(/humanitarian|crisis|aid|relief/)) return 'humanitarian';
          return undefined;
        };

        const getSector = (report: any) => {
          let raw = report.sector;
          if (!raw) raw = inferSector(report);
          if (!raw) return 'Unknown Sector';
          return sectorLabels[String(raw).toLowerCase()] || 'Unknown Sector';
        };

        const transformedSectorStats: SectorStats[] = [
          {
            sector: getSector({ type: 'gbv' }),
            totalReports: data.gbvReports || 0,
            resolvedReports: data.gbvResolved || 0,
            avgResponseTime: data.gbvResponseTime || 'N/A',
            topIssues: data.sectorData?.gbv?.categories ? Object.keys(data.sectorData.gbv.categories).slice(0, 3) : [],
            icon: Shield,
            color: 'text-danger bg-danger/10'
          },
          {
            sector: getSector({ type: 'education' }),
            totalReports: data.educationReports || 0,
            resolvedReports: data.educationResolved || 0,
            avgResponseTime: data.educationResponseTime || 'N/A',
            topIssues: data.sectorData?.education?.categories ? Object.keys(data.sectorData.education.categories).slice(0, 3) : [],
            icon: GraduationCap,
            color: 'text-nigerian-blue bg-nigerian-blue/10'
          },
          {
            sector: getSector({ type: 'water' }),
            totalReports: data.waterReports || 0,
            resolvedReports: data.waterResolved || 0,
            avgResponseTime: data.waterResponseTime || 'N/A',
            topIssues: data.sectorData?.water?.categories ? Object.keys(data.sectorData.water.categories).slice(0, 3) : [],
            icon: Droplets,
            color: 'text-nigerian-green bg-nigerian-green/10'
          }
        ];

        setMetrics(transformedMetrics);
        setSectorStats(transformedSectorStats);
      } catch (error) {
        console.error('Failed to load community data:', error);
        setError('Failed to load analytics data from server');
        
        // Use real data from AppContext as fallback
        const totalReports = reports.length;
        const activeCases = reports.filter(r => (r.status === 'new' || r.status === 'under-review')).length;
        const resolvedCases = reports.filter(r => r.status === 'resolved').length;
        // Calculate average response time for resolved cases
        const resolvedReports = reports.filter(r => r.status === 'resolved' && r.date && r.resolvedAt);
        const responseTime = resolvedReports.length > 0
          ? `${Math.round(resolvedReports.reduce((sum, r) => sum + (new Date(r.resolvedAt).getTime() - new Date(r.date).getTime()), 0) / resolvedReports.length / 3600000)}h`
          : 'N/A';

        // Recent Activity: show sector, category, and status
        const recentActivity = reports.slice(0, 10).map(r => ({
          sector: getSector(r),
          category: r.category || r.impact || 'Unknown',
          status: r.status,
          reporter: r.reporterEmail || r.reporterId || 'Unknown',
          date: r.date,
        }));
        
        const realMetrics: CommunityMetrics = {
          totalReports: totalReports,
          resolvedReports: resolvedCases,
          pendingReports: activeCases,
          communityMembers: 0, // Will be populated when user analytics are available
          responseRate: Math.round((resolvedCases / totalReports) * 100)
        };

        const realSectorStats: SectorStats[] = [
          {
            sector: 'Gender-Based Violence',
            totalReports: reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv')).length,
            resolvedReports: reports.filter(r => (r.type?.includes('gender') || r.type?.includes('gbv')) && r.status === 'resolved').length,
            avgResponseTime: responseTime,
            topIssues: calculateTopIssues(reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv'))),
            icon: Shield,
            color: 'text-danger bg-danger/10'
          },
          {
            sector: 'Education',
            totalReports: reports.filter(r => r.type?.includes('education')).length,
            resolvedReports: reports.filter(r => r.type?.includes('education') && r.status === 'resolved').length,
            avgResponseTime: responseTime,
            topIssues: calculateTopIssues(reports.filter(r => r.type?.includes('education'))),
            icon: GraduationCap,
            color: 'text-nigerian-blue bg-nigerian-blue/10'
          },
          {
            sector: 'Water & Infrastructure',
            totalReports: reports.filter(r => r.type?.includes('water')).length,
            resolvedReports: reports.filter(r => r.type?.includes('water') && r.status === 'resolved').length,
            avgResponseTime: responseTime,
            topIssues: calculateTopIssues(reports.filter(r => r.type?.includes('water'))),
            icon: Droplets,
            color: 'text-nigerian-green bg-nigerian-green/10'
          }
        ];

        setMetrics(realMetrics);
        setSectorStats(realSectorStats);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [reports]);

  // Helper function to calculate top issues
  const calculateTopIssues = (sectorReports: any[]) => {
    const issues: { [key: string]: number } = {};
    sectorReports.forEach(report => {
      const issue = report.type?.replace(/_/g, ' ') || 'Other';
      issues[issue] = (issues[issue] || 0) + 1;
    });
    return Object.keys(issues).sort((a, b) => issues[b] - issues[a]).slice(0, 3);
  };

  // Get recent reports for activity feed
  const getRecentReports = () => {
    return reports
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(report => ({
        type: report.type || 'Report',
        time: new Date(report.date).toLocaleDateString(),
        status: report.status || 'New',
        color: report.status === 'resolved' ? 'text-success' : 
               report.status === 'under-review' ? 'text-warning' : 'text-danger'
      }));
  };

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
                    {getRecentReports().length > 0 ? (
                      getRecentReports().map((activity, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No recent activity</p>
                        <p className="text-gray-400 text-xs">Reports will appear here as they are submitted</p>
                      </div>
                    )}
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
                    {metrics.totalReports > 0 ? (
                      [
                        { metric: 'Response Time', value: 'N/A', improvement: 'Data collection in progress' },
                        { metric: 'Resolution Rate', value: `${metrics.responseRate}%`, improvement: 'Based on current data' },
                        { metric: 'Community Satisfaction', value: 'N/A', improvement: 'Survey system pending' },
                        { metric: 'Emergency Response', value: 'N/A', improvement: 'Tracking system pending' }
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No metrics available</p>
                        <p className="text-gray-400 text-xs">Metrics will appear as data is collected</p>
                      </div>
                    )}
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
                        {sector.topIssues.length > 0 ? (
                          sector.topIssues.map((issue, issueIndex) => (
                            <Badge key={issueIndex} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No issues reported yet</p>
                        )}
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
                      {metrics.totalReports > 0 ? (
                        <div className="p-3 border border-success/20 bg-success/5 rounded-lg">
                          <p className="text-sm font-medium text-success">Data Collection Active</p>
                          <p className="text-xs text-text-light">Community reports are being collected and processed</p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-sm">No success stories yet</p>
                          <p className="text-gray-400 text-xs">Success stories will appear as issues are resolved</p>
                        </div>
                      )}
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