import React from 'react';
import PublicDashboard from '@/components/dashboard/PublicDashboard';
import { useNavigate } from 'react-router-dom';

const PublicDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => navigate('/')}
        className="mb-6 mt-4 ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>
      <PublicDashboard />
    </div>
  );
};

export default PublicDashboardPage; 