import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, AlertTriangle, CheckCircle, Activity, Users, Settings, BarChart, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GovernorAdminPanel: React.FC = () => {
  const { reports, user, logout } = useAppContext();
  const { t } = useTranslation();

  // Filter reports relevant to the Governor (e.g., all reports or reports from specific regions if desired)
  const totalReports = reports.length;
  const urgentReports = reports.filter(r => (r.riskScore || 0) >= 8 || r.urgency === 'critical').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const underReviewReports = reports.filter(r => r.status === 'under-review').length;

  if (!user || user.role !== 'governor_admin') {
    // Redirect or show access denied message
    return <div className="p-4 text-center text-red-500">{t('accessDenied')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('Governor Super Admin Panel')}</h1>
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

        {/* Governor Specific Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                <Users className="h-6 w-6 text-gray-500" />{t('User Management')}
              </CardTitle>
              <CardDescription>{t('View, promote, or demote admins and officers.')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
              <Button variant="outline" disabled className="mt-4">{t('Manage Users')}</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                <Settings className="h-6 w-6 text-gray-500" />{t('System Health')}
              </CardTitle>
              <CardDescription>{t('Status of all reporting channels, uptime, error logs.')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
              <Button variant="outline" disabled className="mt-4">{t('View System Status')}</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                <FileText className="h-6 w-6 text-gray-500" />{t('Policy Tools')}
              </CardTitle>
              <CardDescription>{t('Broadcast messages, export data, audit logs, etc.')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
              <Button variant="outline" disabled className="mt-4">{t('Access Policy Tools')}</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
                <BarChart className="h-6 w-6 text-gray-500" />{t('Analytics & Trends')}
              </CardTitle>
              <CardDescription>{t('Charts, heatmaps, and trends.')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
              <Button variant="outline" disabled className="mt-4">{t('View Analytics')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GovernorAdminPanel; 