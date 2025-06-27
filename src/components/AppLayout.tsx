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

const AppLayout: React.FC = () => {
  const { user, currentView, toggleSidebar, sidebarOpen } = useAppContext();
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

  if (!user) {
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'report':
        return <EnhancedReportForm onSubmit={(data) => {
          console.log('Report submitted:', data);
          // Handle report submission here
        }} />;
      default:
        return <Dashboard />;
    }
  };

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
                  <span className="font-bold text-lg text-nigerian-green">{t('ngoName')}</span>
                  <p className="text-xs text-text-light">Official Platform</p>
                </div>
            </button>
            </div>

            {/* Center - Trust Indicators (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <TrustIndicator type="security" size="sm">
                Secure
              </TrustIndicator>
              <TrustIndicator type="official" size="sm">
                Government
              </TrustIndicator>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-light">
            <div className="flex items-center gap-4">
              <SecurityBadge>Government Protected</SecurityBadge>
              <span>Need help? Contact us at</span>
              <a href="mailto:Contact@bictdareport.com" className="text-nigerian-blue underline hover:text-nigerian-blue/80">
                Contact@bictdareport.com
              </a>
            </div>
            <div className="text-xs text-text-light">
              Official: <a href="mailto:Kabirwanori@bictdareport.com" className="text-nigerian-blue underline hover:text-nigerian-blue/80">
                Kabirwanori@bictdareport.com
              </a>
            </div>
          </div>
        </footer>

        {/* About Modal */}
        {aboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl shadow-official p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-nigerian-green p-2 rounded-full">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                <div>
                    <div className="font-bold text-lg text-nigerian-green">{t('ngoName')}</div>
                    <div className="text-xs text-text-light">{t('ngoSubtitle')}</div>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-700 p-1" 
                  onClick={() => setAboutOpen(false)} 
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-text space-y-3">
                <div>
                  <strong className="text-text">{t('aboutProject')}:</strong>
                  <p className="mt-1">{t('aboutProjectDescription')}</p>
                </div>
                <div>
                  <strong className="text-text">{t('whoIsItFor')}</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>{t('humanitarianResponseTeams')}</li>
                  <li>{t('vulnerableCommunities')}</li>
                  <li>{t('ngosAndDonors')}</li>
                  <li>{t('deployAnywhere')}</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Modal */}
        {privacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl shadow-official p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg text-nigerian-green">{t('yourPrivacyAndDataProtection')}</div>
                <button 
                  className="text-gray-400 hover:text-gray-700 p-1" 
                  onClick={() => setPrivacyOpen(false)} 
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-text space-y-3">
                <div>
                  <strong className="text-text">{t('howWeProtectYourInformation')}</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>{t('encryption')}</li>
                    <li>{t('anonymousReporting')}</li>
                    <li>{t('limitedAccess')}</li>
                    <li>{t('noThirdPartySharing')}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-text">{t('yourRights')}</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>{t('rightToAccess')}</li>
                    <li>{t('rightToCorrection')}</li>
                    <li>{t('rightToDeletion')}</li>
                    <li>{t('rightToWithdraw')}</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Modal */}
        {emergencyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl shadow-official p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-danger p-2 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-bold text-lg text-danger">Emergency Help</div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-700 p-1" 
                  onClick={() => setEmergencyOpen(false)} 
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                  <p className="text-danger font-medium">If you are in immediate danger, call emergency services first.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text">Emergency Helpline:</span>
                    <span className="font-semibold text-text">112</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text">Women's Helpline:</span>
                    <span className="font-semibold text-text">0803 123 4567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text">WhatsApp Support:</span>
                    <a href="https://wa.me/2349012345678" className="text-nigerian-blue underline">+234 901 234 5678</a>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-text-light text-xs">
                    This platform is for reporting incidents, not emergency response. 
                    For immediate help, use the emergency numbers above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && user.role === 'governor' && (
          <Button
            variant="outline"
            size="sm"
            className="text-nigerian-blue border-nigerian-blue hover:bg-nigerian-blue/10"
            onClick={() => navigate('/governor')}
          >
            Governor Panel
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppLayout;