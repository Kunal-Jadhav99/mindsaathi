// ============================================================
// Risk Engine — PHQ-9 + GAD-7 triage logic (plain JS)
// Replace with Python microservice API calls in production
// ============================================================

/** Step 1: Single check-in risk level */
export function getSingleCheckInRisk(phq9, gad7, phq9Q9) {
  if (phq9Q9 >= 1) return 'high'; // Q9 override — instant escalation

  const phqRisk = phq9 >= 15 ? 'high' : phq9 >= 10 ? 'medium' : 'low';
  const gadRisk = gad7 >= 15 ? 'high' : gad7 >= 10 ? 'medium' : 'low';

  if (phqRisk === 'high' || gadRisk === 'high') return 'high';
  if (phqRisk === 'medium' || gadRisk === 'medium') return 'medium';
  return 'low';
}

/** Step 2: Trend logic across last 3 check-ins */
export function getTrendRisk(history) {
  const last3 = [...history]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (last3.length === 0) {
    return { finalRisk: 'low', trendFlag: null, explanation: 'No check-in history yet.' };
  }

  const latest = last3[0];

  // Q9 override
  if (latest.phq9Q9Score >= 1) {
    return { finalRisk: 'high', trendFlag: 'q9-override', explanation: 'Immediate escalation: self-harm ideation detected (Q9 override).' };
  }

  // Any High in last 3
  if (last3.some(c => c.riskLevel === 'high')) {
    return { finalRisk: 'high', trendFlag: 'high-detected', explanation: 'High risk detected in recent check-ins.' };
  }

  if (last3.length >= 2) {
    const [c1, c2] = last3;
    const phqRise = c1.phq9Score - c2.phq9Score;
    const gadRise = c1.gad7Score - c2.gad7Score;
    if (phqRise >= 5 || gadRise >= 5) {
      const base = latest.riskLevel;
      const escalated = base === 'low' ? 'medium' : 'high';
      return {
        finalRisk: escalated,
        trendFlag: 'worsening-trend',
        explanation: `Worsening trend (↑${Math.max(phqRise, gadRise)} pts). Risk escalated ${base} → ${escalated}.`,
      };
    }
  }

  // 3 consecutive medium — plateaued
  if (last3.length === 3 && last3.every(c => c.riskLevel === 'medium')) {
    return { finalRisk: 'high', trendFlag: 'sustained-medium', explanation: '3 consecutive medium check-ins — sustained distress escalated to High.' };
  }

  return { finalRisk: latest.riskLevel, trendFlag: null, explanation: 'Stable or improving. No escalation.' };
}

export function getRiskBadgeClass(risk) {
  if (risk === 'high')   return 'badge badge-high';
  if (risk === 'medium') return 'badge badge-medium';
  return 'badge badge-low';
}

export function getRiskLabel(risk) {
  if (risk === 'high')   return 'High Risk';
  if (risk === 'medium') return 'Medium Risk';
  return 'Low Risk';
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
