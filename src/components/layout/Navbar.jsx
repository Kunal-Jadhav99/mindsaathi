import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, BookOpen, MessageSquare, Users, Heart, User, LogOut, BarChart3, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/checkin',   icon: ClipboardList,   label: 'Check-In'   },
  { to: '/journal',   icon: BookOpen,         label: 'Journal'    },
  { to: '/chat',      icon: MessageSquare,    label: 'Chat'       },
  { to: '/forum',     icon: Users,            label: 'Forum'      },
  { to: '/resources', icon: Heart,            label: 'Resources'  },
  { to: '/profile',   icon: User,             label: 'Profile'    },
];

const adminLinks = [
  { to: '/admin',        icon: BarChart3,   label: 'Analytics' },
  { to: '/admin/alerts', icon: ShieldAlert, label: 'Alerts'    },
];

export default function Navbar() {
  const { user, role, logout, currentRisk } = useApp();
  const navigate = useNavigate();
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-900 border-r border-surface-subtle flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <span className="text-base">🧠</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-none">MindSaathi</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{role === 'admin' ? 'Admin View' : 'Student Companion'}</p>
          </div>
        </div>
      </div>

      {/* User chip */}
      {user && (
        <div className="px-4 py-3 border-b border-surface-subtle">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-bg-800">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: `${user.avatarColor}25`, color: user.avatarColor }}>
              {user.pseudonym[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.pseudonym}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          {role === 'student' && currentRisk.trendFlag && (
            <div className={`mt-2 px-3 py-1.5 rounded-lg text-[10px] font-medium border ${
              currentRisk.finalRisk === 'high'
                ? 'bg-red-400/10 border-red-400/20 text-red-400'
                : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
            }`}>
              ⚠ {currentRisk.explanation}
            </div>
          )}
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                  : 'text-slate-400 hover:bg-bg-700 hover:text-slate-200'
              }`
            }>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Streak */}
      {role === 'student' && user && (
        <div className="px-4 py-3 border-t border-surface-subtle">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-bg-800">
            <span className="text-xs text-slate-400">Check-in streak</span>
            <span className="text-sm font-bold text-brand-400">🔥 {user.streak ?? 0}d</span>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-4 pb-5">
        <button onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-500
                     hover:text-red-400 hover:bg-red-400/10 transition-all duration-150">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
