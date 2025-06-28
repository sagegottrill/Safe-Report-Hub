import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import { ThemeProvider } from './components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Import all the same components as the main app
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import EnhancedReportForm from './components/report/EnhancedReportForm';
import AdminPage from './pages/AdminPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import CommunityDashboardPage from './pages/CommunityDashboardPage';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import TestMultiSectoral from './pages/TestMultiSectoral';
import ReportPage from './pages/ReportPage';
import GovernorPanel from '@/pages/GovernorPanel';
import GovernorAdminPanel from './components/admin/GovernorAdminPanel';

// Mobile-specific components
import MobileLayout from './components/mobile/MobileLayout';
import MobileLoading from './components/mobile/MobileLoading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route guard component (same as main app)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Mobile-optimized wrapper component
const MobileWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mobile-app-wrapper">
      <div className="mobile-content">
        {children}
      </div>
    </div>
  );
};

function MobileAppContent() {
  const { user } = useAppContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization delay for better UX
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <MobileLoading />;
  }

  return (
    <Router>
      <MobileLayout>
        <Routes>
          {/* Home and Mobile routes always show dashboard or auth */}
          <Route path="/" element={
            user ? (
              <MobileWrapper><Dashboard /></MobileWrapper>
            ) : (
              <MobileWrapper><AuthPage /></MobileWrapper>
            )
          } />
          <Route path="/mobile" element={
            user ? (
              <MobileWrapper><Dashboard /></MobileWrapper>
            ) : (
              <MobileWrapper><AuthPage /></MobileWrapper>
            )
          } />
          
          <Route path="/faq" element={<MobileWrapper><FAQ /></MobileWrapper>} />
          <Route path="/test-multisectoral" element={<MobileWrapper><TestMultiSectoral /></MobileWrapper>} />
          <Route path="/community-dashboard" element={<MobileWrapper><CommunityDashboardPage /></MobileWrapper>} />
          
          {/* Auth route */}
          <Route path="/auth" element={<MobileWrapper><AuthPage /></MobileWrapper>} />
          
          {/* Protected routes */}
          <Route 
            path="/report" 
            element={
              user ? <MobileWrapper><ReportPage /></MobileWrapper> : <Navigate to="/auth" replace />
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              user && ['admin', 'super_admin', 'country_admin'].includes(user.role) ? 
              <MobileWrapper><AdminPage /></MobileWrapper> : <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/admin-analytics" 
            element={
              user && ['admin', 'super_admin', 'country_admin'].includes(user.role) ? 
              <MobileWrapper><AdminAnalyticsPage /></MobileWrapper> : <Navigate to="/" replace />
            } 
          />
          
          {/* Governor routes */}
          <Route 
            path="/governor" 
            element={
              user && user.role === 'governor' ? 
              <MobileWrapper><GovernorPanel /></MobileWrapper> : <Navigate to="/" replace />
            } 
          />
          
          <Route 
            path="/governor-admin" 
            element={
              user && user.role === 'governor_admin' ? 
              <MobileWrapper><GovernorAdminPanel /></MobileWrapper> : <Navigate to="/" replace />
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<MobileWrapper><NotFound /></MobileWrapper>} />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default function MobileApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mobile-theme">
        <TooltipProvider>
          <AppContextProvider>
            <MobileAppContent />
            <Toaster 
              position="top-center"
              richColors
              closeButton
              duration={4000}
            />
            <Analytics />
            <SpeedInsights />
          </AppContextProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 