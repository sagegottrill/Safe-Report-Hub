import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import AuthPage from './auth/AuthPage';
import Dashboard from './dashboard/Dashboard';
import EnhancedReportForm from './report/EnhancedReportForm';
import Sidebar from './layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle, Shield, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrustIndicator, SecurityBadge } from '@/components/ui/trust-indicators';
import GovernorPanel from '@/pages/GovernorPanel';
import GovernorAdminPanel from '@/components/admin/GovernorAdminPanel';
import AdminPage from '@/pages/AdminPage';

const AppLayout: React.FC = () => {
  const { user, currentView, toggleSidebar, sidebarOpen, setCurrentView } = useAppContext();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const lastPathRef = React.useRef(location.pathname);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DEBUG LOGGING
  console.log('DEBUG: user:', user);
  console.log('DEBUG: currentView:', currentView);

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
    // Governor: Only redirect to /governor if not already there and not coming from /governor
    if (user && user.role === 'governor') {
      if (location.pathname !== '/governor' && lastPathRef.current !== '/governor') {
        lastPathRef.current = '/governor';
        navigate('/governor', { replace: true });
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
    { code: 'ha', label: 'Hausa' },
    { code: 'kr', label: 'Kanuri' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const renderCurrentView = () => {
    if (user.role === 'governor' && currentView === 'governor') {
      return <GovernorPanel />;
    }
    if ((user.role === 'admin' || user.role === 'super_admin' || user.role === 'country_admin') && currentView === 'admin') {
      return <AdminPage />;
    }
    if (user.role === 'governor_admin' && currentView === 'governor-admin') {
      return <GovernorAdminPanel />;
    }
    if (user.role === 'user' && currentView === 'dashboard') {
        return <Dashboard />;
    }
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'red', background: '#fff', minHeight: '100vh' }}>
        <h2>Something went wrong</h2>
        <p>No matching dashboard for your role or view.<br/>Please log out and log in again.</p>
        <div style={{ margin: '20px 0', color: '#333', fontSize: 14 }}>
          <b>Debug info:</b><br/>
          <pre style={{ textAlign: 'left', display: 'inline-block', background: '#f5f5f5', padding: 10, borderRadius: 6 }}>
{JSON.stringify({ role: user.role, currentView }, null, 2)}
          </pre>
        </div>
        <Button onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('currentView');
            window.location.reload();
          }
        }}>Logout</Button>
      </div>
    );
  };

  if (user === null) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Enhanced Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center gap-3">
            <button
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nigerian-green transition-colors"
              onClick={toggleSidebar}
              aria-label="Open navigation menu"
            >
                <Menu className="h-5 w-5 text-nigerian-green" />
              </button>
              <button
                className="flex items-center gap-2 focus:outline-none min-w-0"
                onClick={() => navigate('/')}
                aria-label="Go to Home"
              >
                <div className="bg-nigerian-green p-2 rounded-full shadow-official">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-nigerian-green leading-tight">{t('ngoName')}</span>
                    <span className="text-xs text-text-light leading-tight">Official Platform</span>
                  </div>
                </div>
            </button>
            </div>
            {/* Center - Trust Indicators (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <TrustIndicator type="security" size="sm">Secure Government</TrustIndicator>
            </div>
            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
            {/* Language selector */}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-nigerian-green bg-white"
              aria-label="Language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
              {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nigerian-green transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-nigerian-green" />
                ) : (
                  <Menu className="h-5 w-5 text-nigerian-green" />
                )}
              </button>
              {/* Desktop actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10"
                  onClick={() => navigate('/faq')}
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-nigerian-blue hover:text-nigerian-blue hover:bg-nigerian-blue/10"
              onClick={() => setAboutOpen(true)}
            >
                  About
                </Button>
                <Button
                  size="sm"
                  className="bg-danger text-white hover:bg-danger/90"
                  onClick={() => setEmergencyOpen(true)}
            >
                  <Phone className="h-4 w-4 mr-1" />
                  Emergency
                </Button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-nigerian-blue"
                  onClick={() => {
                    navigate('/faq');
                    setMobileMenuOpen(false);
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & FAQ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-nigerian-blue"
                  onClick={() => {
                    setAboutOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  About Project
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-nigerian-blue"
                  onClick={() => {
                    setPrivacyOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Privacy Policy
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-danger text-white hover:bg-danger/90"
                  onClick={() => {
                    setEmergencyOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Help
                </Button>
              </div>
            </div>
          )}
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
        {/* Enhanced Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">&copy; {new Date().getFullYear()} {t('ngoName')} - All rights reserved.</span>
            <SecurityBadge>Protected</SecurityBadge>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;