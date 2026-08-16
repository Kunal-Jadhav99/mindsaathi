import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';

const PSEUDONYMS = ['QuietOwl42', 'SilentMountain7', 'DriftingCloud11', 'WanderingReed23', 'CalmRiver55', 'BrightStar09', 'StillLake88', 'GentleWind33'];

const steps = [
  {
    title: 'Your privacy, guaranteed',
    body: 'MindSaathi uses your real email only for login and history tracking. On the peer forum and in all public spaces, you will appear only as your pseudonym — never your real name.',
    icon: '🔒',
  },
  {
    title: 'Meet your pseudonym',
    body: 'This is how other students will see you in the forum. It stays consistent — peers can recognise you across threads without knowing who you are. Only you and your counsellor know your real identity.',
    icon: '🎭',
  },
  {
    title: 'How check-ins work',
    body: 'We use the clinically validated PHQ-9 and GAD-7 questionnaires — the same tools real counsellors use. Your scores across check-ins build a trend, which helps us catch gradual decline before it becomes a crisis.',
    icon: '📋',
  },
];

export default function Onboarding() {
  const { completeOnboarding, user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const pseudonym = user?.pseudonym ?? PSEUDONYMS[Math.floor(Math.random() * PSEUDONYMS.length)];

  function next() {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      completeOnboarding();
      navigate('/dashboard');
    }
  }

  const current = steps[step];

  return (
    <div className="min-h-screen bg-bg-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-in-up">

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-brand-500' : i < step ? 'w-4 bg-brand-500/50' : 'w-4 bg-surface-border'
            }`} />
          ))}
        </div>

        {/* Card */}
        <div className="card-elevated text-center">
          <div className="text-5xl mb-5 animate-breathe inline-block">{current.icon}</div>
          <h2 className="text-xl font-bold text-slate-100 mb-3">{current.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{current.body}</p>

          {/* Step 1 — show pseudonym */}
          {step === 1 && (
            <div className="mb-6 p-4 rounded-2xl bg-bg-900 border border-brand-500/25">
              <p className="text-xs text-slate-500 mb-2">Your pseudonym</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `${user?.avatarColor ?? '#7c6af7'}25`, color: user?.avatarColor ?? '#7c6af7' }}>
                  {pseudonym[0]}
                </div>
                <span className="text-lg font-bold text-slate-100">{pseudonym}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-3">Auto-assigned · Cannot be changed · Visible only in the forum</p>
            </div>
          )}

          {/* Step 2 — PHQ-9 info */}
          {step === 2 && (
            <div className="mb-6 grid grid-cols-2 gap-3 text-left">
              {[
                { label: 'PHQ-9', desc: 'Depression · 9 questions · 0–27 points' },
                { label: 'GAD-7', desc: 'Anxiety · 7 questions · 0–21 points' },
              ].map(({ label, desc }) => (
                <div key={label} className="p-3 rounded-xl bg-bg-900 border border-surface-border">
                  <p className="text-brand-400 font-bold text-sm">{label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={next} className="btn btn-primary btn-lg w-full justify-center">
            {step < steps.length - 1 ? (
              <><span>Continue</span><ChevronRight size={16} /></>
            ) : (
              '✓ Get Started'
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
