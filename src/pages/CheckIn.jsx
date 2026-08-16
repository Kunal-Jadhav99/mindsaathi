import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, FREQUENCY_OPTIONS } from '../data/mockData';
import { getSingleCheckInRisk } from '../utils/riskEngine';
import { AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, LifeBuoy } from 'lucide-react';

const MOODS = [
  { key: 'awful', emoji: '😞', label: 'Very Bad'  },
  { key: 'bad',   emoji: '😔', label: 'Bad'       },
  { key: 'okay',  emoji: '😐', label: 'Okay'      },
  { key: 'good',  emoji: '🙂', label: 'Good'      },
  { key: 'great', emoji: '😄', label: 'Very Good'  },
];

const FACTOR_CHIPS = ['Studies', 'Relationships', 'Sleep', 'Workload', 'Health', 'Other'];

export default function CheckIn() {
  const { addCheckIn, openSOS } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase]           = useState('mood');   // 'mood' | 'phq9' | 'gad7' | 'done'
  const [phq9Answers, setPhq9]      = useState(Array(9).fill(null));
  const [gad7Answers, setGad7]      = useState(Array(7).fill(null));
  const [mood, setMood]             = useState(null);
  const [factors, setFactors]       = useState([]);
  const [q9Triggered, setQ9]        = useState(false);
  const [result, setResult]         = useState(null);

  const PHASES = ['mood', 'phq9', 'gad7'];
  const phaseIndex = PHASES.indexOf(phase);

  function toggleFactor(f) {
    setFactors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  function setPhq9Ans(i, v) {
    const next = [...phq9Answers];
    next[i] = v;
    setPhq9(next);
    if (i === 8 && v >= 1) { setQ9(true); openSOS(); }
  }

  function setGad7Ans(i, v) {
    const next = [...gad7Answers];
    next[i] = v;
    setGad7(next);
  }

  const phq9Done = phq9Answers.every(a => a !== null);
  const gad7Done = gad7Answers.every(a => a !== null);

  function submit() {
    const phq9Score  = phq9Answers.reduce((s, v) => s + v, 0);
    const gad7Score  = gad7Answers.reduce((s, v) => s + v, 0);
    const phq9Q9Score = phq9Answers[8];
    const risk = getSingleCheckInRisk(phq9Score, gad7Score, phq9Q9Score);
    const checkin = {
      id: `ci_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      phq9Score, gad7Score, phq9Q9Score,
      riskLevel: risk,
      mood: mood ?? 'okay',
      journalSnippet: '',
    };
    addCheckIn(checkin);
    setResult(checkin);
    setPhase('done');
  }

  /* ── Result screen ── */
  if (phase === 'done' && result) {
    const info = {
      low:    { color: 'var(--success)', bg: 'var(--success-light)', border: '#BBF7D0', icon: <CheckCircle2 size={24} />, label: 'Low Risk',    action: 'Keep it up. Check the self-help resources to maintain your wellbeing.' },
      medium: { color: '#B45309',        bg: 'var(--warning-light)', border: '#FDE68A', icon: <AlertTriangle size={24} />, label: 'Medium Risk', action: 'Consider booking an optional counsellor session. You don\'t have to go through this alone.' },
      high:   { color: 'var(--danger)',  bg: 'var(--danger-light)',  border: '#FECACA', icon: <AlertTriangle size={24} />, label: 'High Risk',   action: 'Your counsellor has been notified. Crisis resources are available now — please reach out.' },
    }[result.riskLevel];

    return (
      <div className="s-page animate-fade-in" style={{ maxWidth: '560px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: info.bg, border: `1px solid ${info.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: info.color }}>
            {info.icon}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: info.color, marginBottom: '6px' }}>Check-In Complete</div>
          <h2 style={{ fontSize: '22px', margin: '0 0 8px' }}>{info.label}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>{info.action}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            {[['PHQ-9', result.phq9Score, 27], ['GAD-7', result.gad7Score, 21]].map(([name, val, max]) => (
              <div key={name} style={{ background: 'var(--page-bg)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{name} Score</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {val}<span style={{ fontSize: '14px', color: 'var(--text-faint)', fontWeight: 500 }}>/{max}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            {result.riskLevel !== 'low' && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/resources')}>View Resources</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="s-page animate-fade-in">
      <div className="s-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Daily Check-In</h1>
          <p style={{ color: 'var(--text-muted)' }}>Clinically validated PHQ-9 + GAD-7 · ~3 minutes</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px', maxWidth: '400px' }}>
        {['Mood', 'PHQ-9', 'GAD-7'].map((step, idx) => {
          const done    = idx < phaseIndex;
          const active  = idx === phaseIndex;
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: done || active ? 'var(--primary)' : 'var(--border)',
                  color: done || active ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {done ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{step}</span>
              </div>
              {idx < 2 && (
                <div style={{ flex: 1, height: '2px', background: done ? 'var(--primary)' : 'var(--border)', margin: '0 4px', marginBottom: '18px' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Q9 alert */}
      {q9Triggered && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderRadius: '10px', background: 'var(--danger-light)', border: '1px solid #FECACA', marginBottom: '20px' }}>
          <LifeBuoy size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '13px', color: '#991B1B', lineHeight: 1.5 }}>
            We noticed your answer to Question 9. Your safety is the priority — the SOS panel has opened with immediate support options.
          </p>
        </div>
      )}

      {/* ── Phase: Mood ── */}
      {phase === 'mood' && (
        <div style={{ maxWidth: '540px' }}>
          <div className="card" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>How are you feeling right now?</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {MOODS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    padding: '14px 8px', borderRadius: '10px', border: `2px solid ${mood === m.key ? 'var(--primary)' : 'var(--border)'}`,
                    background: mood === m.key ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: mood === m.key ? 'var(--primary)' : 'var(--text-muted)' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>What's contributing to how you feel?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FACTOR_CHIPS.map(f => (
                <button
                  key={f}
                  onClick={() => toggleFactor(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    border: `1px solid ${factors.includes(f) ? 'var(--primary)' : 'var(--border)'}`,
                    background: factors.includes(f) ? 'var(--primary-light)' : 'transparent',
                    color: factors.includes(f) ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.12s',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={!mood}
              onClick={() => setPhase('phq9')}
              style={{ gap: '6px' }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Phase: PHQ-9 ── */}
      {phase === 'phq9' && (
        <div style={{ maxWidth: '640px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Over the <strong>last 2 weeks</strong>, how often have you been bothered by the following?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {PHQ9_QUESTIONS.map((q, i) => (
              <div key={i} className="card" style={{ padding: '16px', borderColor: i === 8 ? '#FECACA' : 'var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px', flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{q}</p>
                  {i === 8 && <span className="badge badge-red" style={{ flexShrink: 0 }}>Important</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                  {FREQUENCY_OPTIONS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setPhq9Ans(i, value)}
                      style={{
                        padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                        border: `1px solid ${phq9Answers[i] === value ? (i === 8 && value > 0 ? 'var(--danger)' : 'var(--primary)') : 'var(--border)'}`,
                        background: phq9Answers[i] === value ? (i === 8 && value > 0 ? 'var(--danger-light)' : 'var(--primary-light)') : 'transparent',
                        color: phq9Answers[i] === value ? (i === 8 && value > 0 ? 'var(--danger)' : 'var(--primary)') : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.12s',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" onClick={() => setPhase('mood')}><ChevronLeft size={15} /> Back</button>
            <button className="btn btn-primary" disabled={!phq9Done} onClick={() => setPhase('gad7')}>
              Next: GAD-7 <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Phase: GAD-7 ── */}
      {phase === 'gad7' && (
        <div style={{ maxWidth: '640px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Over the <strong>last 2 weeks</strong>, how often have you been bothered by the following?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {GAD7_QUESTIONS.map((q, i) => (
              <div key={i} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px', flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>{q}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                  {FREQUENCY_OPTIONS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setGad7Ans(i, value)}
                      style={{
                        padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                        border: `1px solid ${gad7Answers[i] === value ? 'var(--primary)' : 'var(--border)'}`,
                        background: gad7Answers[i] === value ? 'var(--primary-light)' : 'transparent',
                        color: gad7Answers[i] === value ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.12s',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" onClick={() => setPhase('phq9')}><ChevronLeft size={15} /> Back</button>
            <button className="btn btn-primary" disabled={!gad7Done} onClick={submit}>
              Submit Check-In ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
