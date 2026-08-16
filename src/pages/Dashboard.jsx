import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ClipboardList, MessageSquare, Users, BookOpen,
  TrendingUp, AlertTriangle, CheckCircle2, Flame,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { formatDate, getRiskLabel } from '../utils/riskEngine';

const QUICK_ACTIONS = [
  { icon: ClipboardList, label: 'Daily Check-In',  desc: 'PHQ-9 · GAD-7',        to: '/checkin',   color: '#2563EB', bg: '#EFF6FF' },
  { icon: MessageSquare, label: 'Chat Support',     desc: 'Talk to AI chatbot',    to: '/chat',      color: '#0891B2', bg: '#ECFEFF' },
  { icon: Users,         label: 'Peer Forum',       desc: 'Anonymous community',   to: '/forum',     color: '#059669', bg: '#ECFDF5' },
  { icon: BookOpen,      label: 'Journal',          desc: 'Write your thoughts',   to: '/journal',   color: '#7C3AED', bg: '#F5F3FF' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user, checkIns, currentRisk } = useApp();
  const navigate = useNavigate();

  const chartData = [...checkIns]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(c => ({ date: formatDate(c.date), PHQ9: c.phq9Score, GAD7: c.gad7Score }));

  const latest = checkIns[0];

  const riskBadge = {
    low:    { label: 'Low',    bg: 'var(--success-light)', border: '#BBF7D0', color: 'var(--success)'  },
    medium: { label: 'Medium', bg: 'var(--warning-light)', border: '#FDE68A', color: '#B45309'         },
    high:   { label: 'High',   bg: 'var(--danger-light)',  border: '#FECACA', color: 'var(--danger)'   },
  };
  const rb = riskBadge[currentRisk.finalRisk] ?? riskBadge.low;

  return (
    <div className="s-page animate-fade-in">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0 }}>
            {greeting()}, <span style={{ color: 'var(--primary)' }}>{user?.pseudonym}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '14px' }}>
            Here's your wellness overview for today.
          </p>
        </div>
        <div className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
          <Flame size={18} style={{ color: '#F97316' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Streak</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {user?.streak ?? 0} days
            </div>
          </div>
        </div>
      </div>

      {/* ── Risk banner ── */}
      {currentRisk.trendFlag && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
          background: rb.bg, border: `1px solid ${rb.border}`,
        }} className="animate-slide-up">
          {currentRisk.finalRisk === 'low'
            ? <CheckCircle2 size={18} style={{ color: rb.color, flexShrink: 0, marginTop: '1px' }} />
            : <AlertTriangle size={18} style={{ color: rb.color, flexShrink: 0, marginTop: '1px' }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: rb.color }}>
              {getRiskLabel(currentRisk.finalRisk)} · Trend Alert
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentRisk.explanation}
            </div>
          </div>
          {currentRisk.finalRisk !== 'low' && (
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/checkin')}>
              Check in now →
            </button>
          )}
        </div>
      )}

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Latest PHQ-9', value: latest?.phq9Score ?? '—', max: '/27', sub: 'Depression score' },
          { label: 'Latest GAD-7', value: latest?.gad7Score ?? '—', max: '/21', sub: 'Anxiety score'    },
          { label: 'Risk Level',   value: getRiskLabel(currentRisk.finalRisk), max: '', sub: 'Current assessment' },
        ].map(({ label, value, max, sub }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">
              {value}
              {max && <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-faint)' }}>{max}</span>}
            </div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Trend chart ── */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Score Trend</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '2px', background: 'var(--primary)' }} />PHQ-9
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '2px', background: '#06B6D4', borderTop: '2px dashed' }} />GAD-7
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 27]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              labelStyle={{ color: 'var(--text-muted)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-body)' }}
            />
            <ReferenceLine y={10} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={15} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1} />
            <Line type="monotone" dataKey="PHQ9" stroke="var(--primary)" strokeWidth={2.5}
              dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="PHQ-9" />
            <Line type="monotone" dataKey="GAD7" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 3"
              dot={{ fill: '#06B6D4', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="GAD-7" />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '8px', textAlign: 'center' }}>
          Dashed lines = risk thresholds (10 = Medium · 15 = High)
        </p>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, to, color, bg }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer', background: '#fff', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
