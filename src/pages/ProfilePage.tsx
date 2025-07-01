import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { User, Mail, Phone, Shield, Edit, Check, X, LogOut, Eye, EyeOff } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState('');
  const [showUserId, setShowUserId] = useState(false);
  const [userPhone, setUserPhone] = useState<string>('');

  useEffect(() => {
    if (user?.phone) {
      setUserPhone(user.phone);
      setEditedPhone(user.phone);
    } else {
      setUserPhone('');
      setEditedPhone('');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleSave = () => {
    // In a real app, update the user profile in the backend
    // For now, just update localStorage for demo
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          name: editedName,
          phone: editedPhone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserPhone(editedPhone);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedPhone(userPhone);
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

  if (!user) return <div className="flex justify-center items-center min-h-screen">Not logged in.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5e9] to-[#f0fdf4] p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="h-7 w-7 text-nigerian-green" />
            Profile
          </CardTitle>
          <div className="mt-2">
            <Badge className={`${getRoleColor(user.role)} text-xs font-semibold`}>{getRoleDisplay(user.role)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Name */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
            {isEditing ? (
              <Input
                type="text"
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                className="mt-2"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="bg-gray-50 border rounded-lg p-3 mt-2">
                <span className="font-medium text-lg">{user.name || 'Not provided'}</span>
              </div>
            )}
          </div>
          {/* User ID */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> User ID</Label>
            <div className="bg-gray-50 border rounded-lg p-3 mt-2 flex items-center justify-between">
              <span className="font-mono select-all">{showUserId ? user.id : '••••••••••••••••'}</span>
              <Button variant="ghost" size="icon" onClick={() => setShowUserId(v => !v)}>
                {showUserId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {/* Phone */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
            {isEditing ? (
              <Input
                type="tel"
                value={editedPhone}
                onChange={e => setEditedPhone(e.target.value)}
                className="mt-2"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="bg-gray-50 border rounded-lg p-3 mt-2">
                <span className="font-medium">{userPhone || user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>
          {/* Email */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</Label>
            <div className="bg-gray-50 border rounded-lg p-3 mt-2">
              <span className="font-medium">{user.email || 'Not provided'}</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1 bg-nigerian-green text-white font-bold">
                  <Check className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="flex-1 bg-gray-200 text-nigerian-green font-semibold">
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
            <Button variant="destructive" onClick={handleLogout} className="flex-1">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 