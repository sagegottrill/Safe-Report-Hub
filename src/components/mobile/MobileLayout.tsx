import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';

const COLORS = {
  emerald: '#2ecc71',
  mint: '#e8f5e9',
  forest: '#1b4332',
  sage: '#a8cbaa',
  jade: '#00a676',
  slate: '#2c3e50',
  gray: '#e0e0e0',
  white: '#fff',
  bg: '#f9fafb',
};

interface MobileLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function MobileLayout({ 
  children, 
  showNav = true 
}: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Determine if we should show bottom navigation
  const showBottomNav = showNav && !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans">
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-[#e0e0e0] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2ecc71] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M7 13l3 3 7-7" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[#1b4332]">SafeReport</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-24">
          {children}
        </main>
        
        {/* Bottom navigation */}
        {showBottomNav && <MobileBottomNav />}
      </div>
    </div>
  );
} 