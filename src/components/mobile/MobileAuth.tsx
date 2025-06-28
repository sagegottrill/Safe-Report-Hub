import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

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

export default function MobileAuth() {
  const { login, register, user } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{7,}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData.email, formData.password, formData.name, formData.phone);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    label, 
    type, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon, 
    error, 
    showToggle = false,
    onToggle = () => {}
  }: {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon: any;
    error?: string;
    showToggle?: boolean;
    onToggle?: () => void;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#1b4332]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Icon className="w-5 h-5 text-[#2c3e50]/60" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 font-sans text-base transition-all ${
            error 
              ? 'border-red-300 bg-red-50 focus:border-red-400' 
              : 'border-[#e0e0e0] bg-white focus:border-[#2ecc71] focus:ring-2 focus:ring-[#e8f5e9]'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {type === 'password' ? (
              <EyeOff className="w-5 h-5 text-[#2c3e50]/60" />
            ) : (
              <Eye className="w-5 h-5 text-[#2c3e50]/60" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#2ecc71] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#fff"/>
            <path d="M7 13l3 3 7-7" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1b4332] mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-600 text-base">
          {isLogin ? 'Sign in to your account to continue' : 'Join our community to start reporting'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <InputField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                icon={User}
                error={errors.name}
              />
              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                icon={Phone}
                error={errors.phone}
              />
            </>
          )}

          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="Enter your email address"
            icon={Mail}
            error={errors.email}
          />

          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
            showToggle={true}
            onToggle={() => setShowPassword(!showPassword)}
          />

          {!isLogin && (
            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              icon={Lock}
              error={errors.confirmPassword}
              showToggle={true}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all ${
              loading
                ? 'bg-[#e0e0e0] text-[#2c3e50] cursor-not-allowed'
                : 'bg-[#2ecc71] text-white shadow-lg active:scale-95 hover:bg-[#27ae60]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {isLogin ? 'Sign In' : 'Create Account'}
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Toggle Mode */}
      <div className="text-center">
        <p className="text-slate-600 text-base">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
            setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
          }}
          className="text-[#2ecc71] font-semibold text-base mt-2 hover:text-[#27ae60] transition-colors"
        >
          {isLogin ? 'Create Account' : 'Sign In'}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
} 