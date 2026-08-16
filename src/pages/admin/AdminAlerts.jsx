import { MOCK_COUNSELLOR_ALERTS } from '../../data/mockData';
import { getRiskBadgeClass, formatDate, timeAgo } from '../../utils/riskEngine';
import { AlertTriangle, UserPlus, Phone, ShieldAlert } from 'lucide-react';

export default function AdminAlerts() {
  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1 className="flex items-center gap-2 text-red-400">
          <ShieldAlert size={24} />
          Active Escalations
        </h1>
        <p>Students flagged as Medium or High risk requiring counsellor review.</p>
      </div>

      <div className="bg-bg-800 border border-surface-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-border bg-bg-900 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-3">Student</div>
          <div className="col-span-2">Risk Level</div>
          <div className="col-span-2">Latest Score</div>
          <div className="col-span-2">Trend</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <div className="divide-y divide-surface-subtle">
          {MOCK_COUNSELLOR_ALERTS.map((alert) => (
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
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${alert.trend === 'rising' ? 'bg-red-400/10 text-red-400' : 'bg-surface-subtle text-slate-400'
                  }`}>
                  {alert.trend === 'rising' ? '↑ Rising' : '→ Stable'}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-2">
                <button className="btn btn-sm btn-ghost border-surface-border">
                  <UserPlus size={14} /> Assign
                </button>
                <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-500">
                  <Phone size={14} /> Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-bg-900 border border-surface-border flex items-start gap-3">
        <ShieldAlert size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Privacy Notice:</strong> This is the only view where real student identities are visible, and access is strictly limited to authorized counselling staff. Institution administrators only have access to the aggregated analytics dashboard.
        </p>
      </div>
    </div>
  );
}
