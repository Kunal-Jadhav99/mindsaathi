import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, ClipboardList, BookOpen, MessageSquare,
  Users, Heart, User, LogOut, Menu, X, Bell, ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/checkin',   icon: ClipboardList,   label: 'Check-In'       },
  { to: '/journal',   icon: BookOpen,         label: 'Journal'        },
  { to: '/chat',      icon: MessageSquare,    label: 'Chat'           },
  { to: '/forum',     icon: Users,            label: 'Forum'          },
  { to: '/resources', icon: Heart,            label: 'Resources'      },
  { to: '/profile',   icon: User,             label: 'Profile'        },
];

const PAGE_META = {
  '/dashboard': { title: 'Dashboard',      subtitle: 'Your wellness overview' },
  '/checkin':   { title: 'Check-In',       subtitle: 'Take a moment to check in · ~3 minutes' },
  '/journal':   { title: 'Journal',        subtitle: 'Write your thoughts and reflect' },
  '/chat':      { title: 'Chat',           subtitle: 'Talk to MindSaathi AI for support and guidance' },
  '/forum':     { title: 'Forum',          subtitle: 'Connect with peers and share experiences' },
  '/resources': { title: 'Resources',      subtitle: 'Explore helpful articles, videos and tools' },
  '/profile':   { title: 'Profile',        subtitle: 'Manage your account and preferences' },
};

export default function StudentLayout({ children }) {
  const { user, logout, currentRisk } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = PAGE_META[location.pathname] ?? { title: 'MindSaathi', subtitle: '' };

  function handleLogout() {
    logout();
    navigate('/');
  }

  const avatarInitial = user?.pseudonym?.[0]?.toUpperCase() ?? 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--page-bg)' }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          background: '#FFFFFF',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          transform: mobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
        }}
        className={!mobileOpen ? 'max-md:-translate-x-full' : ''}
      >
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '15px', flexShrink: 0,
            }}>M</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.2 }}>MindSaathi</div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>Student Support</div>
            </div>
          </div>
        </div>

        {/* User card */}
        {user && (
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{
              background: 'var(--page-bg)', borderRadius: '10px',
              padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: '#EFF6FF', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '14px',
              }}>{avatarInitial}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.pseudonym}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                  {user.email}
                </div>
              </div>
              <span className="badge badge-blue" style={{ flexShrink: 0, fontSize: '10px' }}>Student</span>
            </div>

            {/* Risk flag */}
            {currentRisk?.trendFlag && (
              <div style={{
                marginTop: '8px', padding: '8px 10px', borderRadius: '8px',
                background: currentRisk.finalRisk === 'high' ? 'var(--danger-light)' : 'var(--warning-light)',
                border: `1px solid ${currentRisk.finalRisk === 'high' ? '#FECACA' : '#FDE68A'}`,
                fontSize: '11px', color: currentRisk.finalRisk === 'high' ? 'var(--danger)' : '#92400E',
                lineHeight: 1.4,
              }}>
                {currentRisk.explanation}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.12s ease',
              })}
              className={({ isActive }) => isActive ? '' : 'sidebar-link'}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Log Out */}
        <div style={{ padding: '10px 10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 12px', borderRadius: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 500, color: 'var(--danger)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
           className="max-md:ml-0">

        {/* Top Header */}
        <header style={{
          height: 'var(--header-h)', background: '#FFFFFF',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', position: 'sticky', top: 0, zIndex: 30,
        }}>
          {/* Left: hamburger + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="md:hidden btn-icon btn-ghost"
              onClick={() => setMobileOpen(v => !v)}
              style={{ border: '1px solid var(--border)' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {meta.title}
              </div>
              {meta.subtitle && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{meta.subtitle}</div>
              )}
            </div>
          </div>

          {/* Right: bell + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn-icon btn-ghost" style={{ border: '1px solid var(--border)', position: 'relative' }}>
              <Bell size={17} style={{ color: 'var(--text-muted)' }} />
              {currentRisk?.trendFlag && (
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--danger)', border: '2px solid white',
                }} />
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '12px',
              }}>{avatarInitial}</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.pseudonym}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      {/* Hover style injected globally */}
      <style>{`
        .sidebar-link:hover {
          background: #F1F5FF !important;
          color: var(--text-body) !important;
        }
      `}</style>
    </div>
  );
}
