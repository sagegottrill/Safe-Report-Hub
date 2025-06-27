import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, 
  FileText, 
  User, 
  HelpCircle, 
  Shield,
  BarChart3
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
      icon: FileText,
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
      show: user?.role === 'governor_admin' || user?.role === 'governor'
    },
    {
      path: '/faq',
      icon: HelpCircle,
      label: 'FAQ',
      show: true
    }
  ].filter(item => item.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mobile-safe-area">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 