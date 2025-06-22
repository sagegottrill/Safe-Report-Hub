import React, { useEffect, useState } from 'react';
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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

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
        {/* Header with logo, NGO name, About link */}
        <header className="bg-white border-b border-gray-200 px-2 sm:px-3 md:px-6 py-2 md:py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Sidebar toggle button */}
            <button
              className="mr-1 sm:mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={toggleSidebar}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 text-blue-700" />
            </button>
            <button
              className="flex items-center gap-1 sm:gap-2 focus:outline-none min-w-0"
              onClick={() => navigate('/')}
              aria-label="Go to Home"
            >
              <img src="/shield.svg" alt="NGO Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="font-bold text-base sm:text-lg text-blue-700 truncate">{t('ngoName')}</span>
            </button>
          </div>
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            {/* Language selector moved here */}
            <label htmlFor="lang-select" className="sr-only">{t('language')}</label>
            <select
              id="lang-select"
              value={i18n.language}
              onChange={handleLanguageChange}
              className="border rounded px-1 py-1 text-xs sm:text-sm focus:outline-none focus:ring focus:border-blue-300 ml-1 sm:ml-2"
              aria-label="Language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <button
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 px-2 sm:px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setAboutOpen(true)}
            >
              {t('aboutProject')}
            </button>
            <button
              className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 px-2 sm:px-3 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setPrivacyOpen(true)}
            >
              {t('yourPrivacy')}
            </button>
            <button className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => setEmergencyOpen(true)}>
              {t('needHelpNow')}
            </button>
          </div>
          {/* Mobile actions: hamburger menu for About/Privacy/Emergency */}
          <div className="flex sm:hidden items-center">
            <Menu
              className="h-6 w-6 text-blue-700 cursor-pointer"
              aria-label="Open more menu"
              onClick={() => setAboutOpen(true)}
            />
            {/* Optionally, use a Drawer or Popover for About/Privacy/Emergency on mobile */}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto px-1 sm:px-0">
          {renderCurrentView()}
        </main>
        {/* Footer with attribution */}
        <footer className="w-full bg-white border-t border-gray-200 text-xs text-gray-500 text-center py-2 sticky bottom-0 z-20 px-1 sm:px-0">
          {t('footerAttribution')}
        </footer>
        {/* About Modal */}
        {aboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setAboutOpen(false)} aria-label="Close">&times;</button>
              <div className="flex items-center gap-3 mb-3">
                <img src="/shield.svg" alt="NGO Logo" className="h-10 w-10" />
                <div>
                  <div className="font-bold text-lg text-blue-700">{t('ngoName')}</div>
                  <div className="text-xs text-gray-500">{t('ngoSubtitle')}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <b>{t('aboutProject')}:</b> <br />
                {t('aboutProjectDescription')}
                <br /><br />
                <b>{t('whoIsItFor')}</b> <br />
                <ul className="list-disc pl-5">
                  <li>{t('humanitarianResponseTeams')}</li>
                  <li>{t('vulnerableCommunities')}</li>
                  <li>{t('ngosAndDonors')}</li>
                  <li>{t('deployAnywhere')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Privacy Modal */}
        {privacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setPrivacyOpen(false)} aria-label="Close">&times;</button>
              <div className="font-bold text-lg text-blue-700 mb-2">{t('yourPrivacyAndDataProtection')}</div>
              <div className="text-sm text-gray-700 mb-2">
                <b>{t('howWeProtectYourInformation')}</b>
                <ul className="list-disc pl-5 mt-2 mb-2">
                  <li>{t('privacyBullet1')}</li>
                  <li>{t('privacyBullet2')}</li>
                  <li>{t('privacyBullet3')}</li>
                  <li>{t('privacyBullet4')}</li>
                  <li>{t('privacyBullet5')}</li>
                </ul>
                <b>{t('questions')}</b> <a href="mailto:privacy@safeaid.ngo" className="text-blue-600 underline">privacy@safeaid.ngo</a>.
              </div>
              <div className="text-xs text-gray-400 mt-2">{t('dataProtectionCompliance')}</div>
            </div>
          </div>
        )}
        {/* Emergency Modal */}
        {emergencyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setEmergencyOpen(false)} aria-label="Close">&times;</button>
              <div className="font-bold text-lg text-red-700 mb-2">{t('emergencySupport')}</div>
              <div className="text-sm text-gray-700 mb-2">
                <b>{t('emergencyContactPrompt')}</b>
                <ul className="list-disc pl-5 mt-2 mb-2">
                  <li><b>{t('policeEmergency')}:</b> <a href="tel:112" className="text-blue-600 underline">112</a></li>
                  <li><b>{t('nationalHelpline')}:</b> <a href="tel:0800-123-4567" className="text-blue-600 underline">0800-123-4567</a></li>
                  <li><b>{t('gbvHotline')}:</b> <a href="tel:0800-GBV-HELP" className="text-blue-600 underline">0800-GBV-HELP</a></li>
                  <li><b>{t('childProtection')}:</b> <a href="tel:0800-CHILD-HELP" className="text-blue-600 underline">0800-CHILD-HELP</a></li>
                  <li><b>{t('whatsappSupport')}:</b> <a href="https://wa.me/2348001234567" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{t('chatNow')}</a></li>
                </ul>
              </div>
              <div className="text-xs text-gray-400 mt-2">{t('emergencyFooter')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;