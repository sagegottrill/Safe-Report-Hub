import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AppProvider } from '@/contexts/AppContext';
import { useAppContext } from '@/contexts/AppContext';
import AuthPage from '@/components/auth/AuthPage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminPageContent: React.FC = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!user) return;
    const allowedRoles = ['admin', 'super_admin', 'country_admin', 'case_worker', 'field_officer'];
    if (!allowedRoles.includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('adminDashboard')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={logout} className="text-blue-600 border-blue-600 hover:bg-blue-50">
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <AdminDashboard user={user} />
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  return <AdminPageContent />;
};

export default AdminPage;