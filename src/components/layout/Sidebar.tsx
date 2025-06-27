import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Home, FileText, Shield, LogOut, 
  Users, HelpCircle, ExternalLink, X,
  BarChart3, Globe, TestTube, TrendingUp, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TrustIndicator, SecurityBadge } from '@/components/ui/trust-indicators';

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
      {/* Official Header */}
      <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-200 bg-gradient-to-r from-nigerian-green/5 to-nigerian-blue/5">
        <button
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-nigerian-green cursor-pointer bg-transparent border-none"
          onClick={() => setCurrentView('dashboard')}
          tabIndex={0}
          aria-label="Go to Dashboard"
          type="button"
        >
          <div className="bg-nigerian-green p-3 rounded-full shadow-official flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
        </div>
        <div>
            <span className="font-bold text-lg text-nigerian-green block">BICTDA Report</span>
            <span className="text-xs text-text-light">Official Platform</span>
          </div>
        </button>
        <button
          className="sm:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6 text-nigerian-green" />
        </button>
        </div>

      {/* Security Badge */}
      <div className="p-3 bg-nigerian-green/10 border-b border-nigerian-green/20">
        <SecurityBadge className="w-full justify-center">
          Secure Government Platform
        </SecurityBadge>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-3" aria-label={t('mainMenu')}>
          {filteredItems.length === 0 ? (
            <div className="text-text-light text-xs text-center py-8" aria-live="polite">{t('noMenuItems')}</div>
          ) : (
            filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              if (item.id === 'report') {
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-4 text-base h-12 rounded-lg font-medium transition-all',
                      isActive && 'bg-nigerian-green text-white shadow-official',
                      !isActive && 'text-text hover:bg-nigerian-green/10 hover:text-nigerian-green'
                    )}
                    onClick={() => navigate('/report')}
                    aria-label={t(item.label)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="truncate">{t(item.label)}</span>
                  </Button>
                );
              }
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-4 text-base h-12 rounded-lg font-medium transition-all',
                    isActive && 'bg-nigerian-green text-white shadow-official',
                    !isActive && 'text-text hover:bg-nigerian-green/10 hover:text-nigerian-green'
                  )}
                  onClick={() => setCurrentView(item.id as any)}
                  aria-label={t(item.label)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{t(item.label)}</span>
                </Button>
              );
            })
          )}
          
          {/* New Features Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3 px-2">
              New Features
            </h3>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10"
              onClick={() => navigate('/test-multisectoral')}
              aria-label="Multi-Sectoral Test"
            >
              <TestTube className="h-4 w-4" />
              <span className="text-sm truncate">Multi-Sectoral Test</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10"
              onClick={() => navigate('/community-dashboard')}
              aria-label="Community Dashboard"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm truncate">Community Dashboard</span>
            </Button>
          </div>
          
          {user?.role === 'admin' && (
            <>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-3 px-2">
                  Admin Tools
                </h3>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10"
                  onClick={() => navigate('/admin')}
                  aria-label={t('adminDashboard')}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm truncate">{t('adminDashboard')}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10"
                  onClick={() => navigate('/admin-analytics')}
                  aria-label="Admin Analytics"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm truncate">Admin Analytics</span>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10 font-medium"
            aria-label={t('helpSupport', 'Help & Support')}
            onClick={() => window.open('mailto:support@safereport.org', '_blank')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium truncate">{t('helpSupport', 'Help & Support')}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10 text-sm h-10 font-medium"
            aria-label="FAQ"
            onClick={() => navigate('/faq')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium truncate">FAQ</span>
          </Button>
          <div className="border-t border-gray-200 my-3" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-danger hover:text-danger hover:bg-danger/10 text-sm h-10"
            onClick={logout}
            aria-label={t('logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm truncate">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;