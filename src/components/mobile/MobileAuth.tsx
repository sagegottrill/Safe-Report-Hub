import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';

const MobileAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, register, forgotPassword } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const success = await register(email, password, name, phone);
    setLoading(false);
    if (!success) {
      toast.error('Registration failed. Please try again.');
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
        toast.success('Password recovery email sent!');
      }
    } catch (error) {
      toast.error('Failed to send password recovery email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Card with gradient header, logo, and app name */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-nigerian-green to-emerald-500 text-white px-6 pt-5 pb-4 flex flex-col items-center justify-center gap-2 rounded-2xl mb-6">
            <div className="bg-white/20 p-2 rounded-full shadow mb-1">
              <img src="/shield.svg" alt="BICTDA Report Logo" className="h-8 w-8" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-extrabold leading-tight tracking-wide">BICTDA</span>
              <span className="text-base font-normal leading-tight">Report</span>
            </div>
          </div>
          <div className="space-y-7 flex flex-col justify-center">
            {/* Avatar for visual balance */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-nigerian-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            {isLogin ? (
              <>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] mt-2" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <Button variant="link" type="button" className="text-blue-600 font-semibold p-0 h-auto min-w-0" onClick={() => setForgotPasswordOpen(true)}>
                      Forgot Password?
                    </Button>
                    <span className="text-gray-500 text-sm">Don&apos;t have an account?{' '}
                      <Button variant="link" type="button" className="text-nigerian-green font-semibold p-0 h-auto min-w-0" onClick={() => setIsLogin(false)}>
                        Register
                      </Button>
                    </span>
                  </div>
                </form>
                <div className="mt-4 text-xs text-gray-500 text-center">
                  We respect your privacy. Your login details are never shared.
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleRegister} className="w-full space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2"><Lock className="h-4 w-4" /> Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-base mt-1 transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-[#2ecc71] shadow-lg text-lg active:scale-95 transition-all hover:bg-[#27ae60] mt-2" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <span className="text-gray-500 text-sm">Already have an account?{' '}
                      <Button variant="link" type="button" className="text-nigerian-green font-semibold p-0 h-auto min-w-0" onClick={() => setIsLogin(true)}>
                        Sign In
                      </Button>
                    </span>
                  </div>
                </form>
                <div className="mt-4 text-xs text-gray-500 text-center">
                  We respect your privacy. Your registration details are never shared.
                </div>
              </>
            )}
            <Separator />
            <div className="text-xs text-gray-400 text-center max-w-xs mx-auto pt-2">
              Your privacy is our priority. All reports are handled with confidentiality.
            </div>
          </div>
        </div>
        {/* Forgot Password Dialog */}
        {forgotPasswordOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs">
              <h3 className="text-lg font-bold mb-2 text-nigerian-green">Password Recovery</h3>
              <p className="text-gray-600 text-sm mb-4">Enter your email address and we'll send you a password reset link.</p>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setForgotPasswordOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleForgotPassword} disabled={forgotLoading || !forgotEmail} className="flex-1 bg-nigerian-green text-white">
                  {forgotLoading ? 'Sending...' : 'Send Link'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAuth; 