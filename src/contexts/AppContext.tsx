import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { onAuthStateChange, signOutUser } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'field_officer' | 'case_worker' | 'country_admin' | 'super_admin' | 'admin' | 'user';
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
  currentView: 'dashboard' | 'report' | 'auth' | 'admin';
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  submitReport: (report: Omit<Report, 'id' | 'status'>) => string;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  deleteReport: (reportId: string) => void;
  toggleSidebar: () => void;
  setCurrentView: (view: 'dashboard' | 'report' | 'auth' | 'admin') => void;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  // Always use demo data for demonstration
  const demoReports = [
    {
      id: 'GBV001',
      type: 'GBV',
      impact: ['Domestic Violence'],
      status: 'under-review',
      urgency: 'high',
      region: 'Lagos Central',
      date: '2024-01-15',
      description: 'A 32-year-old woman reported repeated domestic violence by her spouse in Lagos Central. Case is under review by the GBV office.',
      platform: 'Web',
      isAnonymous: false,
      reporterId: 'admin',
    },
    {
      id: 'EDU001',
      type: 'Education',
      impact: ['Infrastructure Problems'],
      status: 'new',
      urgency: 'medium',
      region: 'Kano North',
      date: '2024-01-15',
      description: 'A public school in Kano North reported a collapsed classroom block. Immediate repairs needed to ensure student safety.',
      platform: 'Web',
      isAnonymous: false,
      reporterId: 'admin',
    },
    {
      id: 'WAT001',
      type: 'Water',
      impact: ['No Water Supply'],
      status: 'resolved',
      urgency: 'critical',
      region: 'Abuja South',
      date: '2024-01-14',
      description: 'Abuja South community experienced a 48-hour water outage. Water supply has now been restored.',
      platform: 'Mobile',
      isAnonymous: false,
      reporterId: 'admin',
    },
    {
      id: 'HUM001',
      type: 'Humanitarian',
      impact: ['Food Insecurity'],
      status: 'new',
      urgency: 'critical',
      region: 'Borno State',
      date: '2024-01-15',
      description: 'Severe food shortage affecting over 500 families in Borno State. Humanitarian response escalated.',
      platform: 'SMS',
      isAnonymous: true,
      reporterId: 'admin',
    },
    {
      id: 'GBV002',
      type: 'GBV',
      impact: ['Sexual Harassment'],
      status: 'new',
      urgency: 'high',
      region: 'Kaduna',
      date: '2024-01-16',
      description: 'A 19-year-old student in Kaduna reported sexual harassment by a teacher. Investigation pending.',
      platform: 'Web',
      isAnonymous: true,
      reporterId: 'admin',
    },
    {
      id: 'EDU002',
      type: 'Education',
      impact: ['Bullying'],
      status: 'resolved',
      urgency: 'medium',
      region: 'Enugu',
      date: '2024-01-13',
      description: 'Bullying incident at Enugu secondary school resolved after mediation by school authorities.',
      platform: 'Mobile',
      isAnonymous: false,
      reporterId: 'admin',
    },
    {
      id: 'WAT002',
      type: 'Water',
      impact: ['Contaminated Water'],
      status: 'under-review',
      urgency: 'high',
      region: 'Jos',
      date: '2024-01-12',
      description: 'Jos community reported contaminated water supply. Health teams dispatched for testing.',
      platform: 'Web',
      isAnonymous: false,
      reporterId: 'admin',
    },
    {
      id: 'HUM002',
      type: 'Humanitarian',
      impact: ['Displacement'],
      status: 'new',
      urgency: 'critical',
      region: 'Benue',
      date: '2024-01-15',
      description: 'Flooding in Benue displaced over 200 people. Temporary shelters being arranged.',
      platform: 'Mobile',
      isAnonymous: false,
      reporterId: 'admin',
    },
  ];
  localStorage.setItem('reports', JSON.stringify(demoReports));
  const [reports, setReports] = useState<Report[]>(demoReports);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'auth' | 'admin'>(() => {
    const stored = localStorage.getItem('currentView');
    const storedUser = localStorage.getItem('user');
    // If no user is logged in, always show auth page
    if (!storedUser) {
      return 'auth';
    }
    return stored ? stored as any : 'dashboard';
  });

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem('user', JSON.stringify(firebaseUser));
        const view = (firebaseUser.role === 'admin' || firebaseUser.role === 'super_admin' || firebaseUser.role === 'country_admin') ? 'admin' : 'dashboard';
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
    // This is now handled by Firebase auth state listener
    // For demo purposes, we'll keep the mock login for non-Google users
    if (email && password.length >= 6) {
      // Demo role assignment by email prefix
      let role: User['role'] = 'user';
      let region = undefined;
      let allowedCategories = undefined;
      if (/^admin\./i.test(email.trim())) role = 'admin';
      if (/^superadmin\./i.test(email.trim())) role = 'super_admin';
      if (/^country\./i.test(email.trim())) { role = 'country_admin'; region = 'Nigeria'; }
      if (/^case\./i.test(email.trim())) { role = 'case_worker'; region = 'Nigeria'; allowedCategories = ['gender_based_violence', 'child_protection']; }
      if (/^field\./i.test(email.trim())) { role = 'field_officer'; region = 'Nigeria'; allowedCategories = ['food_insecurity', 'water_sanitation', 'shelter_issues', 'health_emergencies']; }
      const displayName = extractFirstName(email);
      const mockUser: User = {
        id: '1',
        email,
        name: displayName,
        role,
        region,
        allowedCategories,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      const view = (role === 'admin' || role === 'super_admin' || role === 'country_admin') ? 'admin' : 'dashboard';
      setCurrentView(view);
      localStorage.setItem('currentView', view);
      toast({ title: 'Login successful', description: `Welcome, ${role.replace('_', ' ')}!` });
      return true;
    }
    toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
    return false;
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    if (email && password.length >= 6 && name && phone) {
      const displayName = extractFirstName(email, name);
      const mockUser: User = { id: '1', email, name: displayName, phone, role: 'user' };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setCurrentView('dashboard');
      localStorage.setItem('currentView', 'dashboard');
      toast({ title: 'Registration successful', description: 'Account created!' });
      return true;
    }
    return false;
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
    };
    setReports(prev => [...prev, newReport]);
    toast({ title: 'Report submitted', description: `Reference ID: ${newReport.caseId}` });
    return newReport.id;
  };

  const updateReport = (reportId: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
    toast({ 
      title: 'Report updated', 
      description: `Report ${reportId.substring(0, 6)} has been updated.` 
    });
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast({
      title: 'Report deleted',
      description: `Report ${reportId.substring(0, 6)} has been deleted.`
    });
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Keep user and currentView in sync with localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);
  useEffect(() => {
    if (currentView) localStorage.setItem('currentView', currentView);
    else localStorage.removeItem('currentView');
  }, [currentView]);

  // Add effect to keep reports in sync with localStorage
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  return (
    <AppContext.Provider value={{
      user,
      reports,
      sidebarOpen,
      currentView,
      login,
      register,
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