import React from 'react';
import { Shield, Lock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustIndicatorProps {
  type: 'security' | 'privacy' | 'verified' | 'official' | 'anonymous' | 'urgent';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  type,
  children,
  className,
  size = 'md'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'privacy':
        return <Lock className="h-4 w-4" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'official':
        return <Shield className="h-4 w-4" />;
      case 'anonymous':
        return <Lock className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "inline-flex items-center gap-2 font-medium rounded-md";
    
    switch (type) {
      case 'security':
        return cn(baseStyles, "bg-green-50 text-green-700 border border-green-200", className);
      case 'privacy':
        return cn(baseStyles, "bg-blue-50 text-blue-700 border border-blue-200", className);
      case 'verified':
        return cn(baseStyles, "bg-green-50 text-green-700 border border-green-200", className);
      case 'official':
        return cn(baseStyles, "bg-green-50 text-green-700 border border-green-200", className);
      case 'anonymous':
        return cn(baseStyles, "bg-gray-50 text-gray-700 border border-gray-200", className);
      case 'urgent':
        return cn(baseStyles, "bg-red-50 text-red-700 border border-red-200", className);
      default:
        return cn(baseStyles, "bg-gray-50 text-gray-700 border border-gray-200", className);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return "px-2 py-1 text-xs";
      case 'md':
        return "px-3 py-2 text-sm";
      case 'lg':
        return "px-4 py-3 text-base";
      default:
        return "px-3 py-2 text-sm";
    }
  };

  return (
    <div className={cn(getStyles(), getSizeStyles())}>
      {getIcon()}
      <span>{children}</span>
    </div>
  );
};

interface SecurityBadgeProps {
  children: React.ReactNode;
  className?: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 bg-nigerian-green text-white text-xs font-medium rounded",
      className
    )}>
      <Shield className="h-3 w-3" />
      <span>{children}</span>
    </div>
  );
};

interface PrivacyNoticeProps {
  children: React.ReactNode;
  className?: string;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-blue-50 border border-blue-200 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          {children}
        </div>
      </div>
    </div>
  );
};

interface OfficialStampProps {
  children: React.ReactNode;
  className?: string;
}

const OfficialStamp: React.FC<OfficialStampProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 bg-nigerian-gold text-nigerian-green font-semibold text-sm rounded-full border-2 border-nigerian-green",
      className
    )}>
      <Shield className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
};

export { TrustIndicator, SecurityBadge, PrivacyNotice, OfficialStamp }; 