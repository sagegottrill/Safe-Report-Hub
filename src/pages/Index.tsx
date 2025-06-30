import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthPage from '@/components/auth/AuthPage';
import { useAppContext } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const { user } = useAppContext();
  if (!user) return <AuthPage />;
  return <AppLayout />;
};

export default Index;
