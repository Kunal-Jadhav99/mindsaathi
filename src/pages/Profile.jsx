import { useApp } from '../context/AppContext';
import { User, Settings, Bell, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="card-elevated flex items-start gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 border-2"
               style={{ backgroundColor: `${user.avatarColor}20`, color: user.avatarColor, borderColor: `${user.avatarColor}40` }}>
            {user.pseudonym[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-100">{user.pseudonym}</h2>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-bg-950 px-3 py-1.5 rounded-lg border border-surface-subtle">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Current Streak</p>
                <p className="text-sm font-bold text-brand-400">🔥 {user.streak} days</p>
              </div>
              <div className="bg-bg-950 px-3 py-1.5 rounded-lg border border-surface-subtle">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Member Since</p>
                <p className="text-sm font-bold text-slate-300">{new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="card p-0 overflow-hidden">
          {[
            { icon: User, label: 'Personal Information', desc: 'Update your email or real name (hidden from peers)' },
            { icon: Bell, label: 'Notifications', desc: 'Manage check-in reminders and alerts' },
            { icon: Lock, label: 'Privacy & Security', desc: 'Data consent, DPDP compliance, and encryption info' },
            { icon: Settings, label: 'App Preferences', desc: 'Theme, language, and accessibility' },
          ].map((item, i) => (
            <button key={item.label} className={`w-full flex items-center gap-4 p-5 text-left hover:bg-bg-800 transition-colors ${i !== 0 ? 'border-t border-surface-subtle' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0">
                <item.icon size={18} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="card bg-red-400/5 border-red-400/20">
          <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-xs text-slate-500 mb-4">Actions here are permanent and cannot be undone.</p>
          <div className="flex gap-3">
            <button className="btn btn-danger btn-sm">Delete Account</button>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-ghost btn-sm border-surface-border text-slate-300 ml-auto">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
