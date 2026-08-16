import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Layout
import Navbar from './components/layout/Navbar';
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

export default function App() {
  const { isLoggedIn, role } = useApp();

  return (
    <Router>
      <div className="min-h-screen bg-bg-950 text-slate-100">
        {isLoggedIn && <Navbar />}
        <main className={`flex-1 w-full transition-all duration-300 ${isLoggedIn ? 'md:pl-72' : ''}`}>
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
