import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  console.error('❌ Firebase configuration is incomplete!');
  console.error('Missing environment variables:');
  console.error('VITE_FIREBASE_API_KEY:', !!firebaseConfig.apiKey);
  console.error('VITE_FIREBASE_AUTH_DOMAIN:', !!firebaseConfig.authDomain);
  console.error('VITE_FIREBASE_PROJECT_ID:', !!firebaseConfig.projectId);
  console.error('VITE_FIREBASE_APP_ID:', !!firebaseConfig.appId);
  console.error('Please check env.example for required variables and create a .env file.');
} else {
  console.log('✅ Firebase configuration is complete');
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

// Cloud-based user management functions
export const createUserWithEmail = async (email: string, password: string, name: string, phone: string) => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up your environment variables.');
  }

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: name
    });

    // Save additional user data to Firestore
    const userData = {
      email: email,
      name: name,
      phone: phone,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    if (db) {
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    }

    return {
      id: firebaseUser.uid,
      email: email,
      name: name,
      phone: phone,
      role: 'user' as const,
    };
  } catch (error: any) {
    console.error('User creation error:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up your environment variables.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update last login time
    if (db) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: new Date().toISOString(),
      }, { merge: true });
    }

    return await convertFirebaseUser(firebaseUser);
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up your environment variables.');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Check if user exists in cloud
export const checkUserExists = async (email: string) => {
  if (!db) {
    return false;
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Export auth and db for other components
export { auth, db }; 