import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import MobileBottomNav from './MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle, Shield, Phone, Bell, Settings, LogOut, User } from 'lucide-react';
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
    <div className="min-h-screen mobile-safe-area">
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        {showHeader && (
          <header className="mobile-header px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Logo and Menu */}
              <div className="flex items-center gap-3">
                <button
                  className="p-2 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  onClick={toggleSidebar}
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  className="flex items-center gap-2 focus:outline-none min-w-0"
                  onClick={() => navigate('/')}
                  aria-label="Go to Home"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-full shadow-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900 leading-tight">Safety Support</span>
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
                  className="border border-gray-200 rounded-xl px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm"
                  aria-label="Language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>

                {/* Notifications */}
                <button className="p-2 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <Bell className="h-4 w-4 text-gray-600" />
                </button>

                {/* User menu button */}
                <button
                  className="p-2 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Open mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4 text-gray-600" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-xl z-40 mobile-slide-in-down">
                <div className="px-4 py-3 space-y-2">
                  {user && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
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
                    className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                    onClick={() => {
                      navigate('/emergency');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Contacts
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                    onClick={() => {
                      navigate('/settings');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            )}
          </header>
        )}

        {/* Main content */}
        <main className="flex-1 pb-20">
          {children}
        </main>
        
        {/* Bottom navigation */}
        {showBottomNav && <MobileBottomNav />}
      </div>
    </div>
  );
} 