import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, 
  FileText, 
  User, 
  HelpCircle, 
  Shield,
  BarChart3,
  Settings,
  Plus,
  Bell,
  Users,
  LogOut
} from 'lucide-react';

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

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, logout } = useAppContext();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      show: true
    },
    {
      path: '/report',
      icon: Plus,
      label: 'Report',
      show: true
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
      show: !!user
    },
    {
      path: '/admin',
      icon: BarChart3,
      label: 'Admin',
      show: user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'country_admin'
    },
    {
      path: '/governor',
      icon: Shield,
      label: 'Governor',
      show: user?.role === 'governor' || user?.role === 'governor_admin'
    },
    {
      path: '/faq',
      icon: HelpCircle,
      label: 'Help',
      show: true
    }
  ].filter(item => item.show);

  // If user is admin, add admin analytics
  if (user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'country_admin') {
    navItems.splice(4, 0, {
      path: '/admin-analytics',
      icon: BarChart3,
      label: 'Analytics',
      show: true
    });
  }

  // If user is governor admin, add governor admin panel
  if (user?.role === 'governor_admin') {
    navItems.splice(5, 0, {
      path: '/governor-admin',
      icon: Users,
      label: 'Admin Panel',
      show: true
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#e0e0e0] shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const color = COLORS[Object.keys(COLORS)[idx % Object.keys(COLORS).length]];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#e8f5e9] shadow-md scale-105' 
                  : 'hover:bg-[#f9fafb] active:scale-95'
              }`}
            >
              <Icon 
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-[#2ecc71]' : 'text-[#2c3e50]'
                }`} 
              />
              <span 
                className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-[#1b4332]' : 'text-[#2c3e50]/70'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#2ecc71] mt-1 animate-pulse" />
              )}
            </Link>
          );
        })}
        
        {/* Logout Button */}
        {user && (
          <button
            onClick={() => window.location.href = '/logout'}
            className="flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-200 hover:bg-red-50 active:scale-95"
          >
            <LogOut className="w-6 h-6 mb-1 text-red-500" />
            <span className="text-xs font-semibold text-red-500">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
} 