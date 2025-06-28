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
  Users
} from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAppContext();

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
    navItems.splice(3, 0, {
      path: '/admin-analytics',
      icon: BarChart3,
      label: 'Analytics',
      show: true
    });
  }

  // If user is governor admin, add governor admin panel
  if (user?.role === 'governor_admin') {
    navItems.splice(4, 0, {
      path: '/governor-admin',
      icon: Users,
      label: 'Admin Panel',
      show: true
    });
  }

  return (
    <nav className="mobile-bottom-nav">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg scale-105' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white/50 hover:scale-105'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 