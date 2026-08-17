import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  HeartPulse,
  Lock,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const featureItems = [
  { icon: ClipboardList, title: "Understand yourself", copy: "Use short wellbeing check-ins and reflection tools to notice patterns before they become overwhelming." },
  { icon: BarChart3, title: "Get guidance", copy: "Review trend-aware insights and recommendations that suggest the next best step for your current wellbeing." },
  { icon: BookOpenText, title: "Find useful resources", copy: "Access practical coping strategies, trusted helpline information, and self-help material designed for students." },
  { icon: Activity, title: "Track your journey", copy: "Monitor mood, scores, and check-in history to build a clearer picture of how you are doing over time." },
];

const resourceCategories = ["Stress","Anxiety","Academic pressure","Sleep","Relationships","Emotional wellbeing","Exam stress","Seeking support"];

function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".section-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function WellnessIllustration() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "100%", maxWidth: "500px", margin: "0 auto", mixBlendMode: "multiply" }}
    >
      <div style={{ position: "absolute", width: "88%", paddingBottom: "88%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #deeeff 0%, #eaf4ff 60%, #f0f7ff 100%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0 }} />
      <svg viewBox="0 0 80 80" style={{ position: "absolute", top: "4%", left: "6%", width: "15%", opacity: 0.55, zIndex: 1 }} aria-hidden="true">
        <ellipse cx="40" cy="40" rx="22" ry="36" fill="#9EC3FF" transform="rotate(-35 40 40)" />
        <line x1="40" y1="15" x2="40" y2="65" stroke="#7DB6FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 80 80" style={{ position: "absolute", top: "2%", right: "5%", width: "13%", opacity: 0.45, zIndex: 1 }} aria-hidden="true">
        <ellipse cx="40" cy="40" rx="18" ry="30" fill="#C9DDFD" transform="rotate(30 40 40)" />
        <line x1="40" y1="18" x2="40" y2="62" stroke="#9EC3FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 80 80" style={{ position: "absolute", bottom: "8%", left: "3%", width: "12%", opacity: 0.4, zIndex: 1 }} aria-hidden="true">
        <ellipse cx="40" cy="40" rx="16" ry="28" fill="#B9D4FF" transform="rotate(20 40 40)" />
      </svg>
      <svg viewBox="0 0 80 80" style={{ position: "absolute", bottom: "10%", right: "4%", width: "11%", opacity: 0.35, zIndex: 1 }} aria-hidden="true">
        <ellipse cx="40" cy="40" rx="14" ry="24" fill="#C9DDFD" transform="rotate(-20 40 40)" />
      </svg>
      <div style={{ position: "absolute", top: "18%", right: "11%", width: "28px", height: "28px", borderRadius: "50%", background: "#DCEAFF", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "22%", left: "10%", width: "18px", height: "18px", borderRadius: "50%", background: "#C9DDFD", zIndex: 1 }} />
      <img
        src="/hero-illustration.png"
        alt="Young student experiencing calm and emotional wellbeing"
        style={{ position: "relative", zIndex: 2, width: "78%", height: "auto", display: "block", margin: "0 auto", userSelect: "none", pointerEvents: "none", mixBlendMode: "multiply" }}
        draggable={false}
      />
    </div>
  );
}

/* Admin login lives in the footer — collapsible with smooth slide-down */
function AdminFooterLogin() {
  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      try {
        await loginUser(email, password, "counsellor");
      } catch (err) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
          await registerUser(email, password, "counsellor");
        } else {
          throw err;
        }
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to sign in as counsellor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Portal</h3>
      <p className="mt-2 text-xs text-slate-600 leading-5">Staff and counsellor access only.</p>
      <button
        type="button"
        id="admin-portal-toggle"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-500 transition-colors"
      >
        <Lock size={11} />
        Admin sign in
        <ChevronDown
          size={13}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
        />
      </button>
      <div className={`admin-panel-enter${open ? " admin-panel-open" : ""}`}>
        <form onSubmit={handleAdminLogin} className="mt-4 space-y-3 rounded-2xl border border-surface-border bg-bg-800 p-4">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Admin email</label>
            <input id="admin-email" type="email" className="input" placeholder="admin@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Password</label>
            <input id="admin-password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.8125rem" }}
          >
            {loading ? (
              <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</>
            ) : "Sign in as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Landing() {
  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useScrollReveal();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      try {
        await loginUser(email, password, "student");
      } catch (err) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
          // Auto register on first login
          await registerUser(email, password, "student");
        } else {
          throw err;
        }
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in. Check email & password.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToLogin() {
    document.getElementById("login-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen bg-bg-950 text-slate-100">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 text-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-glow-sm">M</div>
            <div className="text-base font-bold tracking-tight">MindSaathi</div>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex">
            <a href="#top" className="transition-colors hover:text-brand-600">Home</a>
            <a href="#features" className="transition-colors hover:text-brand-600">Features</a>
            <a href="#assessment" className="transition-colors hover:text-brand-600">Self-Assessment</a>
            <a href="#resources" className="transition-colors hover:text-brand-600">Resources</a>
            <a href="#about" className="transition-colors hover:text-brand-600">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={scrollToLogin} className="hidden rounded-full border border-surface-border px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-500 hover:text-brand-600 sm:inline-flex">
              Login
            </button>
            <button type="button" onClick={scrollToLogin} className="btn btn-primary btn-sm">Get Started</button>
          </div>
        </div>
      </header>

      <main id="top">

        {/* ── Hero ── */}
        <section className="mx-auto max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div style={{ maxWidth: "560px" }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                <Sparkles size={12} />Built for Student Wellbeing
              </div>
              <h1 className="mt-5 font-bold tracking-[-0.05em] text-slate-100" style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", lineHeight: "1.08" }}>
                Your mental wellbeing,<span className="block text-brand-600">our priority.</span>
              </h1>
              <p className="mt-4 text-[17px] leading-[1.65] text-slate-500" style={{ maxWidth: "480px" }}>
                Understand how you are feeling, build healthier habits, and find the right support when you need it.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={scrollToLogin} className="btn btn-primary" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", paddingLeft: "1.75rem", paddingRight: "1.75rem", fontSize: "0.9375rem" }}>
                  Get Started<ArrowRight size={15} />
                </button>
                <a href="#assessment" className="btn btn-ghost" style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", fontSize: "0.9375rem", border: "1px solid #D6E3F7", color: "#466387", backgroundColor: "white" }}>
                  Take Self-Assessment
                </a>
              </div>
              <div className="mt-6 flex flex-nowrap items-center" style={{ fontSize: "11px", color: "#667D9B", letterSpacing: "0.04em", fontWeight: 500 }}>
                {[
                  { icon: ShieldCheck, label: "Private by design" },
                  { icon: Users, label: "Student-focused" },
                  { icon: Clock3, label: "Easy to access" },
                  { icon: HeartPulse, label: "Support when needed" },
                ].map(({ icon: Icon, label }, index) => (
                  <span key={label} className="flex items-center">
                    {index > 0 && <span style={{ margin: "0 10px", color: "#D6E3F7", fontSize: "14px" }}>|</span>}
                    <span className="flex items-center gap-1.5">
                      <Icon size={12} style={{ color: "#2D6CDF", flexShrink: 0 }} />
                      <span>{label}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center"><WellnessIllustration /></div>
          </div>
        </section>

        {/* ── Student Login Card (original UI preserved) ── */}
        <section id="login-card" className="section-reveal mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-surface-border bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <p className="reveal-child-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">See MindSaathi in action</p>
              <h2 className="reveal-child-2 mt-2 text-2xl font-bold tracking-[-0.05em] text-slate-100">A calmer student wellbeing experience.</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="reveal-child-3 rounded-[1.5rem] border border-surface-border bg-bg-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Today</p>
                    <p className="mt-1 text-xl font-bold text-slate-100">Wellbeing snapshot</p>
                  </div>
                  <div className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-600">Stable</div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[["Mood","78%"],["Score","11"],["Trend","Steady"]].map(([label,value]) => (
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
                    {[52,60,48,72,68,84].map((bar,i) => (
                      <div key={i} className="flex-1 rounded-t-xl bg-brand-500/15" style={{ height: `${bar}px` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="reveal-child-4 rounded-[1.5rem] border border-surface-border bg-white p-4 sm:p-5">
                <div className="mb-5">
                  <p className="text-2xl font-bold text-slate-100">Welcome back</p>
                  <p className="mt-1 text-sm text-slate-500">Sign in to continue your journey</p>
                </div>
                {error && <p className="mb-3 text-xs text-red-500 font-medium">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Email address</label>
                    <input id="login-email" type="email" className="input" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Password</label>
                    <input id="login-password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button id="login-submit" type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                    {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</>) : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <section className="section-reveal border-y border-surface-border bg-white/70">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { icon: ShieldCheck, label: "Private by design" },
              { icon: Users, label: "Student-focused" },
              { icon: Clock3, label: "Easy to access" },
              { icon: HeartPulse, label: "Support when you need it" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className={`reveal-child-${i+1} flex items-center gap-3 rounded-2xl border border-surface-border bg-bg-800 px-4 py-3 text-sm font-medium text-slate-600`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600"><Icon size={16} /></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="section-reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="reveal-child-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">What MindSaathi does</p>
            <h2 className="reveal-child-2 mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">A calmer way to understand student wellbeing.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map(({ icon: Icon, title, copy }, i) => (
              <article key={title} className={`reveal-child-${i+1} group rounded-[1.75rem] border border-surface-border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_18px_40px_rgba(45,108,223,0.08)]`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600"><Icon size={18} /></div>
                <h3 className="mt-5 text-xl font-bold text-slate-100">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Product experience ── */}
        <section className="section-reveal bg-[#edf4ff] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="reveal-child-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Product experience</p>
              <h2 className="reveal-child-2 mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">A simpler way to check in with yourself.</h2>
            </div>
            <div className="reveal-child-3 mt-10 rounded-[2rem] border border-surface-border bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] lg:p-6">
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
                    {[["Latest PHQ-9","11 / 27"],["Latest GAD-7","8 / 21"],["Risk trend","Stable"]].map(([label,value]) => (
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
                      {[20,30,42,38,54,61].map((value,i) => (
                        <div key={i} className="flex-1 rounded-t-xl bg-brand-500/90" style={{ height: `${value}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-surface-border bg-white p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Suggested next step</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-100">Daily check-in</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">A few guided questions can help you understand what is taking a greater toll on your energy and focus.</p>
                    <button type="button" onClick={scrollToLogin} className="mt-4 btn btn-primary btn-sm">Start now</button>
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

        {/* ── Self-Assessment ── */}
        <section id="assessment" className="section-reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="reveal-child-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Self-assessment</p>
              <h2 className="reveal-child-2 mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Reflect before the pressure builds.</h2>
              <p className="reveal-child-3 mt-5 text-base leading-8 text-slate-500">MindSaathi helps students spot patterns in their stress, anxiety, and mood through structured wellbeing check-ins rather than vague self-judgment.</p>
              <ul className="reveal-child-4 mt-6 space-y-3 text-sm text-slate-600">
                {["Short, structured reflection prompts","PHQ-9 and GAD-7 based wellbeing check-ins","Clear guidance on when to seek extra support"].map((item) => (
                  <li key={item} className="flex items-start gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" /><span>{item}</span></li>
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
                {["Little interest or pleasure in doing things","Feeling tired or having little energy","Trouble concentrating on things","Feeling anxious or on edge"].map((question, index) => (
                  <div key={question} className="rounded-2xl border border-surface-border bg-bg-800 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500"><span>Question {index+1}</span><span>2 / 4</span></div>
                    <p className="text-sm font-medium text-slate-200">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Resources ── */}
        <section id="resources" className="section-reveal bg-[#edf4ff] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="reveal-child-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Resources</p>
              <h2 className="reveal-child-2 mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Useful support, curated for student life.</h2>
            </div>
            <div className="reveal-child-3 mt-10 flex flex-wrap gap-2">
              {resourceCategories.map((category) => (
                <span key={category} className="rounded-full border border-surface-border bg-white px-3 py-2 text-xs font-medium text-slate-600">{category}</span>
              ))}
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { title: "Stress and academic pressure", text: "Guided grounding exercises, exam preparation routines, and practical ways to reset during busy weeks.", icon: TrendingUp },
                { title: "Sleep and emotional wellbeing", text: "Simple practices to improve rest, calm racing thoughts, and build steadier rhythms across the semester.", icon: Clock3 },
                { title: "Support when you need it", text: "Trusted helplines and safer next steps for students who need immediate or more dedicated support.", icon: PhoneCall },
              ].map(({ title, text, icon: Icon }, i) => (
                <article key={title} className={`reveal-child-${i+2} rounded-[1.75rem] border border-surface-border bg-white p-5`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600"><Icon size={18} /></div>
                  <h3 className="mt-4 text-xl font-bold text-slate-100">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Support escalation ── */}
        <section className="section-reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[2rem] border border-surface-border bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="reveal-child-1 rounded-[1.5rem] bg-brand-500 p-6 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><PhoneCall size={18} /></div>
              <h3 className="mt-5 text-2xl font-bold">Support matters, and so does escalation.</h3>
              <p className="mt-3 text-sm leading-7 text-blue-100">MindSaathi is designed to support students. It does not replace emergency services or professional care when immediate help is needed.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Private support pathways for students who need extra attention",
                "Crisis helpline information built into the resources experience",
                "Counsellor-facing alerts and escalation workflow for staff",
                "A clear boundary: support is helpful, not a replacement for qualified care",
              ].map((point, i) => (
                <div key={point} className={`reveal-child-${i+1} rounded-[1.5rem] border border-surface-border bg-bg-800 p-4`}>
                  <CheckCircle2 size={18} className="text-brand-600" />
                  <p className="mt-3 text-sm leading-7 text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="section-reveal bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="reveal-child-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">About MindSaathi</p>
              <h2 className="reveal-child-2 mt-4 text-3xl font-bold tracking-[-0.05em] text-slate-100">Built around the realities of student life.</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="reveal-child-3 rounded-[2rem] border border-surface-border bg-bg-800 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">The problem</p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <li>Academic pressure and constant comparison can make students dismiss their own wellbeing.</li>
                  <li>Isolation makes it harder to notice early warning signs before stress becomes unmanageable.</li>
                  <li>Students often do not know where to turn for trusted support or practical guidance.</li>
                </ul>
              </div>
              <div className="reveal-child-4 rounded-[2rem] border border-surface-border bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
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

      {/* ── Footer — admin login lives here ── */}
      <footer className="border-t border-surface-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">M</div>
              <div className="text-lg font-bold text-slate-100">MindSaathi</div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">A student-focused mental wellbeing companion designed to help people reflect, seek support, and build healthier routines.</p>
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
              <li><a href="#login-card" className="hover:text-brand-600">Student login</a></li>
              <li><a href="#resources" className="hover:text-brand-600">Helplines</a></li>
            </ul>
          </div>
          <AdminFooterLogin />
        </div>
        <div className="border-t border-surface-border py-4 text-center text-xs text-slate-500">
          © 2026 MindSaathi. Built for student wellbeing.
        </div>
      </footer>
    </div>
  );
}
