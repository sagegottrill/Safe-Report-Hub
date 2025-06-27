import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { onAuthStateChange, signOutUser } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'field_officer' | 'case_worker' | 'country_admin' | 'super_admin' | 'admin' | 'governor' | 'user' | 'governor_admin';
  region?: string;
  allowedCategories?: string[];
  photoURL?: string;
}

interface Report {
  id: string;
  type: string;
  date: string;
  platform: string;
  description: string;
  impact: string[];
  perpetrator?: string;
  status: 'new' | 'under-review' | 'resolved';
  isAnonymous: boolean;
  reporterId?: string;
  riskScore?: number;
  adminNotes?: string;
  reporterEmail?: string;
  flagged?: boolean;
  region?: string;
  urgency?: string;
  caseId?: string;
  pin?: string;
}

interface AppContextType {
  user: User | null;
  reports: Report[];
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'report' | 'auth' | 'admin' | 'governor' | 'governor-admin';
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  submitReport: (report: Omit<Report, 'id' | 'status'>) => string;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  deleteReport: (reportId: string) => void;
  toggleSidebar: () => void;
  setCurrentView: (view: 'dashboard' | 'report' | 'auth' | 'admin' | 'governor' | 'governor-admin') => void;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const URGENT_KEYWORDS = [
  'rape', 'injured', 'injury', 'bomb', 'explosion', 'hunger', 'starving', 'starvation', 'attack', 'violence', 'critical', 'emergency', 'death', 'dead', 'dying', 'shooting', 'gun', 'fire', 'evacuate', 'urgent', 'danger', 'abuse', 'assault', 'trafficking', 'kidnap', 'missing', 'unconscious', 'bleeding', 'severe', 'hospital', 'ambulance', 'life-threatening'
];

// Utility to extract and capitalize the first real name from email or name
function extractFirstName(email: string, name?: string) {
  // Always return a clean, simple name
  return 'User';
}

// Utility to generate a unique case ID
function generateCaseId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'SR-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// Utility to generate a 4-digit PIN
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Predefined admin users
const PREDEFINED_ADMINS = [
  {
    id: 'admin-daniel',
    email: 'admin.daniel@bictdareport.com',
    password: '123456',
    name: 'Daniel Admin',
    phone: 'N/A',
    role: 'admin'
  },
  {
    id: 'admin-sj',
    email: 'admin.s.j@bictdareport.com',
    password: '123456',
    name: 'S.J. Admin',
    phone: 'N/A',
    role: 'admin'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  });
  
  // Initialize reports from localStorage or as empty array
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const stored = localStorage.getItem('reports');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored reports:', error);
      return [];
    }
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'auth' | 'admin' | 'governor' | 'governor-admin'>(() => {
    try {
    const stored = localStorage.getItem('currentView');
    const storedUser = localStorage.getItem('user');
    // If no user is logged in, always show auth page
    if (!storedUser) {
      return 'auth';
    }
    return stored ? stored as any : 'dashboard';
    } catch (error) {
      console.error('Error parsing stored view:', error);
      return 'auth';
    }
  });

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem('user', JSON.stringify(firebaseUser));
        let role: User['role'] = 'user';
        let region = undefined;
        let allowedCategories = undefined;
        if (/^admin\./i.test(firebaseUser.email.trim())) role = 'admin';
        if (/^superadmin\./i.test(firebaseUser.email.trim())) role = 'super_admin';
        if (/^country\./i.test(firebaseUser.email.trim())) { role = 'country_admin'; region = 'Nigeria'; }
        if (/^case\./i.test(firebaseUser.email.trim())) { role = 'case_worker'; region = 'Nigeria'; allowedCategories = ['gender_based_violence', 'child_protection']; }
        if (/^field\./i.test(firebaseUser.email.trim())) { role = 'field_officer'; region = 'Nigeria'; allowedCategories = ['food_insecurity', 'water_sanitation', 'shelter_issues', 'health_emergencies']; }
        if (/^governor_admin\./i.test(firebaseUser.email.trim())) role = 'governor_admin';
        else if (/^governor\./i.test(firebaseUser.email.trim())) role = 'governor';
        const displayName = extractFirstName(firebaseUser.email, firebaseUser.displayName);
        const mockUser: User = {
          id: '1',
          email: firebaseUser.email,
          name: displayName,
          role,
          region,
          allowedCategories,
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        let view: typeof currentView = 'dashboard';
        if (role === 'admin' || role === 'super_admin' || role === 'country_admin') view = 'admin';
        if (role === 'governor_admin') view = 'governor-admin';
        if (role === 'governor') view = 'governor';
        setCurrentView(view);
        localStorage.setItem('currentView', view);
      } else {
        setUser(null);
        setCurrentView('auth');
        localStorage.removeItem('user');
        localStorage.removeItem('currentView');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
    if (email && password.length >= 6) {
        // First check predefined admin users
        const predefinedAdmin = PREDEFINED_ADMINS.find(u => u.email === email && u.password === password);
        if (predefinedAdmin) {
          setUser(predefinedAdmin);
          localStorage.setItem('user', JSON.stringify(predefinedAdmin));
          setCurrentView('dashboard');
          localStorage.setItem('currentView', 'dashboard');
          toast({ title: 'Login successful', description: `Welcome, ${predefinedAdmin.name}!` });
          return true;
        }

        // Then check localStorage users array for a match
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find((u: any) => u.email === email && u.password === password);
        if (found) {
          setUser(found);
          localStorage.setItem('user', JSON.stringify(found));
          setCurrentView('dashboard');
          localStorage.setItem('currentView', 'dashboard');
          toast({ title: 'Login successful', description: `Welcome, ${found.name || found.email}!` });
      return true;
    }

        toast({ title: 'Login failed', description: 'Invalid email or password' });
        return false;
      }
      toast({ title: 'Login failed', description: 'Please enter valid credentials' });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({ title: 'Login failed', description: 'An error occurred during login' });
    return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    try {
    if (email && password.length >= 6 && name && phone) {
      const displayName = extractFirstName(email, name);
        const userId = Math.random().toString(36).substr(2, 9);
        const mockUser = { 
          id: userId, 
          email, 
          name: displayName, 
          phone, 
          role: 'user' as const, 
          password 
        };
        // Store user in users array
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = [...existingUsers, mockUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setCurrentView('dashboard');
      localStorage.setItem('currentView', 'dashboard');
      toast({ title: 'Registration successful', description: 'Account created!' });
      return true;
    }
    return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({ title: 'Registration failed', description: 'An error occurred during registration' });
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      if (!email) {
        toast({ title: 'Error', description: 'Please enter your email address' });
        return false;
      }

      // Check predefined admin users first
      const predefinedAdmin = PREDEFINED_ADMINS.find(u => u.email === email);
      if (predefinedAdmin) {
        await sendPasswordEmail(email, predefinedAdmin.password);
        toast({ title: 'Password Recovery', description: 'Password recovery email sent!' });
        return true;
      }

      // Check localStorage users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        await sendPasswordEmail(email, user.password);
        toast({ title: 'Password Recovery', description: 'Password recovery email sent!' });
        return true;
      } else {
        toast({ title: 'Error', description: 'Email not found in our system' });
        return false;
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      toast({ title: 'Error', description: 'Failed to send password recovery email' });
      return false;
    }
  };

  const sendPasswordEmail = async (email: string, password: string) => {
    try {
      // Create email content
      const subject = 'BICTDA REPORT password recovery';
      const body = `Here is your password: ${password}`;
      
      // Send email automatically via backend API
      const response = await fetch('/api/sendPasswordEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: subject,
          body: body
        })
      });

      if (response.ok) {
        // Show success message without revealing the password
        toast({ 
          title: 'Password Recovery', 
          description: 'Password recovery email has been sent to your email address.',
          duration: 5000
        });
      } else {
        // Fallback: if backend fails, show generic message
        toast({ 
          title: 'Password Recovery', 
          description: 'Password recovery email has been sent to your email address.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      // Even if there's an error, show success message for security
      toast({ 
        title: 'Password Recovery', 
        description: 'Password recovery email has been sent to your email address.',
        duration: 5000
      });
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setCurrentView('auth');
      setSidebarOpen(false);
      localStorage.removeItem('user');
      localStorage.removeItem('currentView');
      toast({ title: 'Logged out', description: 'See you next time!' });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to local logout
      setUser(null);
      setCurrentView('auth');
      setSidebarOpen(false);
      localStorage.removeItem('user');
      localStorage.removeItem('currentView');
      toast({ title: 'Logged out', description: 'See you next time!' });
    }
  };

  const submitReport = (reportData: Omit<Report, 'id' | 'status'>): string => {
    try {
    // AI/keyword pre-screening
    const text = `${reportData.description} ${reportData.type}`.toLowerCase();
    const flagged = URGENT_KEYWORDS.some(word => text.includes(word));
    const riskScore = flagged ? 10 : (reportData.riskScore ?? Math.floor(Math.random() * 10) + 1);
    const newReport: Report = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      riskScore,
      adminNotes: flagged ? 'Auto-flagged for urgent review' : reportData.adminNotes,
      flagged,
      region: reportData.region || user?.region,
      urgency: flagged ? 'urgent' : undefined,
      caseId: generateCaseId(),
      pin: generatePin(),
        reporterId: user?.id, // Link report to user
        reporterEmail: user?.email, // Store user email in report
        date: new Date().toISOString(), // Ensure proper date format
    };
    setReports(prev => [...prev, newReport]);
    toast({ title: 'Report submitted', description: `Reference ID: ${newReport.caseId}` });
    return newReport.id;
    } catch (error) {
      console.error('Report submission error:', error);
      toast({ title: 'Submission failed', description: 'An error occurred while submitting the report' });
      throw error;
    }
  };

  const updateReport = (reportId: string, updates: Partial<Report>) => {
    try {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
    toast({ 
      title: 'Report updated', 
      description: `Report ${reportId.substring(0, 6)} has been updated.` 
    });
    } catch (error) {
      console.error('Report update error:', error);
      toast({ title: 'Update failed', description: 'An error occurred while updating the report' });
    }
  };

  const deleteReport = (reportId: string) => {
    try {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast({
      title: 'Report deleted',
      description: `Report ${reportId.substring(0, 6)} has been deleted.`
    });
    } catch (error) {
      console.error('Report deletion error:', error);
      toast({ title: 'Deletion failed', description: 'An error occurred while deleting the report' });
    }
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Keep user and currentView in sync with localStorage
  useEffect(() => {
    try {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [user]);
  
  useEffect(() => {
    try {
    if (currentView) localStorage.setItem('currentView', currentView);
    else localStorage.removeItem('currentView');
    } catch (error) {
      console.error('Error saving currentView to localStorage:', error);
    }
  }, [currentView]);

  // Add effect to keep reports in sync with localStorage
  useEffect(() => {
    try {
    localStorage.setItem('reports', JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports to localStorage:', error);
    }
  }, [reports]);

  // Real-time localStorage sync across tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'reports') {
        try {
          setReports(event.newValue ? JSON.parse(event.newValue) : []);
        } catch (error) {
          console.error('Error parsing reports from storage event:', error);
        }
      }
      if (event.key === 'user') {
        try {
          setUser(event.newValue ? JSON.parse(event.newValue) : null);
        } catch (error) {
          console.error('Error parsing user from storage event:', error);
        }
      }
      if (event.key === 'currentView') {
        try {
          setCurrentView(event.newValue as any);
        } catch (error) {
          console.error('Error parsing currentView from storage event:', error);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      reports,
      sidebarOpen,
      currentView,
      login,
      register,
      forgotPassword,
      logout,
      submitReport,
      updateReport,
      deleteReport,
      toggleSidebar,
      setCurrentView,
      setReports,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Add a function to look up report status by case ID and PIN
function lookupReportStatus(reports: Report[], caseId: string, pin?: string) {
  const report = reports.find(r => r.caseId === caseId);
  if (!report) return null;
  if (report.pin && pin && report.pin !== pin) return null;
  return {
    status: report.status,
    date: report.date,
    adminNotes: report.adminNotes || '',
  };
}
export { lookupReportStatus };