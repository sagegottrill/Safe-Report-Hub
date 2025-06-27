import React from 'react';
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
  Users
} from 'lucide-react';

export default function MobileDashboard() {
  const { user, reports } = useAppContext();

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pending',
      value: reports.filter(r => r.status === 'new').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'resolved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Urgent',
      value: reports.filter(r => r.urgency === 'high').length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const quickActions = [
    {
      title: 'Submit Report',
      description: 'Report an incident or issue',
      icon: Plus,
      path: '/report',
      color: 'bg-blue-600',
      requiresAuth: true
    },
    {
      title: 'View Reports',
      description: 'Check your submitted reports',
      icon: FileText,
      path: '/reports',
      color: 'bg-green-600',
      requiresAuth: true
    },
    {
      title: 'FAQ',
      description: 'Get help and information',
      icon: Users,
      path: '/faq',
      color: 'bg-purple-600',
      requiresAuth: false
    }
  ];

  return (
    <div className="mobile-container py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Safety Support</h1>
        <p className="text-gray-600">
          {user ? `Welcome back, ${user.name}` : 'Report incidents and get help'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isDisabled = action.requiresAuth && !user;
          
          return (
            <Link
              key={action.title}
              to={isDisabled ? '/auth' : action.path}
              className={`block ${action.color} text-white rounded-lg p-4 transition-transform active:scale-95`}
            >
              <div className="flex items-center">
                <Icon className="w-6 h-6 mr-3" />
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      {user && reports.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{report.type}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                <p className="text-xs text-gray-500 mt-2">{report.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action for non-authenticated users */}
      {!user && (
        <div className="bg-blue-50 rounded-lg p-6 text-center mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Get Started</h3>
          <p className="text-blue-700 mb-4">
            Create an account to submit reports and track your cases
          </p>
          <Link
            to="/auth"
            className="mobile-button-primary inline-block"
          >
            Sign In / Register
          </Link>
        </div>
      )}
    </div>
  );
} 