import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthPage from '@/components/auth/AuthPage';
import { useAppContext } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { user } = useAppContext();
  if (!user) return <AuthPage />;
  return (
    <div>
      <AppLayout />
      <Link to="/profile" className="text-blue-600 underline">Go to Profile Page</Link>
    </div>
  );
};

export default Index;
