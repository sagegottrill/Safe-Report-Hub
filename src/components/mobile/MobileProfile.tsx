import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  EyeOff,
  Crown,
  Award
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MobileProfile: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5e9] to-[#f0fdf4]">
      {/* Header with Navigation */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#1b4332] font-semibold bg-[#e8f5e9] px-4 py-3 rounded-2xl shadow-md active:scale-95 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>
            <div className="text-right">
              <h1 className="text-xl font-bold text-[#1b4332]">Profile</h1>
              <p className="text-xs text-slate-500">Account Settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white/30">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-sm opacity-90">{getRoleDisplay(user?.role || 'user')}</p>
                <div className="mt-2">
                  <Badge className={`${getRoleColor(user?.role || 'user')} text-xs font-semibold`}>
                    {user?.role === 'super_admin' && <Crown className="h-3 w-3 mr-1" />}
                    {user?.role === 'admin' && <Award className="h-3 w-3 mr-1" />}
                    {getRoleDisplay(user?.role || 'user')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#1b4332] mb-6">Account Information</h3>
            
            <div className="space-y-6">
              {/* Name Section */}
              <div>
                <Label className="text-sm font-semibold text-[#1b4332] mb-2 block">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl p-4">
                    <p className="text-base font-semibold text-[#1b4332]">{user?.name || 'Not provided'}</p>
                  </div>
                )}
              </div>

              {/* User ID Section */}
              <div>
                <Label className="text-sm font-semibold text-[#1b4332] mb-2 block">
                  <Shield className="h-4 w-4 inline mr-2" />
                  User ID
                </Label>
                <div className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-[#1b4332] select-all">
                      {showUserId ? user?.id : '••••••••••••••••'}
                    </p>
                    <button
                      onClick={() => setShowUserId(v => !v)}
                      className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {showUserId ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div>
                <Label className="text-sm font-semibold text-[#1b4332] mb-2 block">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="bg-white border-2 border-[#e0e0e0] rounded-2xl shadow-md focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl p-4">
                    <p className="text-base font-semibold text-[#1b4332]">{user?.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>

              {/* Email Section */}
              <div>
                <Label className="text-sm font-semibold text-[#1b4332] mb-2 block">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </Label>
                <div className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl p-4">
                  <p className="text-base font-semibold text-[#1b4332]">{user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing ? (
              <div className="flex gap-3 pt-6">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="pt-6">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#e8f5e9] text-[#1b4332] font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#2ecc71]/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Account Actions Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-[#1b4332] mb-6">Account Actions</h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1b4332]">Settings</p>
                    <p className="text-xs text-slate-500">App preferences</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-2xl hover:bg-red-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-700">Logout</p>
                    <p className="text-xs text-red-500">Sign out of account</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 text-red-400 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProfile; 