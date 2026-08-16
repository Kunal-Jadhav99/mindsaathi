import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';

// Layout
import Navbar from './components/layout/Navbar.jsx';
import SOSButton from './components/layout/SOSButton.jsx';
import SOSModal from './components/modals/SOSModal.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CheckIn from './pages/CheckIn.jsx';
import Journal from './pages/Journal.jsx';
import Chat from './pages/Chat.jsx';
import Forum from './pages/Forum.jsx';
import Resources from './pages/Resources.jsx';
import Profile from './pages/Profile.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminAlerts from './pages/admin/AdminAlerts.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useApp();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { isLoggedIn, role } = useApp();

  return (
    <Router>
      <div className="app-shell">
        {isLoggedIn && <Navbar />}
        <main className={`main-content ${!isLoggedIn ? '!ml-0' : ''}`}>
          <Routes>
            <Route path="/" element={!isLoggedIn ? <Landing /> : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />} />
            
            {/* Student routes */}
            <Route path="/onboarding" element={<ProtectedRoute allowedRoles={['student']}><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
            <Route path="/checkin" element={<ProtectedRoute allowedRoles={['student']}><CheckIn /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute allowedRoles={['student']}><Journal /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute allowedRoles={['student']}><Chat /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute allowedRoles={['student']}><Forum /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute allowedRoles={['student']}><Resources /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/alerts" element={<ProtectedRoute allowedRoles={['admin']}><AdminAlerts /></ProtectedRoute>} />
          </Routes>
        </main>
        {isLoggedIn && role === 'student' && <SOSButton />}
        {isLoggedIn && role === 'student' && <SOSModal />}
      </div>
    </Router>
  );
}
