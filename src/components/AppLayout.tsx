import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import AuthPage from './auth/AuthPage';
import Dashboard from './dashboard/Dashboard';
import ReportForm from './report/ReportForm';
import Sidebar from './layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const { user, currentView, toggleSidebar, sidebarOpen } = useAppContext();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const lastPathRef = React.useRef(location.pathname);

  useEffect(() => {
    // If no user is logged in, always show auth page regardless of URL
    if (!user) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
      return;
    }

    // Only redirect to /admin if not already there and not coming from /admin
    if (user && ['admin', 'super_admin', 'country_admin'].includes(user.role)) {
      if (location.pathname !== '/admin' && lastPathRef.current !== '/admin') {
        lastPathRef.current = '/admin';
        navigate('/admin', { replace: true });
      }
    }
    // If user is on /admin and clicks back, go to dashboard
    if (user && location.pathname === '/admin' && lastPathRef.current === '/admin') {
      window.onpopstate = () => {
        navigate('/', { replace: true });
      };
    } else {
      window.onpopstate = null;
    }
    lastPathRef.current = location.pathname;
  }, [user, location.pathname, navigate]);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'sw', label: 'Kanuri' },
    { code: 'ha', label: 'Hausa' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  if (!user) {
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'report':
        return <ReportForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-2 md:py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1 h-8 w-8"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1 md:block">
              <h1 className="text-sm md:text-xl font-semibold text-gray-900 ml-2 md:ml-0">
                {currentView === 'dashboard' && t('Dashboard')}
                {currentView === 'report' && t('Submit Report')}
              </h1>
            </div>
            {/* Language selector */}
            <div className="mr-4">
              <label htmlFor="lang-select" className="sr-only">{t('language')}</label>
              <select
                id="lang-select"
                value={i18n.language}
                onChange={handleLanguageChange}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                aria-label={t('language')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-2 md:p-4">
          <div className="h-full">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;