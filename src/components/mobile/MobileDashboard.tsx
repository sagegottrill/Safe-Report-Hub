import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Activity, 
  User, 
  HelpCircle, 
  LogOut,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';
import MobileReportForm from './MobileReportForm';
import { toast } from '@/components/ui/sonner';

const COLORS = {
  emerald: '#2ecc71',
  mint: '#e8f5e9',
  forest: '#1b4332',
  sage: '#a8cbaa',
  jade: '#00a676',
  slate: '#2c3e50',
  gray: '#e0e0e0',
  white: '#fff',
  bg: '#f9fafb',
};

export default function MobileDashboard() {
  const { user, reports, logout, submitReport } = useAppContext();
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (reports.length > 0) setLoading(false);
    else {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [reports]);

  // Stats
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: COLORS.emerald,
      bg: COLORS.mint,
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      color: COLORS.jade,
      bg: COLORS.sage,
    },
    {
      label: 'My Reports',
      value: reports.filter(r => r.reporterId === user?.id).length,
      icon: User,
      color: COLORS.forest,
      bg: COLORS.mint,
    },
    {
      label: 'Urgent',
      value: reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length,
      icon: AlertTriangle,
      color: '#e74c3c',
      bg: '#fdf2f2',
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      label: 'Submit Report',
      description: 'Report an incident or issue',
      icon: Plus,
      color: COLORS.emerald,
      bg: COLORS.mint,
      onClick: () => setShowReportModal(true),
    },
    {
      label: 'Track Reports',
      description: 'View your submitted reports',
      icon: FileText,
      color: COLORS.sage,
      bg: COLORS.mint,
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Emergency',
      description: 'Get immediate assistance',
      icon: Shield,
      color: '#e74c3c',
      bg: '#fdf2f2',
      onClick: () => window.open('tel:112'),
    },
    {
      label: 'Help & FAQ',
      description: 'Get support and answers',
      icon: HelpCircle,
      color: COLORS.jade,
      bg: COLORS.sage,
      onClick: () => window.location.href = '/faq',
    },
  ];

  // Recent Activity
  const recentReports = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1b4332] mb-1">
              Welcome{user ? `, ${user.name?.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-slate-600 text-sm">Your safety is our priority</p>
          </div>
        </div>
        <button
          className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60]"
          onClick={() => setShowReportModal(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Submit a New Report
          </div>
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Community Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl bg-[#f9fafb] shadow flex flex-col items-center py-4 px-2 border border-[#e0e0e0] hover:bg-[#e8f5e9] transition-all"
              style={{ border: `1.5px solid ${stat.bg}` }}
            >
              <stat.icon className="w-6 h-6 mb-1" style={{ color: stat.color }} />
              <div className="text-xl font-bold text-[#1b4332]">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1 text-center">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Quick Actions</h2>
        <div className="space-y-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full rounded-2xl bg-[#f9fafb] shadow-md border border-[#e0e0e0] p-4 flex items-center justify-between hover:bg-[#e8f5e9] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: action.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1b4332] text-base">{action.label}</h3>
                    <p className="text-slate-500 text-sm">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1b4332]">Recent Activity</h2>
          <button className="text-[#2ecc71] text-sm font-semibold hover:text-[#27ae60] transition-colors">
            View All
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#e8f5e9] h-14 animate-pulse" />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No recent reports yet.</div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report, i) => (
              <button
                key={report.id || i}
                className="w-full rounded-2xl bg-[#f9fafb] shadow-md border border-[#e0e0e0] p-4 flex items-center justify-between hover:bg-[#e8f5e9] active:scale-95 transition-all"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] flex items-center justify-center shadow-sm">
                    <Activity className="w-6 h-6 text-[#2ecc71]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1b4332] text-base">{report.type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-500 capitalize">{report.status}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal Overlay */}
      {showReportModal && (
        <div className="mobile-modal" onClick={() => setShowReportModal(false)}>
          <div className="mobile-modal-content mobile-scale-in" onClick={e => e.stopPropagation()}>
            <MobileReportForm
              onSubmit={data => {
                submitReport({
                  type: data.sector,
                  impact: [data.category],
                  description: data.description,
                  urgency: 'medium',
                  isAnonymous: false,
                  perpetrator: '',
                  date: new Date().toISOString(),
                  platform: 'mobile',
                });
                toast.success('Report submitted!');
                setShowReportModal(false);
              }}
              onClose={() => setShowReportModal(false)}
            />
          </div>
        </div>
      )}

      {/* Report Details Modal Overlay */}
      {selectedReport && (
        <div className="mobile-modal" onClick={() => setSelectedReport(null)}>
          <div className="mobile-modal-content mobile-scale-in" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#1b4332] mb-1">{selectedReport.type}</h3>
              <div className="text-xs text-slate-500 mb-2 capitalize">{selectedReport.status}</div>
              <div className="text-sm text-slate-700 mb-2">{selectedReport.description}</div>
              <div className="text-xs text-slate-400">{new Date(selectedReport.date).toLocaleString()}</div>
            </div>
            <button className="mobile-button mobile-button-secondary w-full" onClick={() => setSelectedReport(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
} 