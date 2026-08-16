import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ClipboardList, MessageSquare, Users, BookOpen, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatDate, getRiskLabel } from '../utils/riskEngine';

export default function Dashboard() {
  const { user, checkIns, currentRisk } = useApp();
  const navigate = useNavigate();

  const chartData = [...checkIns]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(c => ({ date: formatDate(c.date), PHQ9: c.phq9Score, GAD7: c.gad7Score }));

  const latest = checkIns[0];

  const riskColors = {
    low: { bg: 'bg-green-400/10', border: 'border-green-400/25', text: 'text-green-400', icon: <CheckCircle size={18} /> },
    medium: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/25', text: 'text-yellow-400', icon: <AlertTriangle size={18} /> },
    high: { bg: 'bg-red-400/10', border: 'border-red-400/25', text: 'text-red-400', icon: <AlertTriangle size={18} /> },
  };
  const rc = riskColors[currentRisk.finalRisk];

  const quickActions = [
    { icon: ClipboardList, label: 'Daily Check-In', desc: 'PHQ-9 · GAD-7', to: '/checkin', color: 'text-brand-400', bg: 'bg-brand-500/15' },
    { icon: MessageSquare, label: 'Chat Support',   desc: 'Talk to AI chatbot', to: '/chat',    color: 'text-blue-400',  bg: 'bg-blue-500/15'  },
    { icon: Users,          label: 'Peer Forum',    desc: 'Anonymous peers',    to: '/forum',   color: 'text-green-400', bg: 'bg-green-500/15' },
    { icon: BookOpen,       label: 'Journal',       desc: 'Write your thoughts', to: '/journal', color: 'text-purple-400',bg: 'bg-purple-500/15'},
  ];

  return (
    <div className="page animate-fade-in">
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <h1>Good evening, <span className="text-brand-400">{user?.pseudonym}</span> 👋</h1>
          <p>Here's your wellness overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-800 border border-surface-border">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs text-slate-500 leading-none">Streak</p>
            <p className="text-sm font-bold text-brand-400 leading-none mt-0.5">{user?.streak ?? 0} days</p>
          </div>
        </div>
      </div>

      {/* Risk banner */}
      {currentRisk.trendFlag && (
        <div className={`mb-6 flex items-start gap-3 p-4 rounded-2xl border ${rc.bg} ${rc.border} animate-slide-in`}>
          <span className={rc.text}>{rc.icon}</span>
          <div>
            <p className={`text-sm font-semibold ${rc.text}`}>{getRiskLabel(currentRisk.finalRisk)} · Trend Alert</p>
            <p className="text-xs text-slate-400 mt-0.5">{currentRisk.explanation}</p>
          </div>
          {currentRisk.finalRisk !== 'low' && (
            <button onClick={() => navigate('/checkin')} className="ml-auto btn btn-sm btn-ghost flex-shrink-0">
              Check in now →
            </button>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Latest PHQ-9', value: latest?.phq9Score ?? '—', sub: 'Depression score', max: '/27' },
          { label: 'Latest GAD-7', value: latest?.gad7Score ?? '—', sub: 'Anxiety score', max: '/21'    },
          { label: 'Risk Level',   value: getRiskLabel(currentRisk.finalRisk), sub: 'Current assessment', max: '' },
        ].map(({ label, value, sub, max }) => (
          <div key={label} className="card">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {value}<span className="text-sm text-slate-500 font-normal">{max}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-400" />
            <p className="text-sm font-semibold text-slate-100">Score Trend</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-500 inline-block" />PHQ-9</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 inline-block" style={{borderTop:'2px dashed'}} />GAD-7</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 12, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#55556a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 27]} tick={{ fill: '#55556a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '10px', fontSize: 12 }}
              labelStyle={{ color: '#9090a8' }} itemStyle={{ color: '#f0f0f5' }} />
            <ReferenceLine y={10} stroke="#fbbf24" strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={15} stroke="#f87171" strokeDasharray="4 4" strokeWidth={1} />
            <Line type="monotone" dataKey="PHQ9" stroke="#7c6af7" strokeWidth={2.5} dot={{ fill: '#7c6af7', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="PHQ-9" />
            <Line type="monotone" dataKey="GAD7" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: '#60a5fa', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="GAD-7" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-slate-600 mt-2 text-center">Dashed lines = risk thresholds (10 = Medium, 15 = High)</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map(({ icon: Icon, label, desc, to, color, bg }) => (
          <button key={to} onClick={() => navigate(to)}
            className="card text-left hover:border-surface-border group transition-all">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-sm font-semibold text-slate-100">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
