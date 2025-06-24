import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, FileText, Shield, LogOut, 
  Users, HelpCircle, ExternalLink, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { user, currentView, setCurrentView, logout, sidebarOpen, toggleSidebar } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home, roles: ['user', 'admin'] },
    { id: 'report', label: t('newReport'), icon: FileText, roles: ['user', 'admin'] },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  if (!sidebarOpen) return null;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 w-64 transition-transform duration-300',
        'sm:w-64 w-full max-w-xs',
        'shadow-lg sm:shadow-none'
      )}
      style={{ width: undefined }}
      aria-label={t('Sidebar navigation')}
    >
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-800 p-2.5 rounded-2xl shadow-lg flex items-center justify-center" style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.18)' }}>
            <Shield className="h-9 w-9 text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 8px rgba(34,197,94,0.18))' }} />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent ml-2 truncate">BICTDA Report</span>
        </div>
        <button
          className="sm:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6 text-green-700" />
        </button>
      </div>
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <nav className="space-y-3" aria-label={t('mainMenu')}>
          {filteredItems.length === 0 ? (
            <div className="text-gray-400 text-xs text-center py-8" aria-live="polite">{t('noMenuItems')}</div>
          ) : (
            filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-4 text-base h-12 rounded-xl font-semibold transition-all',
                    isActive && 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
                    !isActive && 'text-green-900 hover:bg-green-50'
                  )}
                  onClick={() => setCurrentView(item.id as any)}
                  aria-label={t(item.label)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="truncate">{t(item.label)}</span>
                </Button>
              );
            })
          )}
          {user?.role === 'admin' && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs sm:text-sm h-10"
              onClick={() => window.open('/admin', '_blank')}
              aria-label={t('adminDashboard')}
            >
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm flex items-center gap-1 truncate">
                {t('adminDashboard')}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Button>
          )}
        </nav>
      </div>
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-purple-700 hover:text-purple-900 hover:bg-purple-50 text-xs sm:text-sm h-10 font-semibold"
            aria-label={t('helpSupport', 'Help & Support')}
            onClick={() => window.open('mailto:support@safereport.org', '_blank')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-semibold truncate">{t('helpSupport', 'Help & Support')}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm h-10 font-semibold"
            aria-label="FAQ"
            onClick={() => navigate('/faq')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-semibold truncate">FAQ</span>
          </Button>
          <div className="border-t border-gray-200 my-3" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm h-10"
            onClick={logout}
            aria-label={t('logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs sm:text-sm truncate">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;