import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, RefreshCw, ShieldAlert, ChevronRight, Activity, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAdminSummary, getDeptStats as apiGetDeptStats, getWeeklyTrends as apiGetWeeklyTrends } from '../../utils/api';

function EmptyState({ message }) {
  return (
    <div style={{
      height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '10px', color: 'var(--text-muted)'
    }}>
      <Activity size={28} style={{ opacity: 0.35, color: 'var(--primary)' }} />
      <p style={{ fontSize: '13px', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useApp();
  const [summary, setSummary] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function loadDashboardData() {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, deptRes, trendRes] = await Promise.allSettled([
        getAdminSummary(),
        apiGetDeptStats(),
        apiGetWeeklyTrends(),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value) {
        setSummary(sumRes.value);
      }
      if (deptRes.status === 'fulfilled' && Array.isArray(deptRes.value)) {
        setDeptStats(deptRes.value);
      }
      if (trendRes.status === 'fulfilled' && Array.isArray(trendRes.value)) {
        setWeeklyTrend(trendRes.value);
      }

      if (
        sumRes.status === 'rejected' &&
        deptRes.status === 'rejected' &&
        trendRes.status === 'rejected'
      ) {
        setError('Could not connect to the backend analytics API.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboardData(); }, []);

  return (
    <div style={{ padding: '28px', maxWidth: '1240px', margin: '0 auto' }} className="animate-fade-in">
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Institution Analytics
            </h1>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
              background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE'
            }}>
              Dean & Counsellor View
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px', margin: 0 }}>
            Identity-blind aggregated trends and early-warning stress indicators across departments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/alerts')}
            className="btn"
            style={{
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
              fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: 600
            }}
          >
            <ShieldAlert size={14} />
            View Active Alerts
            {summary?.activeAlerts > 0 && (
              <span style={{
                background: '#EF4444', color: '#fff', fontSize: '10px',
                padding: '1px 6px', borderRadius: '99px', marginLeft: '2px'
              }}>
                {summary.activeAlerts}
              </span>
            )}
          </button>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="btn btn-outline"
            style={{ fontSize: '12px', padding: '7px 12px', borderRadius: '8px' }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>

          <button
            onClick={handleLogout}
            className="btn"
            style={{
              background: '#F8FAFC', color: 'var(--danger)', border: '1px solid #FECACA',
              fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: 600
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          >
            <LogOut size={13} />
            Log Out
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div style={{
          marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
          background: 'var(--danger-light)', border: '1px solid #FECACA', color: 'var(--danger)',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* ── KPI Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Card 1: Active Students */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: '#EFF6FF', color: '#2563EB', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Registered Students</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {loading ? '—' : (summary?.totalUsers ?? 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>Total student cohort</div>
          </div>
        </div>

        {/* Card 2: Total Check-ins */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: '#F0FDF4', color: '#16A34A', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Check-ins Logged</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {loading ? '—' : (summary?.totalCheckins ?? 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>PHQ-9 & GAD-7 submissions</div>
          </div>
        </div>

        {/* Card 3: Active Alerts */}
        <div
          className="card"
          onClick={() => navigate('/admin/alerts')}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px',
            cursor: 'pointer', border: summary?.activeAlerts > 0 ? '1px solid #FECACA' : undefined,
            background: summary?.activeAlerts > 0 ? '#FFF5F5' : 'var(--surface)'
          }}
        >
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: '#FEF2F2', color: '#EF4444', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>High Risk Alerts (Active)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', lineHeight: 1.2 }}>
              {loading ? '—' : (summary?.activeAlerts ?? 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Requiring counsellor review →</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-faint)' }} />
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
        
        {/* Chart 1: Campus-Wide Stress Trend */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Campus-Wide Stress Trend
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                Average depression (PHQ-9) and anxiety (GAD-7) scores across timeline
              </p>
            </div>
          </div>

          {loading ? (
            <EmptyState message="Loading trend metrics from database…" />
          ) : weeklyTrend.length === 0 ? (
            <EmptyState message="No check-in history found. Chart will populate as students complete check-ins." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis yAxisId="left" domain={[0, 27]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#EF4444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px'
                  }}
                  labelStyle={{ fontWeight: 700, color: '#1E293B' }}
                />
                <Legend wrapperStyle={{ paddingTop: '14px', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="avgPhq9" name="Avg PHQ-9 (Depression)" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} />
                <Line yAxisId="left" type="monotone" dataKey="avgGad7" name="Avg GAD-7 (Anxiety)" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="highCount" name="High Risk Cases" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart 2: Department Breakdown */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Risk Distribution by Department
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                Student risk level breakdown across engineering branches
              </p>
            </div>
          </div>

          {loading ? (
            <EmptyState message="Loading department breakdown…" />
          ) : deptStats.length === 0 ? (
            <EmptyState message="No department data found. Chart will populate once check-ins are logged." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptStats} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px'
                  }}
                  labelStyle={{ fontWeight: 700, color: '#1E293B' }}
                />
                <Legend wrapperStyle={{ paddingTop: '14px', fontSize: '12px' }} />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
