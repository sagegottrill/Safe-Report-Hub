import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import FAQ from './pages/FAQ';
import { redirectToMobile } from './utils/deviceDetection';
import AdminPage from './pages/AdminPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import CommunityDashboardPage from './pages/CommunityDashboardPage';
import NotFound from './pages/NotFound';
import TestMultiSectoral from './pages/TestMultiSectoral';
import ReportPage from './pages/ReportPage';
import GovernorPanel from '@/pages/GovernorPanel';
import LoadingScreen from './components/LoadingScreen';
import MobileApp from './MobileApp';
import AuthPage from './components/auth/AuthPage';
const GovernorAdminPanel = React.lazy(() => import('./components/admin/GovernorAdminPanel'));

const queryClient = new QueryClient();

// Route guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  
  // If no user, redirect to home (which will show login)
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAppContext();
  
  console.log('AppRoutes: Rendering with user:', user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Index /> : <AuthPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/test-multisectoral" element={<TestMultiSectoral />} />
        <Route path="/report" element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-analytics" element={
          <ProtectedRoute>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/community-dashboard" element={<CommunityDashboardPage />} />
        <Route path="/governor" element={
          <ProtectedRoute>
            <GovernorPanel />
          </ProtectedRoute>
        } />
        <Route path="/governor-admin" element={
          <ProtectedRoute>
            {user?.role === 'governor_admin' ? <GovernorAdminPanel /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Simple ErrorBoundary implementation
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log errorInfo here if needed
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'red', background: '#fff', minHeight: '100vh' }}>
          <h2>Something went wrong (App Error)</h2>
          <pre style={{ textAlign: 'left', display: 'inline-block', background: '#f5f5f5', padding: 10, borderRadius: 6 }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleDeviceDetected = (mobile: boolean) => {
    setIsMobile(mobile);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onDeviceDetected={handleDeviceDetected} />;
  }

  if (isMobile) {
    return <MobileApp />;
  }

  return (
    <AppRoutes />
  );
};

const App = () => {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
            <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background-light">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nigerian-green mx-auto mb-4"></div>
                <p className="text-text-light">Loading...</p>
              </div>
            </div>}>
              <AppContent />
            </Suspense>
            </ErrorBoundary>
            <Analytics />
            <SpeedInsights />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;