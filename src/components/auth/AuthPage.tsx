import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useTranslation();

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1b4332] via-[#2ecc71] to-[#27ae60] flex items-center justify-center p-0">
      <div className="w-full max-w-md mx-auto px-2 sm:px-0">
        <div className="flex flex-col items-center mb-8 pt-8">
          <div className="bg-white/30 backdrop-blur-md rounded-full p-4 shadow-lg mb-4">
            <Shield className="h-12 w-12 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
            {t('safeReport')}
          </h1>
          <p className="text-gray-700 mt-2 font-medium">
            {t('SecurePlatform')}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6">
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 rounded-l-full font-semibold transition-colors duration-200 ${isLogin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-6 py-2 rounded-r-full font-semibold transition-colors duration-200 ${!isLogin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
        <div className="mt-6 text-center text-sm text-gray-500 pb-8">
          <p>{t('privacyPriority')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;