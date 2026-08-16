import { MOCK_DEPT_STATS, MOCK_WEEKLY_TREND } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const totalStudents = 1245;
  const activeCheckins = 892;
  const highRiskCount = MOCK_DEPT_STATS.reduce((acc, curr) => acc + curr.high, 0);

  return (
    <div className="page animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1>Institution Analytics</h1>
          <p>Identity-blind aggregated trends across all departments.</p>
        </div>
        <div className="bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 rounded-lg">
          <span className="text-xs font-bold text-brand-400">Admin View</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Active Students</p>
            <p className="text-2xl font-bold text-slate-100">{totalStudents}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Weekly Check-ins</p>
            <p className="text-2xl font-bold text-slate-100">{activeCheckins}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 border-red-400/20">
          <div className="w-12 h-12 rounded-xl bg-red-400/15 text-red-400 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">High Risk Alerts (Active)</p>
            <p className="text-2xl font-bold text-red-400">{highRiskCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <div className="card-elevated">
          <h2 className="text-sm font-bold text-slate-100 mb-6">Campus-Wide Stress Trend (Last 7 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_WEEKLY_TREND} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#9090a8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#9090a8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#f87171', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '12px' }}
                labelStyle={{ color: '#9090a8', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="avgPhq9" name="Avg PHQ-9" stroke="#7c6af7" strokeWidth={3} dot={{ r: 4, fill: '#7c6af7', strokeWidth: 0 }} />
              <Line yAxisId="left" type="monotone" dataKey="avgGad7" name="Avg GAD-7" stroke="#60a5fa" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }} />
              <Line yAxisId="right" type="monotone" dataKey="highCount" name="High Risk Cases" stroke="#f87171" strokeWidth={2} dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Breakdown */}
        <div className="card-elevated">
          <h2 className="text-sm font-bold text-slate-100 mb-6">Risk Distribution by Department (Current Week)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_DEPT_STATS} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#9090a8', fontSize: 12 }} axisLine={false} tickLine={false} max={100} />
              <YAxis dataKey="dept" type="category" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip
                contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: '12px' }}
                labelStyle={{ color: '#9090a8', marginBottom: '4px' }}
                formatter={(value) => [`${value}%`, undefined]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              <Bar dataKey="low" name="Low Risk" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} opacity={0.8} />
              <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} opacity={0.8} />
              <Bar dataKey="high" name="High Risk" stackId="a" fill="#f87171" radius={[0, 4, 4, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
