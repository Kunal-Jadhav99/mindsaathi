import { useState, useEffect } from 'react';
import { getRiskBadgeClass, timeAgo } from '../../utils/riskEngine';
import { AlertTriangle, Phone, ShieldAlert, CheckCircle, RefreshCw, Inbox } from 'lucide-react';
import { getAlerts, updateAlertStatus } from '../../utils/api';

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAlerts() {
    setLoading(true);
    setError(null);
    try {
      const liveAlerts = await getAlerts();
      setAlerts(Array.isArray(liveAlerts) ? liveAlerts : []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err.message || 'Could not load alerts. Check your API configuration.');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAlerts(); }, []);

  const handleResolveAlert = async (id) => {
    try {
      await updateAlertStatus(id, 'resolved', 'Resolved by counsellor.');
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="flex items-center gap-2 text-red-400">
            <ShieldAlert size={24} />
            Active Escalations
          </h1>
          <p>Students flagged as Medium or High risk requiring counsellor review.</p>
        </div>
        <button
          onClick={loadAlerts}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px', fontSize: '12px',
            fontWeight: 600, border: '1px solid #2a2a3a',
            background: 'transparent', color: '#9090a8', cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
          background: '#2a1a1a', border: '1px solid #f87171', color: '#f87171',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      <div className="bg-bg-800 border border-surface-border rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-border bg-bg-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-3">Student</div>
          <div className="col-span-2">Risk Level</div>
          <div className="col-span-2">Latest Score</div>
          <div className="col-span-2">Trend</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-surface-subtle">
          {/* Loading skeleton */}
          {loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9090a8', fontSize: '13px' }}>
              <RefreshCw size={24} style={{ margin: '0 auto 12px', opacity: 0.4, animation: 'spin 0.8s linear infinite' }} />
              Loading escalations…
            </div>
          )}

          {/* Real alert rows */}
          {!loading && alerts.map((alert) => (
            <div key={alert.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg-900/50 transition-colors">
              <div className="col-span-3">
                <p className="text-sm font-bold text-slate-200">{alert.realName}</p>
                <p className="text-xs text-slate-500">Pseudonym: {alert.pseudonym}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Flagged {timeAgo(alert.flaggedAt)}</p>
              </div>

              <div className="col-span-2">
                <span className={getRiskBadgeClass(alert.riskLevel)}>
                  {alert.riskLevel === 'high' && <AlertTriangle size={12} />}
                  {alert.riskLevel.toUpperCase()}
                </span>
                {alert.q9Override && (
                  <p className="text-[10px] font-bold text-red-400 mt-1">Q9 OVERRIDE</p>
                )}
              </div>

              <div className="col-span-2">
                <p className="text-sm font-bold text-slate-200">{alert.latestScore}</p>
                <p className="text-[10px] text-slate-500">Combined</p>
              </div>

              <div className="col-span-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  alert.trend === 'rising' || alert.trend === 'q9-override'
                    ? 'bg-red-400/10 text-red-400'
                    : 'bg-surface-subtle text-slate-400'
                }`}>
                  {alert.trend === 'rising' || alert.trend === 'q9-override' ? '↑ Rising' : '→ Stable'}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="btn btn-sm btn-ghost border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
                <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-500">
                  <Phone size={14} /> Contact
                </button>
              </div>
            </div>
          ))}

          {/* Empty state — no alerts */}
          {!loading && !error && alerts.length === 0 && (
            <div style={{
              padding: '48px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            }}>
              <Inbox size={36} style={{ color: '#4ade80', opacity: 0.6 }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>All clear</p>
              <p style={{ fontSize: '12px', color: '#9090a8' }}>
                No active escalations for your institute right now.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-bg-900 border border-surface-border flex items-start gap-3">
        <ShieldAlert size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Privacy Notice:</strong> This is the only view where real student identities are visible, and access is strictly limited to authorized counselling staff. Institution administrators only have access to the aggregated analytics dashboard.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
