import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase config is properly set
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.appId;

if (!isFirebaseConfigured) {
  console.warn('Firebase configuration is incomplete. Please set up your environment variables.');
  console.warn('Check env.example for required variables.');
}

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // Create mock auth and db for development
  auth = null;
  db = null;
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// User roles mapping
const USER_ROLES = {
  'admin@example.com': 'admin',
  'superadmin@example.com': 'super_admin',
  'country@example.com': 'country_admin',
  'case@example.com': 'case_worker',
  'field@example.com': 'field_officer',
  'governor_admin@example.com': 'governor_admin',
} as const;

// Default role for new users
const DEFAULT_ROLE = 'user';

// Convert Firebase user to our app user format
export const convertFirebaseUser = async (firebaseUser: FirebaseUser) => {
  if (!db) {
    // Fallback for when Firebase is not configured
    const email = firebaseUser.email?.toLowerCase();
    let role = DEFAULT_ROLE;
    if (email && USER_ROLES[email as keyof typeof USER_ROLES]) {
      role = USER_ROLES[email as keyof typeof USER_ROLES];
    }
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'User',
      role: role as any,
      photoURL: firebaseUser.photoURL,
    };
  }

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  let role = DEFAULT_ROLE;
  let region = undefined;
  let allowedCategories = undefined;

  if (userDoc.exists()) {
    const userData = userDoc.data();
    role = userData.role || DEFAULT_ROLE;
    region = userData.region;
    allowedCategories = userData.allowedCategories;
  } else {
    // Set role based on email for demo purposes
    const email = firebaseUser.email?.toLowerCase();
    if (email && USER_ROLES[email as keyof typeof USER_ROLES]) {
      role = USER_ROLES[email as keyof typeof USER_ROLES];
    }
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email: firebaseUser.email,
      name: firebaseUser.displayName || 'User',
      role,
      region,
      allowedCategories,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'User',
    role: role as any,
    region,
    allowedCategories,
    photoURL: firebaseUser.photoURL,
  };
};

// Authentication functions
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up your environment variables.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = await convertFirebaseUser(result.user);
    return user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

export const signOutUser = async () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up your environment variables.');
  }

  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!auth) {
    console.warn('Firebase auth not available, using mock auth state');
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await convertFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Export auth and db for other components
export { auth, db }; 