import React from 'react';
import { Shield } from 'lucide-react';

export default function MobileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-pulse mb-6">
          <Shield size={64} className="mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Safety Support</h1>
        <p className="text-blue-100">Loading mobile version...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
} 