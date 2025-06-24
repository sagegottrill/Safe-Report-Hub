import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Plus, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

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
    <div className="p-2 sm:p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-3 rounded-xl shadow-md bg-gradient-to-r from-emerald-100 via-white to-green-100 p-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 p-2 rounded-full shadow-lg flex items-center justify-center" style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.18)' }}>
            <Home className="h-8 w-8 text-white drop-shadow-md" />
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent tracking-tight">{t('Welcome back')}</h1>
        </div>
        <Button onClick={() => setCurrentView('report')} className="bg-gradient-to-r from-emerald-500 to-green-600 text-xs sm:text-sm md:text-base h-12 w-full md:w-auto mt-2 md:mt-0 rounded-full shadow-lg flex items-center gap-2 px-6">
          <Plus className="h-6 w-6 md:h-6 md:w-6 mr-1 md:mr-2" />
          {t('New Report')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-2">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 w-full rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-blue-700 flex items-center gap-2"><FileText className="h-6 w-6 text-blue-600" />{t('Total Reports')}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-blue-700">{userReports.length}</div>
            <p className="text-xs text-blue-600">{t('Your submitted reports')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-200 w-full rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-yellow-700 flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-yellow-600" />{t('underReview')}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-yellow-700">
              {userReports.filter(r => r.status === 'under-review').length}
            </div>
            <p className="text-xs text-yellow-600">{t('Being processed')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-200 w-full rounded-2xl shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-semibold text-green-700 flex items-center gap-2"><CheckCircle className="h-6 w-6 text-green-600" />{t('resolved')}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
            <div className="text-base sm:text-lg md:text-2xl font-bold text-green-700">
              {userReports.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-xs text-green-600">{t('Completed cases')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader className="p-2 sm:p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
            <Shield className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
            {t('Your Reports')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-xs md:text-sm">
            {t('Track the status of your submitted incident reports')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
          {userReports.length === 0 ? (
            <div className="text-center py-4 md:py-8 text-gray-500 text-xs sm:text-sm" aria-live="polite">
              {t('No reports yet')}
              <br />
              {t('Submit your first incident report to get started')}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-4">
              {userReports.map(report => (
                <div key={report.id} className="border rounded-2xl p-3 md:p-5 hover:bg-gray-50 transition-colors shadow-sm flex flex-col gap-1">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      {(() => {
                        switch (report.status) {
                          case 'new': return <Clock className="h-5 w-5 text-blue-500" />;
                          case 'under-review': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
                          case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
                          default: return <FileText className="h-5 w-5 text-gray-400" />;
                        }
                      })()}
                      <h4 className="font-semibold text-xs sm:text-sm md:text-base">{report.type}</h4>
                    </div>
                    <Badge className={`${getStatusColor(report.status)} text-xs sm:text-xs md:text-xs rounded-full px-3 py-1`}> 
                      {report.status ? t(report.status === 'under-review' ? 'underReview' : report.status) : t('unknown')}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                    {(() => {
                      function decryptDescription(encrypted: string) {
                        try {
                          const bytes = CryptoJS.AES.decrypt(encrypted, 'safeaid-demo-key');
                          const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                          return decrypted || encrypted;
                        } catch {
                          return encrypted;
                        }
                      }
                      const desc = decryptDescription(report.description);
                      const isEncrypted = report.description.startsWith('U2FsdGVkX1');
                      if (isEncrypted || !desc || !desc.trim() || desc === report.description) {
                        return report.caseId || 'ID unavailable';
                      }
                      return desc.substring(0, 60) + '...';
                    })()}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-1 sm:gap-0">
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

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 w-full rounded-2xl shadow-md">
        <CardHeader className="p-2 sm:p-3 md:p-6">
          <CardTitle className="text-purple-800 text-xs sm:text-sm md:text-base">{t('Support Resources')}</CardTitle>
          <CardDescription className="text-purple-600 text-xs sm:text-xs md:text-sm">
            {t('Get help and support when you need it most')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
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