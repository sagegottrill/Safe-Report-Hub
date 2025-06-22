import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle } from '@/lib/firebase';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAppContext();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setError(t('Login failed. Please check your credentials and try again.'));
      toast.error(t('Login failed. Please check your credentials and try again.'));
    } else {
      toast.success(t('Login successful!'));
    }
  };

  // Google sign-in handler using Firebase
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      // Update the AppContext to handle Firebase user
      await login(user.email, user.id); // Use user ID as password for compatibility
      toast.success('Signed in with Google!');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          {t('Access your secure reporting dashboard')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        {error && (
          <div className="text-red-600 text-xs text-center mt-2" aria-live="polite">{error}</div>
        )}
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode}>
            Don't have an account? Register
          </Button>
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="outline" className="flex items-center gap-2 px-4 py-2 border-gray-300 shadow-sm hover:bg-gray-50" onClick={handleGoogleSignIn} disabled={googleLoading}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.898-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.781 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.637z" fill="#4285F4"/>
                  <path d="M3.152 7.548l3.281 2.406c.891-1.789 2.578-2.93 4.547-2.93 1.172 0 2.242.406 3.078 1.203l2.312-2.312c-1.406-1.312-3.219-2.117-5.39-2.117-3.672 0-6.75 2.484-7.844 5.898z" fill="#34A853"/>
                  <path d="M12.98 22.016c2.203 0 4.047-.727 5.391-1.977l-2.484-2.031c-.672.453-1.547.773-2.906.773-2.344 0-4.328-1.578-5.047-3.711l-3.273 2.531c1.406 2.789 4.344 4.415 8.319 4.415z" fill="#FBBC05"/>
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.898-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.781 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.637z" fill="none"/>
                </g>
              </svg>
              <span className="font-medium text-gray-700">{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;