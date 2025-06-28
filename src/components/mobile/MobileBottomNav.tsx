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

const COLOR_PALETTE = [
  'from-green-600 to-green-400',
  'from-yellow-500 to-yellow-300',
  'from-purple-700 to-purple-400',
  'from-blue-700 to-blue-400',
  'from-pink-600 to-pink-400',
];

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
    <nav className="mobile-bottom-nav mobile-gradient-glass shadow-2xl">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 mobile-hover-lift mobile-active-scale
                ${isActive
                  ? `bg-gradient-to-br ${color} text-white shadow-2xl scale-110 border-2 border-white/60`
                  : 'text-white/80 hover:text-white/100 hover:bg-white/10'}`}
              style={{ minWidth: 64 }}
            >
              <Icon size={22} className="mb-1 drop-shadow-lg" />
              <span className="text-xs font-bold tracking-wide drop-shadow">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 