import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import React, { Suspense, lazy } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import FAQ from './pages/FAQ';

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

const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const AdminAnalyticsPage = React.lazy(() => import('./pages/AdminAnalyticsPage'));
const CommunityDashboardPage = React.lazy(() => import('./pages/CommunityDashboardPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const TestMultiSectoral = React.lazy(() => import('./pages/TestMultiSectoral'));
const ReportPage = React.lazy(() => import('./pages/ReportPage'));
const GovernorPanel = React.lazy(() => import('./pages/GovernorPanel'));
const GovernorAdminPanel = React.lazy(() => import('./components/admin/GovernorAdminPanel'));

const AppRoutes: React.FC = () => {
  const { user } = useAppContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/test-multisectoral" element={<TestMultiSectoral />} />
        <Route path="/report" element={<ReportPage />} />
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

const App = () => {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AppRoutes />
            </Suspense>
            <Analytics />
            <SpeedInsights />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;