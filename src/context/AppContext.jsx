import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getTrendRisk } from '../utils/riskEngine';
import { getUserProfile, getCheckins, submitCheckin as apiSubmitCheckin, setUserRole as apiSetUserRole } from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'student' | 'admin' | 'counsellor'
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState([]); // Start empty (no hardcoded mock state)
  const [chatMessages, setChatMessages] = useState([]);
  const [sosOpen, setSosOpen] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentRisk = getTrendRisk(checkIns);

  // Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          setIsLoggedIn(true);
          await loadBackendData();
        } catch (err) {
          console.error('Error restoring session:', err);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
        setCheckIns([]);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function loadBackendData() {
    try {
      // 1. Fetch User Profile from Backend
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
        setRole(profile.role || 'student');
        setOnboarded(profile.onboarded || false);
      }
    } catch (err) {
      console.warn('Could not fetch user profile from backend server:', err.message);
    }

    try {
      // 2. Fetch Check-ins History from Backend
      const backendCheckins = await getCheckins();
      if (Array.isArray(backendCheckins)) {
        setCheckIns(backendCheckins);
      }
    } catch (err) {
      console.warn('Could not fetch check-ins from backend server:', err.message);
    }
  }

  // Real Login via Firebase Auth (or fallback if Firebase not configured)
  async function loginUser(email, password, requestedRole = 'student') {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      // Sync role if requested
      if (requestedRole) {
        try {
          await apiSetUserRole(requestedRole);
        } catch (e) {
          console.warn('Role sync warning:', e.message);
        }
      }

      await loadBackendData();
      return { success: true };
    } catch (err) {
      console.error('Firebase Auth error:', err.code, err.message);
      // Fallback for development if Firebase Auth is not active in Firebase Console
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        throw new Error(err.message || 'Invalid login credentials.');
      }
      throw err;
    }
  }

  // Real Register via Firebase Auth
  async function registerUser(email, password, role = 'student') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      // Sync user profile & role on backend
      try {
        await apiSetUserRole(role);
      } catch (e) {
        console.warn('Could not set initial role:', e.message);
      }

      await loadBackendData();
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.message);
      throw err;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Signout error:', e);
    }
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setCheckIns([]);
    setOnboarded(false);
    localStorage.removeItem('token');
  }

  async function addCheckIn(c, phq9Array = [], gad7Array = []) {
    // 1. Optimistic update
    setCheckIns(prev => [c, ...prev]);

    // 2. Submit to Backend API
    if (phq9Array.length === 9 && gad7Array.length === 7) {
      try {
        const result = await apiSubmitCheckin(phq9Array, gad7Array, c.mood, c.journalSnippet);
        if (result && result.id) {
          setCheckIns(prev => [result, ...prev.filter(item => item.id !== c.id)]);
          if (result.streak && user) {
            setUser(prev => ({ ...prev, streak: result.streak }));
          }
        }
      } catch (err) {
        console.error('Failed to submit check-in to backend:', err.message);
      }
    }
  }

  function addChatMessage(m) {
    setChatMessages(prev => [...prev, m]);
  }

  return (
    <AppContext.Provider value={{
      isLoggedIn, role, user, loginUser, registerUser, logout,
      checkIns, addCheckIn, currentRisk,
      chatMessages, addChatMessage,
      sosOpen,
      openSOS: () => setSosOpen(true),
      closeSOS: () => setSosOpen(false),
      onboarded,
      completeOnboarding: () => setOnboarded(true),
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
