import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';

export default function MobileDashboard() {
  const { user, reports, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced stats with real-time data
  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Pending',
      value: reports.filter(r => r.status === 'new').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: '+5%',
      trendUp: false
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+18%',
      trendUp: true
    },
    {
      label: 'Urgent',
      value: reports.filter(r => r.urgency === 'high' || r.urgency === 'critical').length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-3%',
      trendUp: false
    }
  ];

  // Enhanced quick actions with role-based access
  const quickActions: Array<{
    title: string;
    description: string;
    icon: any;
    path: string;
    color: string;
    requiresAuth?: boolean;
    badge?: string;
  }> = [
    {
      title: 'Submit Report',
      description: 'Report an incident or issue',
      icon: Plus,
      path: '/report',
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
      requiresAuth: true,
      badge: 'New'
    },
    {
      title: 'Track Reports',
      description: 'Check your submitted reports',
      icon: FileText,
      path: '/reports',
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      requiresAuth: true
    },
    {
      title: 'Emergency Contacts',
      description: 'Quick access to emergency numbers',
      icon: Phone,
      path: '/emergency',
      color: 'bg-gradient-to-r from-red-600 to-red-700',
      requiresAuth: false
    },
    {
      title: 'Community Alerts',
      description: 'Stay informed about local issues',
      icon: Bell,
      path: '/alerts',
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      requiresAuth: false
    }
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

  return (
    <div className="mobile-container py-4">
      {/* Enhanced Header with User Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Safety Support</h1>
              <p className="text-blue-100 text-sm">Community Protection Hub</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            {user && (
              <button 
                onClick={logout}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {user ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Welcome back,</p>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-blue-200 text-sm capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Reports Today</p>
              <p className="font-bold text-2xl">{reports.filter(r => {
                const today = new Date().toDateString();
                return new Date(r.date).toDateString() === today;
              }).length}</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-blue-100 mb-3">Join our community safety network</p>
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold inline-block"
            >
              Sign In / Register
            </Link>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search reports, incidents..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Filter className="text-gray-400 w-5 h-5" />
        </button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-4 border border-gray-100`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
        {['overview', 'reports', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[...quickActions, ...adminActions, ...governorActions].map((action) => {
            const Icon = action.icon;
            const isDisabled = action.requiresAuth && !user;
            
            return (
              <Link
                key={action.title}
                to={isDisabled ? '/auth' : action.path}
                className={`block ${action.color} text-white rounded-xl p-4 transition-all active:scale-95 shadow-lg`}
              >
                <div className="flex items-center mb-2">
                  <Icon className="w-5 h-5 mr-2" />
                  {action.badge && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full ml-auto">
                      {action.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs opacity-90 mt-1">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      {user && recentReports.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Reports
            </h2>
            <Link to="/reports" className="text-blue-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{report.type}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 ${report.priorityColor}`}>
                        {report.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(report.date).toLocaleDateString()}
                      {report.caseId && (
                        <>
                          <span className="mx-2">•</span>
                          <span>ID: {report.caseId}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status}
                    </span>
                    <div className="flex space-x-1">
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
} 