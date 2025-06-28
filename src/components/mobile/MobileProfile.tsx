import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings, 
  LogOut, 
  Edit, 
  Calendar,
  FileText,
  HelpCircle,
  Bell,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
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

export default function MobileProfile() {
  const { user, logout, reports } = useAppContext();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-[#1b4332] mb-2">Not Signed In</h1>
          <p className="text-slate-600 mb-6">Please sign in to view your profile</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="bg-[#2ecc71] text-white px-6 py-3 rounded-2xl font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const userReports = reports.filter(r => r.reporterId === user.id);
  const resolvedReports = userReports.filter(r => r.status === 'resolved');

  const profileActions = [
    {
      label: 'My Reports',
      icon: FileText,
      value: `${userReports.length} reports`,
      color: COLORS.emerald,
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Resolved Cases',
      icon: Shield,
      value: `${resolvedReports.length} resolved`,
      color: COLORS.jade,
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Account Settings',
      icon: Settings,
      value: 'Manage account',
      color: COLORS.forest,
      onClick: () => toast.info('Coming soon!'),
    },
  ];

  const settingsActions = [
    {
      label: 'Notifications',
      icon: Bell,
      value: 'Manage alerts',
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Privacy & Security',
      icon: Lock,
      value: 'Security settings',
      onClick: () => toast.info('Coming soon!'),
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      value: 'Get help',
      onClick: () => window.location.href = '/faq',
    },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1b4332] mb-1">{user.name || 'User'}</h1>
            <p className="text-slate-600 text-sm capitalize">
              {user.role?.replace('_', ' ') || 'User'}
            </p>
            <p className="text-slate-500 text-xs">
              Member since recently
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center active:scale-95 transition-all">
            <Edit className="w-5 h-5 text-[#2ecc71]" />
          </button>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#e8f5e9]">
            <Mail className="w-5 h-5 text-[#2ecc71]" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1b4332]">Email</p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#e8f5e9]">
              <Phone className="w-5 h-5 text-[#2ecc71]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1b4332]">Phone</p>
                <p className="text-sm text-slate-600">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">My Activity</h2>
        <div className="space-y-3">
          {profileActions.map((action, index) => {
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
                    style={{ backgroundColor: action.color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1b4332] text-base">{action.label}</h3>
                    <p className="text-slate-500 text-sm">{action.value}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Settings</h2>
        <div className="space-y-3">
          {settingsActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="w-full bg-white rounded-2xl shadow-md border border-[#e0e0e0] p-4 flex items-center justify-between hover:bg-[#e8f5e9] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-[#2ecc71]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1b4332] text-base">{action.label}</h3>
                    <p className="text-slate-500 text-sm">{action.value}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1b4332] mb-4">Account</h2>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white rounded-2xl shadow-md border border-red-200 p-4 flex items-center justify-between hover:bg-red-50 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shadow-sm">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-600 text-base">Sign Out</h3>
              <p className="text-red-400 text-sm">Logout from your account</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1b4332] mb-2">Sign Out</h3>
              <p className="text-slate-600">Are you sure you want to logout from your account?</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#e0e0e0] text-[#2c3e50] font-semibold hover:bg-[#f9fafb] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 