import React from 'react';
import { useLocation } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  
  // Don't show bottom nav on auth page
  const showBottomNav = !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe-area">
      <div className="flex flex-col min-h-screen">
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