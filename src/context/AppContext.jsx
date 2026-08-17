import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER, MOCK_CHECKINS, MOCK_CHAT } from '../data/mockData';
import { getTrendRisk } from '../utils/riskEngine';
import { getUserProfile, getCheckins, submitCheckin as apiSubmitCheckin } from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'student' | 'admin' | 'counsellor'
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState(MOCK_CHECKINS);
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [sosOpen, setSosOpen] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentRisk = getTrendRisk(checkIns);

  // Sync profile and check-ins with backend on login
  useEffect(() => {
    if (isLoggedIn) {
      loadBackendData();
    }
  }, [isLoggedIn]);

  async function loadBackendData() {
    setLoading(true);
    try {
      // 1. Fetch User Profile
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
        setOnboarded(profile.onboarded || false);
      }
    } catch (err) {
      console.warn('Backend server not connected or unreachable. Falling back to local state for user profile.');
    }

    try {
      // 2. Fetch Check-ins History
      const backendCheckins = await getCheckins();
      if (Array.isArray(backendCheckins) && backendCheckins.length > 0) {
        setCheckIns(backendCheckins);
      }
    } catch (err) {
      console.warn('Backend server not connected or unreachable. Falling back to local state for check-ins.');
    } finally {
      setLoading(false);
    }
  }

  async function login(r) {
    setRole(r);
    setIsLoggedIn(true);
    setUser({ ...MOCK_USER, role: r });
  }

  function logout() {
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setOnboarded(false);
    localStorage.removeItem('token');
  }

  async function addCheckIn(c, phq9Array = [], gad7Array = []) {
    // 1. Update UI optimistically
    setCheckIns(prev => [c, ...prev]);

    // 2. Sync to Backend API if answers are provided
    if (phq9Array.length === 9 && gad7Array.length === 7) {
      try {
        const result = await apiSubmitCheckin(phq9Array, gad7Array, c.mood, c.journalSnippet);
        if (result && result.id) {
          // Replace optimistic item with server result
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
      isLoggedIn, role, user, login, logout,
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
