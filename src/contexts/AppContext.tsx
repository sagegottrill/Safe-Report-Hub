import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  onAuthStateChange, 
  signOutUser, 
  createUserWithEmail, 
  signInWithEmail, 
  resetPassword,
  checkUserExists 
} from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { supabase, saveReport } from '@/lib/supabase';

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
  status: 'new' | 'under-review' | 'resolved' | 'pending';
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
  hidden?: boolean;
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
  submitReport: (report: Omit<Report, 'id' | 'status'>) => Promise<string>;
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

// Utility to generate a meaningful user ID
function generateMeaningfulUserId(name: string, role: string) {
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  const namePrefix = name ? name.substring(0, 2).toUpperCase() : 'US';
  const rolePrefix = role === 'admin' ? 'AD' : role === 'governor' ? 'GV' : role === 'user' ? 'US' : 'OF';
  const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 3; i++) {
    randomPart += randomChars[Math.floor(Math.random() * randomChars.length)];
  }
  return `${namePrefix}${rolePrefix}${timestamp}${randomPart}`;
}

// Utility to generate a 4-digit PIN
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Predefined admin users
const PREDEFINED_ADMINS = [
  {
    id: 'DAAADM1234XYZ',
    email: 'admin.daniel@bictdareport.com',
    password: '123456',
    name: 'Daniel Admin',
    phone: 'N/A',
    role: 'admin'
  },
  {
    id: 'SJAADM5678ABC',
    email: 'admin.s.j@bictdareport.com',
    password: '123456',
    name: 'S.J. Admin',
    phone: 'N/A',
    role: 'admin'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'auth' | 'admin' | 'governor' | 'governor-admin'>('auth');

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        let view: typeof currentView = 'dashboard';
        if (firebaseUser.role === 'admin' || firebaseUser.role === 'super_admin' || firebaseUser.role === 'country_admin') view = 'admin';
        if (firebaseUser.role === 'governor_admin') view = 'governor-admin';
        if (firebaseUser.role === 'governor') view = 'governor';
        setCurrentView(view);
      } else {
        setUser(null);
        setCurrentView('auth');
      }
    });
    return () => unsubscribe();
  }, []);

  // Supabase reports listener
  useEffect(() => {
    if (user) {
      // Fetch reports from Supabase
      const fetchReports = async () => {
        const { data, error } = await supabase.from('reports').select('*');
        if (error) {
          console.error('Failed to fetch reports:', error);
          toast.error('Failed to load reports');
        } else {
          setReports((data || []).filter(r => !r.hidden));
        }
      };
      fetchReports();
    } else {
      setReports([]); // Clear reports on logout
    }
  }, [user]);

  // Supabase real-time subscription for reports
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          setReports(prev => {
            // If this is a confirmation for a temp report, replace it
            if (payload.new.clientTempId) {
              const idx = prev.findIndex(r => (r as any).clientTempId && (r as any).clientTempId === payload.new.clientTempId);
              if (idx !== -1) {
                // Replace temp report with confirmed one, only if not hidden
                if (!payload.new.hidden) {
                  const updated = [...prev];
                  updated[idx] = { ...payload.new, status: 'new' } as Report;
                  return updated.filter(r => !r.hidden);
                } else {
                  // If hidden, just remove the temp
                  return prev.filter(r => (r as any).clientTempId !== payload.new.clientTempId);
                }
              }
            }
            // Avoid duplicates by id
            if (prev.some(r => r.id === payload.new.id)) return prev;
            // Only add if not hidden
            if (!payload.new.hidden) {
              return [payload.new as Report, ...prev.filter(r => !r.hidden)];
            } else {
              return prev.filter(r => !r.hidden);
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reports' },
        (payload) => {
          setReports(prev => {
            // If updated to hidden, remove from UI
            if (payload.new.hidden) {
              return prev.filter(r => r.id !== payload.new.id);
            }
            // Otherwise, update the report
            return prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r);
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('[LOGIN] Attempting login for', email);
    try {
      if (email && password.length >= 6) {
        // First check predefined admin users (fallback)
        const predefinedAdmin = PREDEFINED_ADMINS.find(u => u.email === email && u.password === password);
        if (predefinedAdmin) {
          const user: User = {
            id: predefinedAdmin.id,
            email: predefinedAdmin.email,
            name: predefinedAdmin.name,
            phone: predefinedAdmin.phone,
            role: predefinedAdmin.role as User['role'],
          };
          setUser(user);
          setCurrentView('admin');
          toast.success('Login successful!');
          console.log('[LOGIN] Success: predefined admin');
          return true;
        }
        // Try Firebase login
        try {
          const firebaseUser = await signInWithEmail(email, password);
          if (firebaseUser) {
            setUser(firebaseUser);
            let view: typeof currentView = 'dashboard';
            if (firebaseUser.role === 'admin' || firebaseUser.role === 'super_admin' || firebaseUser.role === 'country_admin') view = 'admin';
            if (firebaseUser.role === 'governor_admin') view = 'governor-admin';
            if (firebaseUser.role === 'governor') view = 'governor';
            setCurrentView(view);
            toast.success('Login successful!');
            console.log('[LOGIN] Success: firebase user');
            return true;
          }
        } catch (firebaseError) {
          console.warn('[LOGIN] Firebase login failed:', firebaseError);
        }
        // If not predefined admin or Firebase, do not log in
        toast.error('Login failed: Invalid email or password.');
        return false;
      }
      toast.error('Login failed: Please enter a valid email and password.');
      return false;
    } catch (error) {
      console.error('[LOGIN] Error:', error);
      toast.error('Login failed: An error occurred.');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    console.log('[REGISTER] Attempting registration for', email);
    console.log('[REGISTER] Firebase config check:', {
      apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: !!import.meta.env.VITE_FIREBASE_APP_ID
    });
    
    try {
      if (!email || !password || !name || !phone) {
        console.error('[REGISTER] Validation failed:', { email: !!email, password: !!password, name: !!name, phone: !!phone });
        toast.error('Registration failed: Please fill all fields correctly.');
        return false;
      }
      
      if (password.length < 6) {
        console.error('[REGISTER] Password too short:', password.length);
        toast.error('Registration failed: Password must be at least 6 characters.');
        return false;
      }

      // Store registration data for later retrieval
      const registrationData = { email, name, phone };
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Try cloud-based registration
      try {
        console.log('[REGISTER] Attempting Firebase registration...');
        const user = await createUserWithEmail(email, password, name, phone);
        console.log('[REGISTER] Firebase registration successful:', user);
        setUser(user);
        setCurrentView('dashboard');
        toast.success('Registration successful!');
        return true;
      } catch (cloudError: any) {
        console.error('[REGISTER] Cloud registration failed:', cloudError);
        console.error('[REGISTER] Error details:', {
          code: cloudError.code,
          message: cloudError.message,
          stack: cloudError.stack
        });
        
        // Provide specific error messages based on Firebase error codes
        let errorMessage = 'Registration failed: Could not register user.';
        if (cloudError.code === 'auth/email-already-in-use') {
          errorMessage = 'Registration failed: Email is already registered.';
        } else if (cloudError.code === 'auth/invalid-email') {
          errorMessage = 'Registration failed: Invalid email address.';
        } else if (cloudError.code === 'auth/weak-password') {
          errorMessage = 'Registration failed: Password is too weak.';
        } else if (cloudError.code === 'auth/network-request-failed') {
          errorMessage = 'Registration failed: Network error. Please check your connection.';
        }
        
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      console.error('[REGISTER] Unexpected error:', error);
      console.error('[REGISTER] Error details:', {
        message: error.message,
        stack: error.stack
      });
      toast.error('Registration failed: An unexpected error occurred.');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      if (!email) {
        toast.error('Error: Please enter your email address');
        return false;
      }

      // Check predefined admin users first
      const predefinedAdmin = PREDEFINED_ADMINS.find(u => u.email === email);
      if (predefinedAdmin) {
        await sendPasswordEmail(email, predefinedAdmin.password);
        toast.success('Password recovery email sent!');
        return true;
      }

      // Try cloud-based password reset
      try {
        await resetPassword(email);
        toast.success('Password reset email sent to your email address!');
        return true;
      } catch (cloudError: any) {
        console.log('Cloud password reset failed, trying local storage fallback:', cloudError.message);
        
        // Fallback to localStorage users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          await sendPasswordEmail(email, user.password);
          toast.success('Password recovery email sent!');
          return true;
        } else {
          toast.error('Error: Email not found in our system');
          return false;
        }
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      toast.error('Failed to send password recovery email');
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
        toast.success('Password recovery email has been sent to your email address.', {
          duration: 5000
        });
      } else {
        // Fallback: if backend fails, show generic message
        toast.success('Password recovery email has been sent to your email address.', {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      // Even if there's an error, show success message for security
      toast.success('Password recovery email has been sent to your email address.', {
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
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to local logout
      setUser(null);
      setCurrentView('auth');
      setSidebarOpen(false);
    }
  };

  const submitReport = async (reportData: Omit<Report, 'id' | 'status'>): Promise<string> => {
    // Generate a temporary client-side ID
    const clientTempId = 'temp-' + Math.random().toString(36).substr(2, 9);
    try {
      // AI/keyword pre-screening
      const text = `${reportData.description} ${reportData.type}`.toLowerCase();
      const flagged = URGENT_KEYWORDS.some(word => text.includes(word));
      const riskScore = flagged ? 10 : (reportData.riskScore ?? Math.floor(Math.random() * 10) + 1);
      const newReport: Report & { clientTempId?: string; status: string } = {
        ...reportData,
        id: clientTempId,
        clientTempId,
        status: 'pending',
        riskScore,
        adminNotes: flagged ? 'Auto-flagged for urgent review' : reportData.adminNotes,
        flagged,
        region: reportData.region || user?.region,
        urgency: flagged ? 'urgent' : undefined,
        caseId: generateCaseId(),
        pin: generatePin(),
        reporterId: user?.id,
        reporterEmail: user?.email,
        date: new Date().toISOString(),
      };
      setReports(prev => [newReport, ...prev]);
      // Submit to Supabase
      const { data, error } = await saveReport({ ...reportData, clientTempId }, user);
      if (error) {
        // Remove the optimistic report
        setReports(prev => prev.filter(r => r.id !== clientTempId));
        toast.error('Submission failed');
        throw error;
      }
      // Success: real-time will replace the temp report
      toast.success('Report submitted');
      return clientTempId;
    } catch (error) {
      setReports(prev => prev.filter(r => r.id !== clientTempId));
      toast.error('Submission failed');
      throw error;
    }
  };

  const updateReport = (reportId: string, updates: Partial<Report>) => {
    try {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
    toast.success('Report updated');
    } catch (error) {
      console.error('Report update error:', error);
      toast.error('Update failed');
    }
  };

  const deleteReport = (reportId: string) => {
    try {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast.success('Report deleted');
    } catch (error) {
      console.error('Report deletion error:', error);
      toast.error('Deletion failed');
    }
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

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
export { AppProvider as AppContextProvider };