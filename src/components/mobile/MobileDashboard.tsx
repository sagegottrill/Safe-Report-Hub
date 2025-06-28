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

  // Enhanced Stats with better data
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: COLORS.emerald,
      bg: COLORS.mint,
      trend: '+12%',
      description: 'This month'
    },
    {
      label: 'Resolved Cases',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      color: COLORS.jade,
      bg: COLORS.sage,
      trend: '+8%',
      description: 'Success rate'
    },
    {
      label: 'My Reports',
      value: reports.filter(r => r.reporterId === user?.id).length,
      icon: User,
      color: COLORS.forest,
      bg: COLORS.mint,
      trend: '+5%',
      description: 'Your activity'
    },
    {
      label: 'Urgent Cases',
      value: reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length,
      icon: AlertTriangle,
      color: '#e74c3c',
      bg: '#fdf2f2',
      trend: '-3%',
      description: 'Needs attention'
    },
  ];

  // Quick Actions with enhanced design
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

  // Recent Activity with enhanced details
  const recentReports = reports.slice(0, 5).map(report => ({
    ...report,
    priority: report.urgency === 'critical' ? 'Critical' : 
              report.urgency === 'high' ? 'High' : 
              report.urgency === 'medium' ? 'Medium' : 'Low',
    priorityColor: report.urgency === 'critical' ? 'text-red-600 bg-red-100' :
                   report.urgency === 'high' ? 'text-orange-600 bg-orange-100' :
                   report.urgency === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                   'text-green-600 bg-green-100'
  }));

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1b4332]">
                Welcome{user ? `, ${user.name?.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-slate-600 text-sm">Your safety is our priority</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Today</p>
            <p className="text-sm font-semibold text-[#1b4332]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
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

      {/* Enhanced Stats Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Community Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${
                    stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#1b4332] mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-[#1b4332] mb-1">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Quick Actions</h2>
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-4 flex items-center justify-between hover:bg-[#e8f5e9] active:scale-95 transition-all"
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

      {/* Recent Activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1b4332]">Recent Activity</h2>
          <button className="text-[#2ecc71] text-sm font-semibold hover:text-[#27ae60] transition-colors">
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#e8f5e9] rounded animate-pulse" />
                    <div className="h-3 bg-[#e8f5e9] rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-[#2ecc71]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1b4332] mb-2">No Recent Reports</h3>
            <p className="text-slate-600 text-sm mb-4">Be the first to submit a report and help your community</p>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-[#2ecc71] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#27ae60] transition-colors"
            >
              Submit First Report
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report, i) => (
              <button
                key={report.id || i}
                className="w-full bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-4 flex items-center justify-between hover:bg-[#e8f5e9] active:scale-95 transition-all"
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
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${report.priorityColor}`}>
                    {report.priority}
                  </span>
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
                toast.success('Report submitted successfully!');
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
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#2ecc71]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1b4332]">{selectedReport.type}</h3>
                  <p className="text-sm text-slate-500 capitalize">{selectedReport.status}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#e8f5e9] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1b4332] mb-2">Description</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{selectedReport.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">Date</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1b4332]">
                      {new Date(selectedReport.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-white border border-[#e0e0e0] rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">Priority</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1b4332]">{selectedReport.priority}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full py-3 px-4 rounded-2xl bg-[#2ecc71] text-white font-semibold hover:bg-[#27ae60] transition-colors" 
              onClick={() => setSelectedReport(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 