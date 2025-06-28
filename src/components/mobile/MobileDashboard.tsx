import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  TrendingUp,
  Users,
  MapPin,
  Phone,
  Mail,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Calendar,
  Eye,
  MessageCircle,
  Star,
  Activity,
  BarChart3,
  UserCheck,
  Globe,
  Heart,
  Zap,
  Flame,
  Award,
  Globe2,
  HelpCircle,
  User
} from 'lucide-react';
import EnhancedReportForm from '../report/EnhancedReportForm';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [pulling, setPulling] = useState(false);
  const pullStartY = useRef(0);
  const pullDistance = useRef(0);

  useEffect(() => {
    if (reports.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [reports]);

  // Stats
  const stats = [
    {
      label: 'Reports Sent',
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
  ];

  // Quick Actions
  const quickActions = [
    {
      label: 'New Report',
      icon: Plus,
      color: COLORS.emerald,
      onClick: () => setShowReportModal(true),
    },
    {
      label: 'My Reports',
      icon: FileText,
      color: COLORS.sage,
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Help',
      icon: HelpCircle,
      color: COLORS.jade,
      onClick: () => window.location.href = '/faq',
    },
    {
      label: 'Logout',
      icon: LogOut,
      color: COLORS.forest,
      onClick: logout,
    },
  ];

  // Recent Activity
  const recentReports = reports.slice(0, 5);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPulling(true);
      pullStartY.current = e.touches[0].clientY;
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling) return;
    pullDistance.current = e.touches[0].clientY - pullStartY.current;
    if (pullDistance.current > 60) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); // Simulate refresh
      setPulling(false);
    }
  };
  const handleTouchEnd = () => {
    setPulling(false);
    pullDistance.current = 0;
  };

  // Swipe handlers for report cards
  const handleSwipe = (report: any, direction: 'left' | 'right') => {
    if (direction === 'right') setSelectedReport(report);
    // You can add more actions for left swipe if needed
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-0 pb-24">
      {/* Hero Panel */}
      <div className="w-full px-5 pt-6 pb-4 bg-gradient-to-br from-[#e8f5e9] to-[#f9fafb] rounded-b-3xl shadow-md flex flex-col items-center mb-4 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M7 13l3 3 7-7" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1b4332] mb-1 tracking-tight">Welcome{user ? `, ${user.name}` : ''}!</h1>
        <p className="text-slate-600 text-base mb-2">Submit reports, track status, and help your community.</p>
        <button
          className="w-full max-w-xs py-3 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg mt-2 active:scale-95 transition-all"
          onClick={() => setShowReportModal(true)}
        >
          + Submit a Report
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-6">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white shadow-md flex flex-col items-center py-4 px-2 animate-fade-in"
            style={{ border: `1.5px solid ${stat.bg}` }}
          >
            <stat.icon className="w-6 h-6 mb-1" style={{ color: stat.color }} />
            <div className="text-xl font-bold text-[#1b4332]">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-1 text-center">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-8">
        {quickActions.map(action => (
          <button
            key={action.label}
            className="rounded-2xl bg-white shadow-md flex flex-col items-center justify-center py-5 active:scale-95 transition-all border border-[#e0e0e0] hover:bg-[#e8f5e9]"
            style={{ color: action.color }}
            onClick={action.onClick}
          >
            <action.icon className="w-7 h-7 mb-1" />
            <span className="font-semibold text-base text-slate-700 mt-1" style={{ color: COLORS.slate }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-[#1b4332] mb-3">Recent Activity</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#e8f5e9] h-14 animate-pulse" />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No recent reports yet.</div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report, i) => (
              <div
                key={report.id || i}
                className="rounded-xl bg-white shadow flex items-center px-4 py-3 border border-[#e0e0e0] hover:bg-[#e8f5e9] active:scale-95 transition-all"
                onClick={() => setSelectedReport(report)}
              >
                <Activity className="w-5 h-5 mr-3 text-[#2ecc71]" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-700 text-sm">{report.type}</div>
                  <div className="text-xs text-slate-400">{new Date(report.date).toLocaleDateString()}</div>
                </div>
                <div className="text-xs font-bold text-[#2ecc71] ml-2 capitalize">{report.status}</div>
              </div>
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

// SwipeableReportCard component
function SwipeableReportCard({ report, onSwipe, onTap }: { report: any, onSwipe: (dir: 'left' | 'right') => void, onTap: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  let startX = 0;
  let currentX = 0;
  let swiped = false;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX;
    swiped = false;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 60 && !swiped) {
      onSwipe(diff > 0 ? 'right' : 'left');
      swiped = true;
    }
  };
  const handleTouchEnd = () => {
    swiped = false;
  };

  return (
    <div
      ref={cardRef}
      className={`mobile-list-item flex items-center justify-between mobile-hover-lift mobile-gradient-glass`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
      style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
    >
      <div>
        <div className="font-semibold text-sm">{report.type}</div>
        <div className="text-xs text-gray-500">{report.priority}</div>
      </div>
      <div className="text-xs text-gray-400">{new Date(report.date).toLocaleDateString()}</div>
    </div>
  );
} 