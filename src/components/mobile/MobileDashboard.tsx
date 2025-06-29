import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

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
      onClick: () => navigate('/report'),
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
              BICTDA Report
            </h1>
            <p className="text-xs text-[#1b4332] font-semibold">Official Platform</p>
            <p className="text-xs text-[#1b4332]">Secure Government</p>
          </div>
        </div>
        <div className="mb-2">
          <h2 className="text-lg font-bold text-[#1b4332]">Welcome back, {user?.name || user?.email || 'User'}</h2>
          <p className="text-slate-600 text-sm">Your Personal Dashboard - Official Government Crisis Reporting Platform</p>
        </div>
        <button
          className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] mt-2"
          onClick={() => navigate('/report')}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="flex items-center gap-2"><Plus className="w-5 h-5" /> New Report</span>
            <span className="text-xs font-medium">Secure & Encrypted • Government Verified</span>
          </div>
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Your Reports</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-2xl bg-[#f9fafb] shadow flex flex-col items-center py-4 px-2 border border-[#e0e0e0]">
            <div className="text-xl font-bold text-[#1b4332]">{reports.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1 text-center">Reports you've submitted</div>
          </div>
          <div className="rounded-2xl bg-[#f9fafb] shadow flex flex-col items-center py-4 px-2 border border-[#e0e0e0]">
            <div className="text-xl font-bold text-[#1b4332]">{reports.filter(r => r.status === 'under-review').length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1 text-center">Under Review</div>
          </div>
          <div className="rounded-2xl bg-[#f9fafb] shadow flex flex-col items-center py-4 px-2 border border-[#e0e0e0]">
            <div className="text-xl font-bold text-[#1b4332]">{reports.filter(r => r.status === 'resolved').length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1 text-center">Resolved</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-[#1b4332] font-semibold">Track the status of your submitted incident reports</div>
        {reports.length === 0 && (
          <div className="flex flex-col items-center mt-2 mb-4">
            <div className="mb-3">
              {/* Document icon placeholder, matching web style */}
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="32" height="32" rx="6" fill="#e0e7ef"/>
                <rect x="16" y="20" width="16" height="2.5" rx="1.25" fill="#b0b8c9"/>
                <rect x="16" y="26" width="10" height="2.5" rx="1.25" fill="#b0b8c9"/>
                <rect x="16" y="32" width="8" height="2.5" rx="1.25" fill="#b0b8c9"/>
              </svg>
            </div>
            <div className="text-center">
              <div className="text-base font-semibold text-[#1b4332] mb-1">You haven't submitted any reports yet</div>
              <div className="text-xs text-slate-500 mb-4">This is your personal dashboard. Submit your first incident report to get started.</div>
            </div>
            <button
              className="w-full py-3 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-base active:scale-95 transition-all hover:bg-[#27ae60] mt-2"
              onClick={() => navigate('/report')}
            >
              Submit Your First Report
            </button>
          </div>
        )}
      </div>

      {/* Community Dashboard Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-2">Community Dashboard</h2>
        <p className="text-slate-600 text-sm mb-2">View community insights and impact metrics</p>
        <button
          className="w-full py-3 px-6 rounded-2xl font-semibold text-[#2ecc71] bg-[#e8f5e9] shadow text-base active:scale-95 transition-all hover:bg-[#d0f0e0]"
          onClick={() => toast.info('Community Dashboard coming soon!')}
        >
          View Community Dashboard
        </button>
      </div>

      {/* Multi-Sectoral Reports Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-2">Multi-Sectoral Reports</h2>
        <p className="text-slate-600 text-sm mb-2">Access enhanced reporting for all sectors</p>
        <button
          className="w-full py-3 px-6 rounded-2xl font-semibold text-[#2ecc71] bg-[#e8f5e9] shadow text-base active:scale-95 transition-all hover:bg-[#d0f0e0]"
          onClick={() => toast.info('Multi-Sectoral Form coming soon!')}
        >
          Multi-Sectoral Form
        </button>
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

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-8 mb-2 w-full fixed bottom-0 left-0 bg-[#f9fafb] py-3 z-40">
        © 2025 BICTDA Report - All rights reserved.
      </div>
    </div>
  );
} 
