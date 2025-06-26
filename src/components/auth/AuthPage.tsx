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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
            {t('safeReport')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('SecurePlatform')}
          </p>
        </div>
        
        {isLogin ? (
          <>
            <LoginForm onToggleMode={toggleMode} />
          </>
        ) : (
          <>
          <RegisterForm onToggleMode={toggleMode} />
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">{t('haveAccount')}</span>
              <button
                className="ml-1 font-semibold text-black rounded px-2 py-1 hover:bg-black/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black/30"
                onClick={toggleMode}
              >
                {t('signIn')}
              </button>
            </div>
          </>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{t('privacyPriority')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;