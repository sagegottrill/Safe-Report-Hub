import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { LogOut, CheckCircle, ArrowLeft } from 'lucide-react';

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

export default function MobileLogout() {
  const { logout } = useAppContext();

  useEffect(() => {
    // Auto logout after a short delay
    const timer = setTimeout(() => {
      logout();
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-8 flex items-center justify-center">
      <div className="text-center max-w-sm w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-[#2ecc71]" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-[#1b4332] mb-3">Signed Out</h1>
        <p className="text-slate-600 text-base mb-8">
          You have been successfully logged out of your account.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/auth'}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60]"
          >
            Sign In Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-6 rounded-2xl font-semibold text-[#2c3e50] bg-white border-2 border-[#e0e0e0] shadow-md active:scale-95 transition-all hover:bg-[#f9fafb]"
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </div>
          </button>
        </div>

        {/* Auto redirect notice */}
        <p className="text-slate-500 text-sm mt-6">
          Redirecting to sign in page...
        </p>
      </div>
    </div>
  );
} 