import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppContextProvider } from './contexts/AppContext';
import { ThemeProvider } from './components/theme-provider';
import { useAuth } from './hooks/useAuth';
import MobileLayout from './components/mobile/MobileLayout';
import MobileDashboard from './components/mobile/MobileDashboard';
import MobileReportForm from './components/mobile/MobileReportForm';
import MobileAuth from './components/mobile/MobileAuth';
import MobileAdmin from './components/mobile/MobileAdmin';
import MobileGovernor from './components/mobile/MobileGovernor';
import MobileFAQ from './components/mobile/MobileFAQ';
import MobileLoading from './components/mobile/MobileLoading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function MobileAppContent() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization delay for better UX
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !isInitialized) {
    return <MobileLoading />;
  }

  return (
    <Router>
      <MobileLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MobileDashboard />} />
          <Route path="/auth" element={<MobileAuth />} />
          <Route path="/faq" element={<MobileFAQ />} />
          
          {/* Protected routes */}
          <Route 
            path="/report" 
            element={
              user ? <MobileReportForm /> : <Navigate to="/auth" replace />
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              user?.role === 'admin' ? <MobileAdmin /> : <Navigate to="/auth" replace />
            } 
          />
          
          {/* Governor routes */}
          <Route 
            path="/governor" 
            element={
              user?.role === 'governor_admin' ? <MobileGovernor /> : <Navigate to="/auth" replace />
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileLayout>
    </Router>
  );
}

export default function MobileApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mobile-theme">
        <AppContextProvider>
          <MobileAppContent />
          <Toaster 
            position="top-center"
            richColors
            closeButton
            duration={4000}
          />
        </AppContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 