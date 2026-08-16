import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, FREQUENCY_OPTIONS } from '../data/mockData';
import { getSingleCheckInRisk } from '../utils/riskEngine';
import { AlertTriangle, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const MOODS = ['great', 'good', 'okay', 'bad', 'awful'];
const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', bad: '😔', awful: '😞' };

export default function CheckIn() {
  const { addCheckIn, openSOS } = useApp();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('phq9');   // 'phq9' | 'gad7' | 'done'
  const [phq9Answers, setPhq9Answers] = useState(Array(9).fill(null));
  const [gad7Answers, setGad7Answers] = useState(Array(7).fill(null));
  const [mood, setMood] = useState(null);
  const [q9Triggered, setQ9Triggered] = useState(false);
  // submitted state removed
  const [result, setResult] = useState(null);

  function setPhq9(i, v) {
    const next = [...phq9Answers];
    next[i] = v;
    setPhq9Answers(next);
    // Q9 override — instant SOS trigger
    if (i === 8 && v >= 1) {
      setQ9Triggered(true);
      openSOS();
    }
  }

  function setGad7(i, v) {
    const next = [...gad7Answers];
    next[i] = v;
    setGad7Answers(next);
  }

  const phq9Done = phq9Answers.every(a => a !== null);
  const gad7Done = gad7Answers.every(a => a !== null);

  function submit() {
    const phq9Score = phq9Answers.reduce((s, v) => s + v, 0);
    const gad7Score = gad7Answers.reduce((s, v) => s + v, 0);
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
    setSubmitted(true);
    setPhase('done');
  }

  const riskInfo = {
    low: { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/25', icon: <CheckCircle size={20} />, label: 'Low Risk', action: 'Keep it up. Check the self-help resources to maintain your wellbeing.' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25', icon: <AlertTriangle size={20} />, label: 'Medium Risk', action: 'Consider booking an optional counsellor session. You don\'t have to go through this alone.' },
    high: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/25', icon: <AlertTriangle size={20} />, label: 'High Risk', action: 'Your counsellor has been notified. Crisis resources are available now — please reach out.' },
  };

  if (phase === 'done' && result) {
    const ri = riskInfo[result.riskLevel];
    return (
      <div className="page flex items-start justify-center animate-fade-in-up">
        <div className="w-full max-w-lg">
          <div className={`card-elevated border ${ri.bg} text-center`}>
            <div className={`w-14 h-14 rounded-full ${ri.bg} border ${ri.bg} flex items-center justify-center mx-auto mb-4 ${ri.color}`}>
              {ri.icon}
            </div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${ri.color}`}>Check-In Complete</p>
            <h2 className="text-xl font-bold text-slate-100 mb-1">{ri.label}</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">{ri.action}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-bg-950">
                <p className="text-xs text-slate-500">PHQ-9 Score</p>
                <p className="text-2xl font-bold text-slate-100">{result.phq9Score}<span className="text-sm text-slate-600">/27</span></p>
              </div>
              <div className="p-3 rounded-xl bg-bg-950">
                <p className="text-xs text-slate-500">GAD-7 Score</p>
                <p className="text-2xl font-bold text-slate-100">{result.gad7Score}<span className="text-sm text-slate-600">/21</span></p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn btn-ghost flex-1 justify-center">Back to Dashboard</button>
              {result.riskLevel !== 'low' && (
                <button onClick={() => navigate('/resources')} className="btn btn-primary flex-1 justify-center">View Resources</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1>Daily Check-In</h1>
        <p>Clinically validated PHQ-9 + GAD-7 questionnaire · ~3 minutes</p>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-1 p-1 bg-bg-800 rounded-xl mb-8 border border-surface-border max-w-xs">
        {[['phq9', 'PHQ-9 (Depression)'], ['gad7', 'GAD-7 (Anxiety)']].map(([key, label]) => (
          <button key={key} onClick={() => phase !== 'done' && setPhase(key)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${phase === key ? 'bg-brand-500/20 text-brand-400 border border-brand-500/35' : 'text-slate-500'
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Q9 warning banner */}
      {q9Triggered && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-400/10 border border-red-400/30 animate-slide-in">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">
            We noticed your answer to Question 9. Your safety is the priority — the SOS panel has opened with immediate support options.
          </p>
        </div>
      )}

      {/* PHQ-9 */}
      {phase === 'phq9' && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs text-slate-500 mb-2">Over the <strong className="text-slate-300">last 2 weeks</strong>, how often have you been bothered by the following?</p>
          {PHQ9_QUESTIONS.map((q, i) => (
            <div key={i} className={`card ${i === 8 ? 'border-red-400/20' : ''}`}>
              <p className="text-sm font-medium text-slate-200 mb-3">
                <span className="text-brand-400 font-bold mr-2">{i + 1}.</span>
                {q}
                {i === 8 && <span className="ml-2 badge badge-high text-[10px]">Important</span>}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FREQUENCY_OPTIONS.map(({ label, value }) => (
                  <button key={value} onClick={() => setPhq9(i, value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${phq9Answers[i] === value
                        ? i === 8 && value > 0
                          ? 'bg-red-400/20 border-red-400/50 text-red-300'
                          : 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'border-surface-border text-slate-400 hover:border-surface-border hover:bg-bg-700'
                      }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setPhase('gad7')} disabled={!phq9Done}
            className="btn btn-primary mt-4 disabled:opacity-40 disabled:cursor-not-allowed">
            Next: GAD-7 <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* GAD-7 */}
      {phase === 'gad7' && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-xs text-slate-500 mb-2">Over the <strong className="text-slate-300">last 2 weeks</strong>, how often have you been bothered by the following?</p>
          {GAD7_QUESTIONS.map((q, i) => (
            <div key={i} className="card">
              <p className="text-sm font-medium text-slate-200 mb-3">
                <span className="text-brand-400 font-bold mr-2">{i + 1}.</span>{q}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FREQUENCY_OPTIONS.map(({ label, value }) => (
                  <button key={value} onClick={() => setGad7(i, value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${gad7Answers[i] === value
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'border-surface-border text-slate-400 hover:bg-bg-700'
                      }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Mood picker */}
          <div className="card">
            <p className="text-sm font-medium text-slate-200 mb-3">Overall, how would you describe your mood today?</p>
            <div className="flex gap-3">
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all flex-1 ${mood === m ? 'bg-brand-500/15 border-brand-500/40 text-brand-300' : 'border-surface-border text-slate-400 hover:bg-bg-700'
                    }`}>
                  <span className="text-xl">{MOOD_EMOJI[m]}</span>
                  <span className="capitalize">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => setPhase('phq9')} className="btn btn-ghost">
              <ChevronLeft size={15} /> Back
            </button>
            <button onClick={submit} disabled={!gad7Done || !mood}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              Submit Check-In ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
