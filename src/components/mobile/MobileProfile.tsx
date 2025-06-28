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
  X
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MobileProfile: React.FC = () => {
  const { user, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.phone || '');

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
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f1f8e9] to-[#e3f2fd] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-nigerian-green p-2 rounded-full shadow">
            <img src="/shield.svg" alt="BICTDA Report Logo" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-nigerian-green">BICTDA Report</h1>
            <p className="text-xs text-gray-500">Profile</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="text-nigerian-green hover:bg-nigerian-green/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="w-full bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-nigerian-green to-emerald-500 text-white pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-nigerian-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <User className="h-4 w-4" />
              Full Name
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{user?.name || 'Not provided'}</p>
            )}
          </div>

          <Separator />

          {/* Email Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Mail className="h-4 w-4" />
              Email Address
            </div>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>

          <Separator />

          {/* Phone Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Phone className="h-4 w-4" />
              Phone Number
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-nigerian-green"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
            )}
          </div>

          <Separator />

          {/* Role Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Shield className="h-4 w-4" />
              Role
            </div>
            <Badge className={`${getRoleColor(user?.role || 'user')} font-semibold`}>
              {getRoleDisplay(user?.role || 'user')}
            </Badge>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-nigerian-green to-emerald-500 text-white font-semibold rounded-lg shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-gray-300 text-gray-700 font-semibold rounded-lg"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card className="w-full bg-white rounded-2xl shadow-xl border-0 mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Settings className="h-5 w-5 text-nigerian-green" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-50 rounded-lg py-3"
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            Preferences
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-50 rounded-lg py-3"
          >
            <Shield className="h-4 w-4 mr-3 text-gray-500" />
            Privacy & Security
          </Button>
          <Separator />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:bg-red-50 rounded-lg py-3"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} BICTDA Report. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MobileProfile; 