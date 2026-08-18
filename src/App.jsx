import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import SOSButton from './components/layout/SOSButton';
import SOSModal from './components/modals/SOSModal';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Journal from './pages/Journal';
import Chat from './pages/Chat';
import Forum from './pages/Forum';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAlerts from './pages/admin/AdminAlerts';

/** Full-screen spinner shown while Firebase auth + profile resolve */
function AppLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--page-bg)',
      flexDirection: 'column', gap: '16px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid var(--primary-light)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
        Loading MindSaathi…
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role, loading } = useApp();
  // Wait for auth + profile to resolve before making routing decisions
  if (loading) return <AppLoader />;
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function StudentRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentLayout>{children}</StudentLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const { isLoggedIn, role, loading } = useApp();

  // Block rendering until auth state + role are fully resolved
  if (loading) return <AppLoader />;

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            !isLoggedIn
              ? <Landing />
              : <Navigate to={(role === 'admin' || role === 'counsellor') ? '/admin' : '/dashboard'} replace />
          }
        />

        {/* Student routes — wrapped in StudentLayout */}
        <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['student']}><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<StudentRoute><Dashboard /></StudentRoute>} />
        <Route path="/checkin"    element={<StudentRoute><CheckIn /></StudentRoute>} />
        <Route path="/journal"    element={<StudentRoute><Journal /></StudentRoute>} />
        <Route path="/chat"       element={<StudentRoute><Chat /></StudentRoute>} />
        <Route path="/forum"      element={<StudentRoute><Forum /></StudentRoute>} />
        <Route path="/resources"  element={<StudentRoute><Resources /></StudentRoute>} />
        <Route path="/profile"    element={<StudentRoute><Profile /></StudentRoute>} />

        {/* Admin routes */}
        <Route path="/admin"        element={<ProtectedRoute allowedRoles={['admin', 'counsellor']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute allowedRoles={['admin', 'counsellor']}><AdminAlerts /></ProtectedRoute>} />
      </Routes>

      {/* SOS overlay — student only */}
      {isLoggedIn && role === 'student' && <SOSButton />}
      {isLoggedIn && role === 'student' && <SOSModal />}
    </Router>
  );
}
