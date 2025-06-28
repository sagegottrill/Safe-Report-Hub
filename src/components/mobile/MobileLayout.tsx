import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import MobileBottomNav from './MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle, Shield, Phone, Bell, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, toggleSidebar, sidebarOpen } = useAppContext();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't show bottom nav on auth page
  const showBottomNav = !location.pathname.includes('/auth');
  const showHeader = !location.pathname.includes('/auth');

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

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe-area">
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        {showHeader && (
          <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Left side - Logo and Menu */}
              <div className="flex items-center gap-3">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={toggleSidebar}
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  className="flex items-center gap-2 focus:outline-none min-w-0"
                  onClick={() => navigate('/')}
                  aria-label="Go to Home"
                >
                  <div className="bg-blue-600 p-2 rounded-full shadow-sm">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-blue-600 leading-tight">Safety Support</span>
                      <span className="text-xs text-gray-500 leading-tight">Mobile</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                {/* Language selector */}
                <select
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  aria-label="Language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <Bell className="h-4 w-4 text-gray-600" />
                </button>

                {/* Mobile menu button */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Open mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Settings className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
                <div className="px-4 py-3 space-y-2">
                  {user && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:text-blue-600"
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
                    className="w-full justify-start text-gray-700 hover:text-blue-600"
                    onClick={() => {
                      navigate('/emergency');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Contacts
                  </Button>
                </div>
              </div>
            )}
          </header>
        )}

        {/* Main content */}
        <main className="flex-1 pb-20">
          <div className="mobile-container">
            {children}
          </div>
        </main>
        
        {/* Bottom navigation */}
        {showBottomNav && <MobileBottomNav />}
      </div>
    </div>
  );
} 