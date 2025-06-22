import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, reports, setCurrentView } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showFaq, setShowFaq] = React.useState(false);

  const userReports = reports.filter(report => 
    !report.isAnonymous && report.reporterId === user?.id
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-3 w-3 md:h-4 md:w-4" />;
      case 'under-review': return <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />;
      case 'resolved': return <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />;
      default: return <FileText className="h-3 w-3 md:h-4 md:w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900">{t('Welcome back')}</h1>
          <p className="text-sm md:text-base text-gray-600">{t('Manage your reports here and access support resources')}</p>
        </div>
        <Button onClick={() => setCurrentView('report')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-sm md:text-base h-8 md:h-10">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          {t('New Report')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">{t('Total Reports')}</CardTitle>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-blue-700">{userReports.length}</div>
            <p className="text-xs text-blue-600">{t('Your submitted reports')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">{t('underReview')}</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-yellow-700">
              {userReports.filter(r => r.status === 'under-review').length}
            </div>
            <p className="text-xs text-yellow-600">{t('Being processed')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">{t('resolved')}</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-lg md:text-2xl font-bold text-green-700">
              {userReports.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-xs text-green-600">{t('Completed cases')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            {t('Your Reports')}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t('Track the status of your submitted incident reports')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          {userReports.length === 0 ? (
            <div className="text-center py-4 md:py-8 text-gray-500 text-sm" aria-live="polite">
              {t('No reports yet')}
              <br />
              {t('Submit your first incident report to get started')}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-4">
              {userReports.map(report => (
                <div key={report.id} className="border rounded-lg p-2 md:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="flex items-center gap-1 md:gap-2">
                      {getStatusIcon(report.status)}
                      <h4 className="font-medium text-xs md:text-sm">{report.type}</h4>
                    </div>
                    <Badge className={`${getStatusColor(report.status)} text-xs`}>
                      {report.status ? t(report.status === 'under-review' ? 'underReview' : report.status) : t('unknown')}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                    {report.description ? report.description.substring(0, 60) : t('noDescription')}...
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="truncate">{report.platform || t('unknownPlatform')}</span>
                    <span className="text-xs">{report.id ? report.id.substring(0, 6) : t('na')}</span>
                    <span className="text-xs">{report.date ? new Date(report.date).toLocaleDateString() : t('na')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-purple-800 text-sm md:text-base">{t('Support Resources')}</CardTitle>
          <CardDescription className="text-purple-600 text-xs md:text-sm">
            {t('Get help and support when you need it most')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <h4 className="font-medium text-purple-800 text-xs md:text-sm">{t('Crisis Support')}</h4>
              <p className="text-xs text-purple-600">{t('24/7 helpline: 1-800-HELP')}</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <h4 className="font-medium text-purple-800 text-xs md:text-sm">{t('Legal Resources')}</h4>
              <p className="text-xs text-purple-600">{t('Free legal consultation available')}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {/* Show More button and FAQ link removed as requested */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;