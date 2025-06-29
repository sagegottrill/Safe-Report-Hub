import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import { TrustIndicator, PrivacyNotice } from '@/components/ui/trust-indicators';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, forgotPassword } = useAppContext();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setError(t('loginFailed'));
      toast.error(t('loginFailed'));
    } else {
      toast.success(t('loginSuccess'));
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    
    try {
      const success = await forgotPassword(forgotEmail);
      if (success) {
        setForgotPasswordOpen(false);
        setForgotEmail('');
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      toast.error('Failed to send password recovery email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full rounded-2xl shadow-xl border-0 px-0 sm:px-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('signIn')}</CardTitle>
          <CardDescription className="text-center">
            {t('accessDashboard')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-md hover:from-emerald-600 hover:to-green-700 transition-colors duration-200" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
          {error && (
            <div className="text-red-600 text-xs text-center mt-2" aria-live="polite">{error}</div>
          )}
          <PrivacyNotice className="mt-4">
            We respect your privacy. Your login details are never shared.
          </PrivacyNotice>
          <div className="mt-4 text-center space-y-2">
            <Button 
              variant="link" 
              onClick={() => setForgotPasswordOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              <Lock className="h-4 w-4 mr-1" />
              Forgot Password?
            </Button>
            <div>
              <Button variant="link" onClick={onToggleMode}>
                {t('dontHaveAccount')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Password Recovery
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <p className="text-sm text-gray-600">
              Enter your email address and we'll automatically send your password to your email.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotEmail('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleForgotPassword}
              disabled={forgotLoading || !forgotEmail}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {forgotLoading ? 'Sending...' : 'Send to Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;