import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAppContext();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t('passwordsDoNotMatch'));
      return;
    }
    setLoading(true);
    await register(email, password, name);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{t('createAccount')}</CardTitle>
        <CardDescription className="text-center">
          {t('joinPlatform')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fullName')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t('enterFullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder={t('createPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmYourPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-md hover:from-emerald-600 hover:to-green-700 transition-colors duration-200" disabled={loading}>
            {loading ? t('creatingAccount') : t('createAccount')}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode}>
            {t('alreadyHaveAccount')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;