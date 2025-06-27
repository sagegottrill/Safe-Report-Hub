import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Home, FileText, AlertTriangle, CheckCircle, Users, Activity, Settings, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GovernorAdminPanel: React.FC = () => {
  const { reports, user, setCurrentView } = useAppContext();
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
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-blue-100 p-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 p-3 rounded-2xl shadow-lg flex items-center justify-center" style={{ boxShadow: '0 4px 24px 0 rgba(66,133,244,0.18)' }}>
            <Home className="h-10 w-10 text-white drop-shadow-md" />
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            {t('Governor Super Admin Panel')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-blue-100 text-blue-800 border-blue-200 px-3 py-2 rounded-full font-semibold">
            {t('Governor')}
          </span>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-2">
        <Card className="bg-white border-blue-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-blue-700 flex items-center gap-2"><FileText className="h-7 w-7 text-blue-600" />{t('Total Reports')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900">{totalReports}</div>
            <p className="text-xs text-blue-600 mt-1">
              {t('All time')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-red-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-red-700 flex items-center gap-2"><AlertTriangle className="h-7 w-7 text-red-600" />{t('Urgent Cases')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-red-900">{urgentReports}</div>
            <p className="text-xs text-red-600 mt-1">
              {t('Critical & High')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-green-700 flex items-center gap-2"><CheckCircle className="h-7 w-7 text-green-600" />{t('Resolved')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-900">{resolvedReports}</div>
            <p className="text-xs text-green-600 mt-1">
              {t('Cases closed')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-yellow-100 w-full rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-yellow-700 flex items-center gap-2"><Activity className="h-7 w-7 text-yellow-600" />{t('Under Review')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-900">{underReviewReports}</div>
            <p className="text-xs text-yellow-600 mt-1">
              {t('Being processed')}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Governor Specific Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-4">
            <Users className="h-6 w-6 text-gray-500" />{t('User Management')}
          </CardTitle>
          <CardContent className="text-center text-gray-500">
            <p className="text-sm">{t('View, promote, or demote admins and officers.')}</p>
            <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
            <Button variant="outline" disabled className="mt-4">{t('Manage Users')}</Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-4">
            <Settings className="h-6 w-6 text-gray-500" />{t('System Health')}
          </CardTitle>
          <CardContent className="text-center text-gray-500">
            <p className="text-sm">{t('Status of all reporting channels, uptime, error logs.')}</p>
            <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
            <Button variant="outline" disabled className="mt-4">{t('View System Status')}</Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-4">
            <FileText className="h-6 w-6 text-gray-500" />{t('Policy Tools')}
          </CardTitle>
          <CardContent className="text-center text-gray-500">
            <p className="text-sm">{t('Broadcast messages, export data, audit logs, etc.')}</p>
            <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
            <Button variant="outline" disabled className="mt-4">{t('Access Policy Tools')}</Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg border border-gray-100 bg-white/90 p-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-4">
            <BarChart className="h-6 w-6 text-gray-500" />{t('Analytics & Trends')}
          </CardTitle>
          <CardContent className="text-center text-gray-500">
            <p className="text-sm">{t('Charts, heatmaps, and trends.')}</p>
            <p className="text-xs mt-2 text-blue-500">({t('Coming soon')})</p>
            <Button variant="outline" disabled className="mt-4">{t('View Analytics')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernorAdminPanel; 