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
  HelpCircle
} from 'lucide-react';
import EnhancedReportForm from '../report/EnhancedReportForm';
import MobileReportForm from './MobileReportForm';
import { toast } from '@/components/ui/sonner';

const COLOR_PALETTE = [
  'from-green-600 to-green-400', // Deep green
  'from-yellow-500 to-yellow-300', // Gold
  'from-purple-700 to-purple-400', // Purple
  'from-blue-700 to-blue-400', // Blue
  'from-pink-600 to-pink-400', // Pink
];

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

  // Bold, beautiful stats
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      gradient: COLOR_PALETTE[0],
    },
    {
      label: 'Urgent',
      value: reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length,
      icon: Flame,
      gradient: COLOR_PALETTE[1],
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      gradient: COLOR_PALETTE[2],
    },
    {
      label: 'Community',
      value: 42,
      icon: Globe2,
      gradient: COLOR_PALETTE[3],
    },
  ];

  // Bold quick actions
  const quickActions = [
    {
      title: 'New Report',
      icon: Plus,
      color: COLOR_PALETTE[0],
      onClick: () => setShowReportModal(true),
    },
    {
      title: 'Track',
      icon: Search,
      color: COLOR_PALETTE[1],
      onClick: () => setActiveTab('track'),
    },
    {
      title: 'Emergency',
      icon: Phone,
      color: COLOR_PALETTE[2],
      onClick: () => window.open('tel:112'),
    },
    {
      title: 'FAQ',
      icon: HelpCircle,
      color: COLOR_PALETTE[3],
      onClick: () => window.location.href = '/faq',
    },
  ];

  // Role-based admin actions
  const adminActions: Array<{
    title: string;
    description: string;
    icon: any;
    path: string;
    color: string;
    requiresAuth?: boolean;
    badge?: string;
  }> = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'country_admin' ? [
    {
      title: 'Admin Panel',
      description: 'Manage reports and users',
      icon: Settings,
      path: '/admin',
      color: 'bg-gradient-to-r from-indigo-600 to-indigo-700'
    },
    {
      title: 'Analytics',
      description: 'View detailed statistics',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-gradient-to-r from-teal-600 to-teal-700'
    }
  ] : [];

  // Governor actions
  const governorActions: Array<{
    title: string;
    description: string;
    icon: any;
    path: string;
    color: string;
    requiresAuth?: boolean;
    badge?: string;
  }> = user?.role === 'governor' || user?.role === 'governor_admin' ? [
    {
      title: 'Governor Panel',
      description: 'Multi-sectoral management',
      icon: Shield,
      path: '/governor',
      color: 'bg-gradient-to-r from-orange-600 to-orange-700'
    }
  ] : [];

  // Recent reports with enhanced details
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
    <div className="mobile-container py-4">
      {/* Beautiful App Header */}
      <div className="mobile-card mobile-gradient-glass mb-6 p-6 flex items-center gap-4 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-xl">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight mb-1">SafeReport Hub</h1>
          <div className="text-xs font-semibold text-blue-900/80">Empowering Communities</div>
        </div>
      </div>

      {/* Bold Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`mobile-card p-5 bg-gradient-to-br ${stat.gradient} text-white flex flex-col items-center justify-center shadow-2xl`}>
            <stat.icon className="w-7 h-7 mb-2 opacity-90" />
            <div className="text-2xl font-extrabold drop-shadow-lg">{stat.value}</div>
            <div className="text-xs font-semibold opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <button
            key={action.title}
            className={`mobile-card p-4 bg-gradient-to-br ${action.color} text-white flex flex-col items-center justify-center mobile-hover-lift mobile-active-scale shadow-xl`}
            onClick={action.onClick}
          >
            <action.icon className="w-6 h-6 mb-1" />
            <span className="font-bold text-sm">{action.title}</span>
          </button>
        ))}
      </div>

      {/* Recent Reports Section (as before, but with glassy cards) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="mobile-subtitle text-green-700">Recent Reports</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mobile-list-item mobile-loading-skeleton h-16" />
            ))}
          </div>
        ) : recentReports.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No recent reports</div>
        ) : (
          <div className="mobile-list">
            {recentReports.map((report, i) => (
              <SwipeableReportCard
                key={report.id || i}
                report={report}
                onSwipe={dir => handleSwipe(report, dir)}
                onTap={() => setSelectedReport(report)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        className="fixed bottom-24 right-6 z-50 mobile-button mobile-button-primary mobile-bounce-in shadow-xl"
        onClick={() => setShowReportModal(true)}
        aria-label="Quick Report"
      >
        <Plus className="w-6 h-6" />
      </button>

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

      {/* Emergency Quick Access */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Emergency Quick Access</h3>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-red-100 text-sm mb-3">
          Immediate assistance for urgent situations
        </p>
        <div className="flex space-x-2">
          <button className="flex-1 bg-white/20 rounded-lg py-2 px-3 text-sm font-medium">
            Call Emergency
          </button>
          <button className="flex-1 bg-white/20 rounded-lg py-2 px-3 text-sm font-medium">
            Report Urgent
          </button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-green-600" />
          Community Impact
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </p>
            <p className="text-xs text-gray-600">Cases Resolved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {reports.length}
            </p>
            <p className="text-xs text-gray-600">Total Reports</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((reports.filter(r => r.status === 'resolved').length / reports.length) * 100) || 0}%
            </p>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Call to Action for non-authenticated users */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-200">
          <Heart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Join Our Safety Network</h3>
          <p className="text-blue-700 mb-4 text-sm">
            Create an account to submit reports, track your cases, and help keep our community safe
          </p>
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold inline-block shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      )}

      {/* Report Details Modal Overlay */}
      {selectedReport && (
        <div className="mobile-modal" onClick={() => setSelectedReport(null)}>
          <div className="mobile-modal-content mobile-scale-in mobile-gradient-glass" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="mobile-title">{selectedReport.type}</h3>
              <div className="text-xs text-gray-500 mb-2">{selectedReport.priority}</div>
              <div className="text-sm text-gray-700 mb-2">{selectedReport.description}</div>
              <div className="text-xs text-gray-400">{new Date(selectedReport.date).toLocaleString()}</div>
            </div>
            <button className="mobile-button mobile-button-secondary" onClick={() => setSelectedReport(null)}>Close</button>
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