import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, FileText, Shield, LogOut, 
  Users, HelpCircle, ExternalLink 
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
      )}
      style={{ width: 256 }}
      aria-label={t('Sidebar navigation')}
    >
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-base">{t('safeReport')}</h2>
          <p className="text-xs text-gray-500">{t('SecurePlatform')}</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2" aria-label={t('mainMenu')}>
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
                    'w-full justify-start gap-3 text-sm h-10',
                    isActive && 'bg-gradient-to-r from-blue-600 to-purple-600'
                  )}
                  onClick={() => setCurrentView(item.id as any)}
                  aria-label={t(item.label)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{t(item.label)}</span>
                </Button>
              );
            })
          )}
          {user?.role === 'admin' && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => window.open('/admin', '_blank')}
              aria-label={t('adminDashboard')}
            >
              <Users className="h-4 w-4" />
              <span className="text-sm flex items-center gap-1">
                {t('adminDashboard')}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Button>
          )}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-purple-700 hover:text-purple-900 hover:bg-purple-50 text-sm h-10 font-semibold"
            aria-label={t('helpSupport', 'Help & Support')}
            onClick={() => window.open('mailto:support@safereport.org', '_blank')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">{t('helpSupport', 'Help & Support')}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 text-sm h-10 font-semibold"
            aria-label="FAQ"
            onClick={() => navigate('/faq')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">FAQ</span>
          </Button>
          <div className="border-t border-gray-200 my-3" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm h-10"
            onClick={logout}
            aria-label={t('logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;