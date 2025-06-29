import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Edit,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MobileProfile: React.FC = () => {
  const { user, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');
  const [showUserId, setShowUserId] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleSave = () => {
    // In a real app, you'd update the user profile here
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedPhone(user?.phone || '');
    setIsEditing(false);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'super_admin': 'Super Administrator',
      'country_admin': 'Country Administrator',
      'governor': 'Governor',
      'governor_admin': 'Governor Administrator',
      'case_worker': 'Case Worker',
      'field_officer': 'Field Officer',
      'user': 'User'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      'admin': 'bg-blue-100 text-blue-800',
      'super_admin': 'bg-purple-100 text-purple-800',
      'country_admin': 'bg-green-100 text-green-800',
      'governor': 'bg-orange-100 text-orange-800',
      'governor_admin': 'bg-red-100 text-red-800',
      'case_worker': 'bg-indigo-100 text-indigo-800',
      'field_officer': 'bg-teal-100 text-teal-800',
      'user': 'bg-gray-100 text-gray-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans px-4 py-6 pb-24 flex flex-col items-center">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-nigerian-green to-emerald-500 text-white rounded-3xl shadow-lg px-6 pt-4 pb-3 mb-6 w-full max-w-md flex flex-col items-center">
        <div className="bg-white/20 p-2 rounded-full shadow mb-2 flex items-center justify-center">
          <User className="h-7 w-7 text-white" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl font-extrabold leading-tight tracking-wide">Profile</span>
          <span className="text-base font-normal leading-tight">Account Details</span>
        </div>
      </div>

      {/* Profile Content Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-md mb-4">
        {/* Avatar Section */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-nigerian-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        {/* Name Section */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <User className="h-4 w-4" />
            Full Name
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-sm"
            />
          ) : (
            <p className="text-base font-semibold text-gray-800">{user?.name || 'Not provided'}</p>
          )}
        </div>
        <Separator />
        {/* User ID Section */}
        <div className="space-y-1 mb-2 mt-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Shield className="h-4 w-4" />
            User ID
          </div>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-gray-800 select-all">
              {showUserId ? user?.id : '••••••••••••••••'}
            </p>
            <button
              type="button"
              aria-label={showUserId ? 'Hide User ID' : 'Show User ID'}
              onClick={() => setShowUserId(v => !v)}
              className="focus:outline-none"
            >
              {showUserId ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
        </div>
        <Separator />
        {/* Phone Section */}
        <div className="space-y-1 mb-2 mt-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Phone className="h-4 w-4" />
            Phone Number
          </div>
          {isEditing ? (
            <input
              type="tel"
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-xl bg-white shadow focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green text-sm"
            />
          ) : (
            <p className="text-base font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
          )}
        </div>
        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-nigerian-green to-emerald-500 text-white font-semibold rounded-2xl shadow-lg"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-300 text-gray-700 font-semibold rounded-2xl"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-8 mb-2 w-full fixed bottom-0 left-0 bg-[#f9fafb] py-3 z-40">
        © 2025 BICTDA Report - All rights reserved.
      </div>
    </div>
  );
};

export default MobileProfile; 