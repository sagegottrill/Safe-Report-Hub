import { useAppContext } from '@/contexts/AppContext';

export const useAuth = () => {
  const context = useAppContext();
  
  return {
    user: context.user,
    loading: false, // You can add loading state logic here if needed
    login: context.login,
    register: context.register,
    logout: context.logout,
    forgotPassword: context.forgotPassword
  };
}; 