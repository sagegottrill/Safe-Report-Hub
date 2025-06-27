import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, AlertTriangle, Settings, Download, Activity, Home } from 'lucide-react';

const GovernorPanel: React.FC = () => {
  const { user, reports } = useAppContext();
  const navigate = useNavigate();

  if (!user || user.role !== 'governor') {
    navigate('/');
    return null;
  }

  // Example analytics
  const totalReports = reports.length;
  const urgentCases = reports.filter(r => r.urgency === 'critical' || r.urgency === 'high').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const underReview = reports.filter(r => r.status === 'under-review').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-nigerian-blue mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-nigerian-blue" />
            Governor Super Admin Panel
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-nigerian-blue text-white px-3 py-1 rounded-full text-sm font-semibold">Governor</span>
            <span className="text-lg font-medium text-gray-700">{user.name}</span>
          </div>
        </div>
        <button
          className="bg-nigerian-blue text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-nigerian-blue/90"
          onClick={() => navigate('/')}
        >
          <Home className="inline-block mr-2" />Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-nigerian-blue">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5 text-nigerian-blue" />
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nigerian-blue">{totalReports}</div>
            <div className="text-xs text-gray-500">All time</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-danger">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <CardTitle>Urgent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{urgentCases}</div>
            <div className="text-xs text-gray-500">Critical & High</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Activity className="h-5 w-5 text-success" />
            <CardTitle>Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{resolved}</div>
            <div className="text-xs text-gray-500">Cases closed</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Settings className="h-5 w-5 text-warning" />
            <CardTitle>Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{underReview}</div>
            <div className="text-xs text-gray-500">Being processed</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View, promote, or demote admins and officers. (Coming soon)</p>
            <Users className="h-8 w-8 text-nigerian-blue mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status of all reporting channels, uptime, error logs. (Coming soon)</p>
            <Settings className="h-8 w-8 text-nigerian-blue mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Policy Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Broadcast messages, export data, audit logs, etc. (Coming soon)</p>
            <Download className="h-8 w-8 text-nigerian-blue mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Charts, heatmaps, and trends. (Coming soon)</p>
            <BarChart3 className="h-8 w-8 text-nigerian-blue mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernorPanel; 