import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Brain, Shield, Users, TrendingUp } from 'lucide-react';

export default function Landing() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('student');

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    // Mock Firebase Auth — replace with signInWithEmailAndPassword
    setTimeout(() => {
      login(mode);
      setLoading(false);
      navigate(mode === 'admin' ? '/admin' : '/onboarding');
    }, 900);
  }

  return (
    <div className="min-h-screen bg-bg-950 flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 bg-glow-indigo relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#7c6af7 1px,transparent 1px),linear-gradient(90deg,#7c6af7 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xl">🧠</div>
          <span className="text-xl font-bold text-slate-100">MindSaathi</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-extrabold text-slate-100 leading-tight tracking-tight">
            Your campus,<br />
            <span className="text-brand-400 text-glow">your support system.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A private mental wellness companion built for students. Track your wellbeing, talk to peers, and get help when you need it — without judgment.
          </p>
          <div className="space-y-3 pt-2">
            {[
              [TrendingUp, 'History-aware triage — not just a snapshot'],
              [Shield,     'Clinically grounded PHQ-9 / GAD-7 scoring'],
              [Users,      'Pseudonymous peer forum'],
              [Brain,      'AI chatbot that routes to real help'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-brand-400" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">
          SIH 2025 · Data encrypted · Role-based access · DPDP Act 2023 aligned
        </p>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-2xl">🧠</span>
            <span className="text-lg font-bold text-slate-100">MindSaathi</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Welcome back</h2>
          <p className="text-sm text-slate-400 mt-1 mb-7">Sign in to continue</p>

          {/* Role toggle */}
          <div className="flex gap-1 p-1 bg-bg-800 rounded-xl mb-6 border border-surface-border">
            {['student', 'admin'].map(r => (
              <button key={r} onClick={() => setMode(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === r ? 'bg-brand-500/20 text-brand-400 border border-brand-500/35' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {r === 'student' ? '🎓 Student' : '🏫 Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
              <input id="login-email" type="email" className="input"
                placeholder={mode === 'admin' ? 'admin@college.edu' : 'you@college.edu'}
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input id="login-password" type="password" className="input"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button id="login-submit" type="submit" disabled={loading}
              className="btn btn-primary btn-lg w-full justify-center mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
                : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Prototype: any email/password works. Firebase Auth integrated in production.
          </p>
          <div className="mt-6 pt-5 border-t border-surface-subtle text-center">
            <p className="text-xs text-slate-500">🔒 Data encrypted. Only you and your counsellor can access your records.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
