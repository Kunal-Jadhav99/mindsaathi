import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  Clock3,
  HeartPulse,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, label: 'Private by design' },
  { icon: Users, label: 'Student-focused' },
  { icon: Clock3, label: 'Easy to access' },
  { icon: HeartPulse, label: 'Support when you need it' },
];

const featureItems = [
  {
    icon: ClipboardList,
    title: 'Understand yourself',
    copy: 'Use short wellbeing check-ins and reflection tools to notice patterns before they become overwhelming.',
  },
  {
    icon: BarChart3,
    title: 'Get guidance',
    copy: 'Review trend-aware insights and recommendations that suggest the next best step for your current wellbeing.',
  },
  {
    icon: BookOpenText,
    title: 'Find useful resources',
    copy: 'Access practical coping strategies, trusted helpline information, and self-help material designed for students.',
  },
  {
    icon: Activity,
    title: 'Track your journey',
    copy: 'Monitor mood, scores, and check-in history to build a clearer picture of how you are doing over time.',
  },
];

const resourceCategories = [
  'Stress',
  'Anxiety',
  'Academic pressure',
  'Sleep',
  'Relationships',
  'Emotional wellbeing',
  'Exam stress',
  'Seeking support',
];

function WellnessIllustration() {
  return (
    <svg viewBox="0 0 560 420" role="img" aria-label="Calm student wellbeing illustration" className="w-full h-auto">
      <defs>
        <linearGradient id="bloom" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#EAF3FF" />
          <stop offset="100%" stopColor="#D5E8FF" />
        </linearGradient>
      </defs>
      <circle cx="280" cy="200" r="150" fill="url(#bloom)" />
      <path d="M108 112 C140 76, 174 70, 200 94 C176 130, 150 136, 108 112Z" fill="#C9DDFD" />
      <path d="M378 108 C416 74, 454 76, 488 108 C454 144, 420 150, 378 108Z" fill="#C9DDFD" />
      <ellipse cx="280" cy="294" rx="110" ry="28" fill="#DCEAFF" />
      <path d="M206 156c0-38 28-68 66-68s66 30 66 68v86c0 42-30 76-66 76s-66-34-66-76v-86Z" fill="#2D6CDF" />
      <path d="M240 130c9-20 25-32 40-32 22 0 40 17 40 41 0 12-6 23-16 31 4 8 7 20 7 35v26h-33v-26c0-11-5-20-15-26 0 0-3 5-7 9-10 10-26 10-36 0-9-9-13-21-13-33 0-10 4-20 10-28 5-7 12-12 23-16Z" fill="#F4F8FF" />
      <circle cx="280" cy="146" r="56" fill="#F7C9A4" />
      <path d="M250 148c4-14 17-25 31-25 14 0 27 10 31 25" fill="none" stroke="#15314F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="261" cy="145" r="4" fill="#15314F" />
      <circle cx="298" cy="145" r="4" fill="#15314F" />
      <path d="M256 174c14 10 27 11 48 0" fill="none" stroke="#B35C68" strokeWidth="4" strokeLinecap="round" />
      <path d="M218 220c26-18 44-26 62-26s36 8 62 26l12 58c-24 25-55 38-74 38-22 0-51-15-76-40l14-56Z" fill="#1F4FB3" />
      <path d="M286 206c10 0 18 8 18 18v18h-36v-18c0-10 8-18 18-18Z" fill="#D9EAFF" opacity="0.75" />
      <path d="M195 230c-8 26-12 56-5 85" fill="none" stroke="#8FB7FF" strokeWidth="12" strokeLinecap="round" />
      <path d="M366 230c8 26 12 56 5 85" fill="none" stroke="#8FB7FF" strokeWidth="12" strokeLinecap="round" />
      <path d="M208 330c18-9 32-13 47-13 26 0 37 11 49 13" fill="none" stroke="#D5E8FF" strokeWidth="10" strokeLinecap="round" />
      <path d="M162 268c28-22 60-34 89-35" fill="none" stroke="#C6DDFE" strokeWidth="8" strokeLinecap="round" />
      <path d="M398 268c-28-22-60-34-89-35" fill="none" stroke="#C6DDFE" strokeWidth="8" strokeLinecap="round" />
      <path d="M226 84c9-22 22-32 38-38" fill="none" stroke="#7AB1FF" strokeWidth="5" strokeLinecap="round" />
      <path d="M338 84c-9-22-22-32-38-38" fill="none" stroke="#7AB1FF" strokeWidth="5" strokeLinecap="round" />
      <path d="M275 80c-10 13-17 22-20 36" fill="none" stroke="#9EC3FF" strokeWidth="5" strokeLinecap="round" />
      <path d="M286 80c10 13 17 22 20 36" fill="none" stroke="#9EC3FF" strokeWidth="5" strokeLinecap="round" />
      <path d="M138 286c-24 18-42 46-52 76" fill="none" stroke="#B9D9FF" strokeWidth="8" strokeLinecap="round" />
      <path d="M420 286c24 18 42 46 52 76" fill="none" stroke="#B9D9FF" strokeWidth="8" strokeLinecap="round" />
      <path d="M265 332c-10 16-14 27-14 42" fill="none" stroke="#7DB6FF" strokeWidth="7" strokeLinecap="round" />
      <path d="M296 332c10 16 14 27 14 42" fill="none" stroke="#7DB6FF" strokeWidth="7" strokeLinecap="round" />
      <circle cx="117" cy="120" r="14" fill="#E7F0FF" />
      <circle cx="444" cy="116" r="12" fill="#E7F0FF" />
      <circle cx="104" cy="334" r="10" fill="#E7F0FF" />
      <circle cx="455" cy="332" r="10" fill="#E7F0FF" />
    </svg>
  );
}

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
    setTimeout(() => {
      login(mode);
      setLoading(false);
      navigate(mode === 'admin' ? '/admin' : '/onboarding');
    }, 900);
  }

  function scrollToLogin() {
    document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="min-h-screen bg-bg-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 text-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-glow-sm">
              M
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">MindSaathi</div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex">
            <a href="#top" className="transition-colors hover:text-brand-600">Home</a>
            <a href="#features" className="transition-colors hover:text-brand-600">Features</a>
            <a href="#assessment" className="transition-colors hover:text-brand-600">Self-Assessment</a>
            <a href="#resources" className="transition-colors hover:text-brand-600">Resources</a>
            <a href="#about" className="transition-colors hover:text-brand-600">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToLogin}
              className="hidden rounded-full border border-surface-border px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-500 hover:text-brand-600 sm:inline-flex"
            >
              Login
            </button>
            <button
              type="button"
              onClick={scrollToLogin}
              className="btn btn-primary btn-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto max-w-[1280px] px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-8 lg:pt-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:gap-10">
            <div className="max-w-[560px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                <Sparkles size={12} />
                BUILT FOR STUDENT WELLBEING
              </div>

              <h1 className="mt-6 text-[3rem] font-bold leading-[1.02] tracking-[-0.065em] text-slate-100 sm:text-[3.5rem] lg:text-[3.9rem]">
                Your mental wellbeing,
                <span className="block text-brand-600">our priority.</span>
              </h1>

              <p className="mt-5 max-w-[520px] text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
                Understand how you are feeling, build healthier habits, and find the right support when you need it.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={scrollToLogin} className="btn btn-primary btn-lg">
                  Get Started
                  <ArrowRight size={16} />
                </button>
                <a href="#assessment" className="btn btn-ghost btn-lg">
                  Take Self-Assessment
                </a>
              </div>

              <div className="mt-8 flex flex-nowrap items-center gap-2 overflow-hidden text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {[
                  'Private by design',
                  'Student-focused',
                  'Easy to access',
                  'Support when needed',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-2">
                    {index > 0 && <span className="hidden text-slate-300 sm:inline">|</span>}
                    <span className={`whitespace-nowrap rounded-full border px-3 py-2 ${index === 0 ? 'border-brand-500/20 bg-brand-500/5 text-brand-600' : 'border-surface-border bg-white text-slate-500'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-[540px]">
                <WellnessIllustration />
              </div>
            </div>
          </div>
        </section>

        <section id="login-card" className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-surface-border bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">See MindSaathi in action</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-slate-100">A calmer student wellbeing experience.</h2>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.5rem] border border-surface-border bg-bg-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Today</p>
                    <p className="mt-1 text-xl font-bold text-slate-100">Wellbeing snapshot</p>
                  </div>
                  <div className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-600">Stable</div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Mood', '78%'],
                    ['Score', '11'],
                    ['Trend', 'Steady'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-surface-border bg-white p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
                      <p className="mt-2 text-xl font-bold text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-surface-border bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">Recent check-ins</span>
                    <TrendingUp size={16} className="text-brand-600" />
                  </div>
                  <div className="flex items-end gap-2">
                    {[52, 60, 48, 72, 68, 84].map((bar, index) => (
                      <div key={index} className="flex-1 rounded-t-xl bg-brand-500/15" style={{ height: `${bar}px` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-surface-border bg-white p-4 sm:p-5">
                <div className="mb-5">
                  <p className="text-2xl font-bold text-slate-100">Welcome back</p>
                  <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
                </div>

                <div className="mb-5 flex gap-1 rounded-xl bg-bg-800 p-1">
                  {['student', 'admin'].map((roleItem) => (
                    <button
                      key={roleItem}
                      type="button"
                      onClick={() => setMode(roleItem)}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                        mode === roleItem
                          ? 'bg-brand-500 text-white'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {roleItem === 'student' ? 'Student' : 'Admin'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      className="input"
                      placeholder={mode === 'admin' ? 'admin@college.edu' : 'you@college.edu'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      className="input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button id="login-submit" type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-white/70">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-surface-border bg-bg-800 px-4 py-3 text-sm font-medium text-slate-600">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Icon size={16} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">What MindSaathi does</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">A calmer way to understand student wellbeing.</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="group rounded-[1.75rem] border border-surface-border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_18px_40px_rgba(45,108,223,0.08)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-100">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#edf4ff] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Product experience</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">A simpler way to check in with yourself.</h2>
            </div>

            <div className="mt-10 rounded-[2rem] border border-surface-border bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] lg:p-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-surface-border bg-bg-800 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-100">Student overview</h3>
                    </div>
                    <div className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600">Low risk</div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Latest PHQ-9', '11 / 27'],
                      ['Latest GAD-7', '8 / 21'],
                      ['Risk trend', 'Stable'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-surface-border bg-white p-3">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
                        <p className="mt-2 text-xl font-bold text-slate-100">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-surface-border bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-200">Score trend</span>
                      <span className="text-xs text-slate-500">Last 5 check-ins</span>
                    </div>
                    <div className="flex h-24 items-end gap-2">
                      {[20, 30, 42, 38, 54, 61].map((value, index) => (
                        <div key={index} className="flex-1 rounded-t-xl bg-brand-500/90" style={{ height: `${value}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-surface-border bg-white p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Suggested next step</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-100">Daily check-in</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">A few guided questions can help you understand what is taking a greater toll on your energy and focus.</p>
                    <button type="button" onClick={scrollToLogin} className="mt-4 btn btn-primary btn-sm">
                      Start now
                    </button>
                  </div>

                  <div className="rounded-[1.5rem] border border-surface-border bg-white p-4">
                    <div className="flex items-center gap-2">
                      <MessageSquareText size={18} className="text-brand-600" />
                      <p className="text-sm font-semibold text-slate-200">Need support?</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">Use the private support flow to talk through stress, sleep disruption, and academic pressure with context-aware prompts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="assessment" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Self-assessment</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Reflect before the pressure builds.</h2>
              <p className="mt-5 text-base leading-8 text-slate-500">
                MindSaathi helps students spot patterns in their stress, anxiety, and mood through structured wellbeing check-ins rather than vague self-judgment.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {[
                  'Short, structured reflection prompts',
                  'PHQ-9 and GAD-7 based wellbeing check-ins',
                  'Clear guidance on when to seek extra support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-surface-border bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Wellbeing check</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-100">Daily reflection</h3>
                </div>
                <div className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-600">Progress 68%</div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'Little interest or pleasure in doing things',
                  'Feeling tired or having little energy',
                  'Trouble concentrating on things',
                  'Feeling anxious or on edge',
                ].map((question, index) => (
                  <div key={question} className="rounded-2xl border border-surface-border bg-bg-800 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Question {index + 1}</span>
                      <span>2 / 4</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="bg-[#edf4ff] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Resources</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Useful support, curated for student life.</h2>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {resourceCategories.map((category) => (
                <span key={category} className="rounded-full border border-surface-border bg-white px-3 py-2 text-xs font-medium text-slate-600">
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: 'Stress and academic pressure',
                  text: 'Guided grounding exercises, exam preparation routines, and practical ways to reset during busy weeks.',
                  icon: TrendingUp,
                },
                {
                  title: 'Sleep and emotional wellbeing',
                  text: 'Simple practices to improve rest, calm racing thoughts, and build steadier rhythms across the semester.',
                  icon: Clock3,
                },
                {
                  title: 'Support when you need it',
                  text: 'Trusted helplines and safer next steps for students who need immediate or more dedicated support.',
                  icon: PhoneCall,
                },
              ].map(({ title, text, icon: Icon }) => (
                <article key={title} className="rounded-[1.75rem] border border-surface-border bg-white p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-100">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[2rem] border border-surface-border bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="rounded-[1.5rem] bg-brand-500 p-6 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <PhoneCall size={18} />
              </div>
              <h3 className="mt-5 text-2xl font-bold">Support matters, and so does escalation.</h3>
              <p className="mt-3 text-sm leading-7 text-blue-100">
                MindSaathi is designed to support students. It does not replace emergency services or professional care when immediate help is needed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Private support pathways for students who need extra attention',
                'Crisis helpline information built into the resources experience',
                'Counsellor-facing alerts and escalation workflow for staff',
                'A clear boundary: support is helpful, not a replacement for qualified care',
              ].map((point) => (
                <div key={point} className="rounded-[1.5rem] border border-surface-border bg-bg-800 p-4">
                  <CheckCircle2 size={18} className="text-brand-600" />
                  <p className="mt-3 text-sm leading-7 text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">About MindSaathi</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Built around the realities of student life.</h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-surface-border bg-bg-800 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">The problem</p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <li>Academic pressure and constant comparison can make students dismiss their own wellbeing.</li>
                  <li>Isolation makes it harder to notice early warning signs before stress becomes unmanageable.</li>
                  <li>Students often do not know where to turn for trusted support or practical guidance.</li>
                </ul>
              </div>

              <div className="rounded-[2rem] border border-surface-border bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">The solution</p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <li>MindSaathi helps students pause, reflect, and understand their mood and stress patterns.</li>
                  <li>It turns that information into actionable recommendations and relevant resources.</li>
                  <li>It creates a safer route to support without making students feel alone or judged.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">M</div>
              <div className="text-lg font-bold text-slate-100">MindSaathi</div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
              A student-focused mental wellbeing companion designed to help people reflect, seek support, and build healthier routines.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><a href="#features" className="hover:text-brand-600">Features</a></li>
              <li><a href="#assessment" className="hover:text-brand-600">Self-assessment</a></li>
              <li><a href="#resources" className="hover:text-brand-600">Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-brand-600">About</a></li>
              <li><a href="#login-card" className="hover:text-brand-600">Login</a></li>
              <li><a href="#resources" className="hover:text-brand-600">Helplines</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface-border py-4 text-center text-xs text-slate-500">
          © 2026 MindSaathi. Built for student wellbeing.
        </div>
      </footer>
    </div>
  );
}
