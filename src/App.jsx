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

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useApp();
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
  const { isLoggedIn, role } = useApp();

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            !isLoggedIn
              ? <Landing />
              : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />
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
        <Route path="/admin"        element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute allowedRoles={['admin']}><AdminAlerts /></ProtectedRoute>} />
      </Routes>

      {/* SOS overlay — student only */}
      {isLoggedIn && role === 'student' && <SOSButton />}
      {isLoggedIn && role === 'student' && <SOSModal />}
    </Router>
  );
}
