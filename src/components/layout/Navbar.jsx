import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BookOpen, MessageSquare, Users, Heart, User, LogOut, BarChart3, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin', icon: ClipboardList, label: 'Check-In' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/forum', icon: Users, label: 'Forum' },
  { to: '/resources', icon: Heart, label: 'Resources' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/alerts', icon: ShieldAlert, label: 'Alerts' },
];

export default function Navbar() {
  const { user, role, logout, currentRisk } = useApp();
  const navigate = useNavigate();
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-20 border-r border-surface-subtle bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(16,35,61,0.05)] md:w-72">
      <div className="border-b border-surface-subtle px-3 py-5 md:px-5">
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-glow-sm">
            M
          </div>
          <div className="hidden md:block">
            <p className="text-base font-bold text-slate-100 leading-none">MindSaathi</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {role === 'admin' ? 'Admin View' : 'Student Support'}
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className="border-b border-surface-subtle px-2 py-4 md:px-4">
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-surface-border bg-bg-800 px-2 py-2.5 md:justify-start md:px-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: `${user.avatarColor}22`, color: user.avatarColor }}
            >
              {user.pseudonym[0]}
            </div>
            <div className="hidden min-w-0 flex-1 md:block">
              <p className="truncate text-sm font-semibold text-slate-200">{user.pseudonym}</p>
              <p className="truncate text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>

          {role === 'student' && currentRisk.trendFlag && (
            <div
              className={`mt-3 hidden rounded-xl border px-3 py-2 text-[10px] font-medium md:block ${
                currentRisk.finalRisk === 'high'
                  ? 'border-red-400/20 bg-red-500/10 text-red-500'
                  : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-600'
              }`}
            >
              {currentRisk.explanation}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-4 md:px-3">
        <div className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium transition-all duration-150 md:justify-start md:px-3 ${
                  isActive
                    ? 'border border-brand-500/30 bg-brand-500/10 text-brand-600'
                    : 'text-slate-500 hover:bg-bg-800 hover:text-slate-100'
                }`
              }
            >
              <Icon size={16} />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {role === 'student' && user && (
        <div className="hidden border-t border-surface-subtle px-4 py-3 md:block">
          <div className="flex items-center justify-between rounded-2xl bg-bg-800 px-3 py-2.5">
            <span className="text-xs text-slate-500">Check-in streak</span>
            <span className="text-sm font-bold text-brand-600">🔥 {user.streak ?? 0}d</span>
          </div>
        </div>
      )}

      <div className="px-2 pb-5 pt-3 md:px-4">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition-all duration-150 hover:bg-red-500/10 hover:text-red-500 md:justify-start"
        >
          <LogOut size={15} />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
