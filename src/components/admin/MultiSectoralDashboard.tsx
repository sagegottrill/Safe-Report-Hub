import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppContext } from '@/contexts/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Shield, 
  GraduationCap, 
  Droplets,
  AlertTriangle,
  Clock,
  MapPin,
  Activity
} from 'lucide-react';

interface DashboardMetrics {
  totalReports: number;
  gbvReports: number;
  educationReports: number;
  waterReports: number;
  urgentReports: number;
  recentReports: number;
  anonymousReports: number;
  followUpRequired: number;
}

interface SectorData {
  sector: string;
  count: number;
  urgent: number;
  anonymous: number;
  categories: { [key: string]: number };
  trends: { date: string; count: number }[];
}

const MultiSectoralDashboard: React.FC = () => {
  const { reports } = useAppContext();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalReports: 0,
    gbvReports: 0,
    educationReports: 0,
    waterReports: 0,
    urgentReports: 0,
    recentReports: 0,
    anonymousReports: 0,
    followUpRequired: 0
  });

  const [sectorData, setSectorData] = useState<{ [key: string]: SectorData }>({});
  const [timeFilter, setTimeFilter] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data from API
    const loadDashboardData = async () => {
      // Set initial fallback data immediately to prevent flash
      const fallbackMetrics: DashboardMetrics = {
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

      const fallbackSectorData = {
        gbv: {
          sector: 'GBV',
          count: fallbackMetrics.gbvReports,
          urgent: reports.filter(r => (r.type?.includes('gender') || r.type?.includes('gbv')) && (r.urgency === 'high' || r.urgency === 'critical')).length,
          anonymous: reports.filter(r => (r.type?.includes('gender') || r.type?.includes('gbv')) && r.isAnonymous).length,
          categories: calculateCategories(reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv'))),
          trends: generateTrends(reports.filter(r => r.type?.includes('gender') || r.type?.includes('gbv')))
        },
        education: {
          sector: 'Education',
          count: fallbackMetrics.educationReports,
          urgent: reports.filter(r => r.type?.includes('education') && (r.urgency === 'high' || r.urgency === 'critical')).length,
          anonymous: reports.filter(r => r.type?.includes('education') && r.isAnonymous).length,
          categories: calculateCategories(reports.filter(r => r.type?.includes('education'))),
          trends: generateTrends(reports.filter(r => r.type?.includes('education')))
        },
        water: {
          sector: 'Water',
          count: fallbackMetrics.waterReports,
          urgent: reports.filter(r => r.type?.includes('water') && (r.urgency === 'high' || r.urgency === 'critical')).length,
          anonymous: reports.filter(r => r.type?.includes('water') && r.isAnonymous).length,
          categories: calculateCategories(reports.filter(r => r.type?.includes('water'))),
          trends: generateTrends(reports.filter(r => r.type?.includes('water')))
        }
      };

      setMetrics(fallbackMetrics);
      setSectorData(fallbackSectorData);
      setLoading(false); // Set loading to false immediately
      
      try {
        // Fetch data from the analytics API
        const response = await fetch('/analytics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our component structure
        const transformedMetrics: DashboardMetrics = {
          totalReports: data.totalReports || 0,
          gbvReports: data.gbvReports || 0,
          educationReports: data.educationReports || 0,
          waterReports: data.waterReports || 0,
          urgentReports: data.urgentReports || 0,
          recentReports: data.recentReports || 0,
          anonymousReports: data.anonymousReports || 0,
          followUpRequired: data.followUpRequired || 0
        };

        const transformedSectorData = {
          gbv: {
            sector: 'GBV',
            count: data.sectorData?.gbv?.count || 0,
            urgent: data.sectorData?.gbv?.urgent || 0,
            anonymous: data.sectorData?.gbv?.anonymous || 0,
            categories: data.sectorData?.gbv?.categories || {},
            trends: data.sectorData?.gbv?.trends || []
          },
          education: {
            sector: 'Education',
            count: data.sectorData?.education?.count || 0,
            urgent: data.sectorData?.education?.urgent || 0,
            anonymous: data.sectorData?.education?.anonymous || 0,
            categories: data.sectorData?.education?.categories || {},
            trends: data.sectorData?.education?.trends || []
          },
          water: {
            sector: 'Water',
            count: data.sectorData?.water?.count || 0,
            urgent: data.sectorData?.water?.urgent || 0,
            anonymous: data.sectorData?.water?.anonymous || 0,
            categories: data.sectorData?.water?.categories || {},
            trends: data.sectorData?.water?.trends || []
          }
        };

        setMetrics(transformedMetrics);
        setSectorData(transformedSectorData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Keep the fallback data that was already set
      }
    };

    loadDashboardData();
  }, [reports, timeFilter]);

  // Helper function to calculate categories
  const calculateCategories = (sectorReports: any[]) => {
    const categories: { [key: string]: number } = {};
    sectorReports.forEach(report => {
      const category = report.type?.replace(/_/g, ' ') || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  };

  // Helper function to generate trends
  const generateTrends = (sectorReports: any[]) => {
    const trends: { date: string; count: number }[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const count = sectorReports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.toISOString().split('T')[0] === dateKey;
      }).length;
      trends.push({ date: dateKey, count });
    }
    
    return trends;
  };

  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'gbv': return <Shield className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'gbv': return 'text-red-600 bg-red-100';
      case 'education': return 'text-blue-600 bg-blue-100';
      case 'water': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Multi-Sectoral Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights across all sectors</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReports.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.urgentReports}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.urgentReports / metrics.totalReports) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentReports}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-up Required</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.followUpRequired}</div>
            <p className="text-xs text-muted-foreground">
              Pending action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sector Breakdown */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gbv">GBV</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(sectorData).map(([key, data]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getSectorIcon(data.sector)}
                    <span>{data.sector} Reports</span>
                  </CardTitle>
                  <CardDescription>
                    {data.count} total reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Urgent</span>
                      <Badge variant="destructive">{data.urgent}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Anonymous</span>
                      <Badge variant="secondary">{data.anonymous}</Badge>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                      {Object.entries(data.categories)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center text-xs">
                            <span className="truncate">{category}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {Object.entries(sectorData).map(([key, data]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>
                    Reports by category for {data.sector}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data.categories)
                      .sort(([,a], [,b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(count / data.count) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trends</CardTitle>
                  <CardDescription>
                    7-day trend for {data.sector} reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between space-x-1">
                    {data.trends.map((trend, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="bg-blue-600 rounded-t w-8"
                          style={{ height: `${(trend.count / Math.max(...data.trends.map(t => t.count))) * 120}px` }}
                        />
                        <span className="text-xs text-gray-500">
                          {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Urgency Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{data.urgent}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.urgent / data.count) * 100).toFixed(1)}% of reports
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Anonymous Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.anonymous}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.anonymous / data.count) * 100).toFixed(1)}% of reports
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Daily</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(data.count / 7).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reports per day
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Alerts and Notifications */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>High Priority:</strong> {metrics.urgentReports} urgent reports require immediate attention. 
          <Button variant="link" className="p-0 h-auto text-orange-800 underline">
            View urgent reports
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MultiSectoralDashboard; 