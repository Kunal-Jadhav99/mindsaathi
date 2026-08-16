import { createContext, useContext, useState } from 'react';
import { MOCK_USER, MOCK_CHECKINS, MOCK_CHAT } from '../data/mockData';
import { getTrendRisk } from '../utils/riskEngine';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'student' | 'admin' | 'counsellor'
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState(MOCK_CHECKINS);
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [sosOpen, setSosOpen] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  const currentRisk = getTrendRisk(checkIns);

  function login(r) {
    setRole(r);
    setIsLoggedIn(true);
    setUser({ ...MOCK_USER, role: r });
  }

  function logout() {
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setOnboarded(false);
  }

  function addCheckIn(c) {
    setCheckIns(prev => [c, ...prev]);
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
