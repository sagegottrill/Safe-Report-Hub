import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Plus, Home, Users, MapPin, Pencil, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { TrustIndicator, SecurityBadge } from '@/components/ui/trust-indicators';
import EnhancedReportForm from '@/components/report/EnhancedReportForm';
import Papa from 'papaparse';
import ReportReviewModal from '../admin/ReportReviewModal';

const generateShortId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

const Dashboard: React.FC = () => {
  const { user, reports, setCurrentView, setReports } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Ensure user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Filter reports by search term and ensure only current user's reports
  const userReports = useMemo(() => {
    // First, filter by current user ID to ensure user isolation
    const currentUserReports = reports.filter(report => {
      // Only show reports that belong to the current user
      return report.reporterId === user?.id;
    });

    // Then apply search filter
    return currentUserReports.filter(report => 
      !report.isAnonymous && (
        report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [reports, user?.id, searchTerm]);

  // Debug logging to help identify issues
  console.log('Dashboard Debug:', {
    totalReports: reports.length,
    currentUserId: user?.id,
    currentUserEmail: user?.email,
    userReportsCount: userReports.length,
    allReportsWithUserIds: reports.map(r => ({ id: r.id, reporterId: r.reporterId, email: r.reporterEmail }))
  });

  // Export reports as CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(userReports.map(r => ({
      ID: r.id,
      Type: r.type,
      CaseID: r.caseId,
      Status: r.status,
      Description: r.description,
      Date: r.date,
      Platform: r.platform,
      ReporterEmail: r.reporterEmail || ''
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete report
  const handleDelete = (id: string) => {
    setReports(prev => {
      const newReports = prev.filter(r => r.id !== id);
      localStorage.setItem('reports', JSON.stringify(newReports));
      return newReports;
    });
  };

  // Update report
  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => {
      const newReports = prev.map(r => r.id === reportId ? { ...r, ...updates } : r);
      localStorage.setItem('reports', JSON.stringify(newReports));
      return newReports;
    });
    setModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'under-review': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-info-light text-info border border-info';
      case 'under-review': return 'bg-warning-light text-warning border border-warning';
      case 'resolved': return 'bg-success-light text-success border border-success';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-official border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-nigerian-green p-3 rounded-full shadow-official">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text">
                  {t('Welcome back')}, {user?.name || user?.email}
                </h1>
                <p className="text-text-light">Your Personal Dashboard - Official Government Crisis Reporting Platform</p>
                <p className="text-xs text-gray-500 mt-1">User ID: {user?.id} | Email: {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate('/report')} className="btn-official flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t('New Report')}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust and Security Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrustIndicator type="security" size="md">
            Secure & Encrypted
          </TrustIndicator>
          <TrustIndicator type="privacy" size="md">
            Anonymous Reporting Available
          </TrustIndicator>
          <TrustIndicator type="official" size="md">
            Government Verified
          </TrustIndicator>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-official border-l-4 border-l-nigerian-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-text flex items-center gap-2">
                <FileText className="h-5 w-5 text-nigerian-green" />
                {t('Your Reports')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-green">{userReports.length}</div>
              <p className="text-xs text-text-light">Reports you've submitted</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-nigerian-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-text flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-nigerian-blue" />
                {t('underReview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nigerian-blue">
                {userReports.filter(r => r.status === 'under-review').length}
              </div>
              <p className="text-xs text-text-light">Your reports being processed</p>
            </CardContent>
          </Card>

          <Card className="card-official border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-text flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                {t('resolved')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {userReports.filter(r => r.status === 'resolved').length}
              </div>
              <p className="text-xs text-text-light">Your completed cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <Card className="card-official">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-text">
                  <Shield className="h-6 w-6 text-nigerian-green" />
                  {t('Your Reports')}
                </CardTitle>
                <CardDescription className="text-sm text-text-light mt-1">
                  {t('Track the status of your submitted incident reports')}
                </CardDescription>
              </div>
              <SecurityBadge>Protected</SecurityBadge>
            </div>
          </CardHeader>
          <CardContent>
            {userReports.length === 0 ? (
              <div className="text-center py-12 text-text-light">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-text mb-2">You haven't submitted any reports yet</p>
                <p className="text-sm text-text-light mb-4">This is your personal dashboard. Submit your first incident report to get started.</p>
                <Button 
                  onClick={() => navigate('/report')} 
                  className="btn-official"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Report
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userReports.map(report => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(report.status)}
                        <div>
                          <h4 className="font-semibold text-text">{report.type}</h4>
                          <p className="text-sm text-text-light">Case ID: {report.caseId || report.id?.substring(0, 8)}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(report.status)} text-xs font-medium rounded-full px-3 py-1`}>
                        {report.status ? t(report.status === 'under-review' ? 'underReview' : report.status) : t('unknown')}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-light mb-3">
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
                        return desc.substring(0, 80) + (desc.length > 80 ? '...' : '');
                      })()}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-text-light gap-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.platform || t('unknownPlatform')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {report.date ? new Date(report.date).toLocaleDateString() : t('na')}
                        </span>
                      </div>
                      {report.isAnonymous && (
                        <TrustIndicator type="anonymous" size="sm">
                          Anonymous
                        </TrustIndicator>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedReport({
                          ...report,
                          reporterName: user?.name || '',
                          reporterEmail: user?.email || report.reporterEmail || '',
                          reporterPhone: user?.phone || '',
                          urgency: report.urgency || '',
                          region: report.region || '',
                          caseId: report.caseId || report.id || '',
                        });
                        setModalOpen(true);
                        setEditMode(false);
                      }}><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-official">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <Shield className="h-5 w-5 text-nigerian-green" />
                Community Dashboard
              </CardTitle>
              <CardDescription>
                View community insights and impact metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/community-dashboard')} 
                variant="outline" 
                className="btn-official-outline w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                View Community Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="card-official">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <FileText className="h-5 w-5 text-nigerian-blue" />
                Multi-Sectoral Reports
              </CardTitle>
              <CardDescription>
                Access enhanced reporting for all sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/test-multisectoral')} 
                variant="outline" 
                className="btn-official-outline w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Multi-Sectoral Form
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report View/Edit Modal */}
        {selectedReport && (
          <ReportReviewModal 
            report={selectedReport} 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            onUpdateReport={handleUpdateReport} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;