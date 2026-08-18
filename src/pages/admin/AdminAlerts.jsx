import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiskBadgeClass, timeAgo } from '../../utils/riskEngine';
import { AlertTriangle, Phone, ShieldAlert, CheckCircle, RefreshCw, Inbox, ArrowLeft, Mail } from 'lucide-react';
import { getAlerts, updateAlertStatus } from '../../utils/api';

export default function AdminAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [error, setError] = useState(null);

  async function loadAlerts() {
    setLoading(true);
    setError(null);
    try {
      const liveAlerts = await getAlerts();
      setAlerts(Array.isArray(liveAlerts) ? liveAlerts : []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err.message || 'Could not load alerts from backend.');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAlerts(); }, []);

  const handleResolveAlert = async (id) => {
    setResolvingId(id);
    try {
      await updateAlertStatus(id, 'resolved', 'Resolved by campus counsellor.');
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1240px', margin: '0 auto' }} className="animate-fade-in">
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button
            onClick={() => navigate('/admin')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 600, color: 'var(--primary)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '6px'
            }}
          >
            <ArrowLeft size={14} /> Back to Institution Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={24} />
              Active Escalations
            </h1>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA'
            }}>
              Counsellor Confidential
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px', margin: 0 }}>
            Students flagged as High Risk or displaying worsening distress trends requiring psychological triage.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          disabled={loading}
          className="btn btn-outline"
          style={{ fontSize: '12px', padding: '7px 12px', borderRadius: '8px' }}
        >
          <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
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

      {/* ── Table Card ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '3fr 2fr 1.5fr 2fr 2.5fr',
          padding: '14px 20px', background: '#F8FAFC', borderBottom: '1px solid var(--border)',
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B'
        }}>
          <div>Student Profile</div>
          <div>Risk Level</div>
          <div>Combined Score</div>
          <div>Trend Indicator</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} style={{ margin: '0 auto 12px', opacity: 0.5, animation: 'spin 0.8s linear infinite', color: 'var(--primary)' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>Loading active escalations…</p>
          </div>
        )}

        {/* Rows */}
        {!loading && alerts.map((alert) => {
          const avatarInitial = (alert.realName || alert.pseudonym || 'U')[0]?.toUpperCase();
          const isQ9 = alert.q9Override || alert.trend === 'q9-override';

          return (
            <div
              key={alert.id}
              style={{
                display: 'grid', gridTemplateColumns: '3fr 2fr 1.5fr 2fr 2.5fr',
                padding: '16px 20px', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)',
                transition: 'background 0.12s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Student Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: isQ9 ? '#FEF2F2' : '#EFF6FF',
                  color: isQ9 ? '#DC2626' : '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px', border: `1px solid ${isQ9 ? '#FECACA' : '#BFDBFE'}`
                }}>
                  {avatarInitial}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {alert.realName || 'Unknown Student'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                    Pseudo: <span style={{ fontWeight: 600 }}>{alert.pseudonym}</span> · {alert.department || 'General'}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>
                    Flagged {alert.flaggedAt ? timeAgo(alert.flaggedAt) : 'recently'}
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div>
                <span className={getRiskBadgeClass(alert.riskLevel || 'high')}>
                  {alert.riskLevel === 'high' && <AlertTriangle size={12} />}
                  {(alert.riskLevel || 'HIGH').toUpperCase()}
                </span>
                {isQ9 && (
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#DC2626', marginTop: '4px', letterSpacing: '0.04em' }}>
                    🚨 Q9 OVERRIDE
                  </div>
                )}
              </div>

              {/* Latest Score */}
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {alert.latestScore ?? '—'} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>/ 48</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>PHQ-9 + GAD-7</div>
              </div>

              {/* Trend */}
              <div>
                <span style={{
                  fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px',
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: isQ9 || alert.trend === 'rising' ? '#FEF2F2' : '#F1F5F9',
                  color: isQ9 || alert.trend === 'rising' ? '#DC2626' : '#475569',
                  border: isQ9 || alert.trend === 'rising' ? '1px solid #FECACA' : '1px solid #E2E8F0'
                }}>
                  {isQ9 ? '🚨 Severe Trigger' : (alert.trend === 'rising' ? '↑ Rising Distress' : '→ Sustained')}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  disabled={resolvingId === alert.id}
                  className="btn"
                  style={{
                    background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0',
                    fontSize: '12px', padding: '6px 12px', borderRadius: '8px', fontWeight: 600
                  }}
                >
                  <CheckCircle size={14} />
                  {resolvingId === alert.id ? 'Resolving…' : 'Resolve'}
                </button>
                <a
                  href={`mailto:${alert.email || ''}`}
                  className="btn btn-primary"
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
                >
                  <Mail size={13} />
                  Contact
                </a>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {!loading && !error && alerts.length === 0 && (
          <div style={{
            padding: '56px 20px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#F0FDF4', color: '#16A34A', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '4px'
            }}>
              <Inbox size={26} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              All Clear — No Active Escalations
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '360px', margin: 0 }}>
              There are currently no high-risk flags or active emergency alerts requiring counsellor review for your institute.
            </p>
          </div>
        )}
      </div>

      {/* Confidentiality Notice */}
      <div style={{
        marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
        background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex',
        alignItems: 'flex-start', gap: '12px'
      }}>
        <ShieldAlert size={18} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', color: '#1E40AF', margin: 0, lineHeight: 1.5 }}>
          <strong>Clinical Confidentiality Notice:</strong> This view is strictly restricted to certified campus counsellors. Student real identities and scores are revealed solely for the purpose of clinical triage and urgent safety intervention under campus safeguarding protocols.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
