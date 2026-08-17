import { db } from '../config/firebase.js';

// ============================================================
// Admin Controller — Institute-specific analytics & counsellor alerts
// ============================================================

/** Get risk distribution by department within the counsellor's institute */
export const getDeptStats = async (req, res) => {
  const instituteId = req.user.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    // Fetch all users belonging to this specific institute
    const usersSnapshot = await db.collection('users')
      .where('instituteId', '==', instituteId)
      .get();

    const deptMap = {};

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const dept = data.department || 'Unassigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { dept, low: 0, medium: 0, high: 0, total: 0 };
      }
      deptMap[dept].total += 1;
    });

    // Fetch the check-ins for this institute to determine risk levels
    const checkinsSnapshot = await db.collection('checkins')
      .where('instituteId', '==', instituteId)
      .orderBy('date', 'desc')
      .get();

    const latestPerUser = {};
    checkinsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!latestPerUser[data.uid]) {
        latestPerUser[data.uid] = data;
      }
    });

    // Map latest risk levels to department metrics
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const dept = userData.department || 'Unassigned';
      const latestCheckin = latestPerUser[userData.uid];

      if (latestCheckin) {
        const risk = latestCheckin.riskLevel || 'low';
        if (deptMap[dept]) {
          deptMap[dept][risk] = (deptMap[dept][risk] || 0) + 1;
        }
      }
    });

    const stats = Object.values(deptMap);
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching dept stats:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch department statistics.' });
  }
};

/** Get weekly trend data for institution-wide analytics (scoped to institute) */
export const getWeeklyTrends = async (req, res) => {
  const instituteId = req.user.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    // Fetch check-ins from the last 8 weeks for this institute
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const snapshot = await db.collection('checkins')
      .where('instituteId', '==', instituteId)
      .where('date', '>=', eightWeeksAgo.toISOString())
      .orderBy('date', 'asc')
      .get();

    // Group check-ins by week
    const weekMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = new Date(data.date);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weekNum = Math.ceil(date.getDate() / 7);
      const weekKey = `${monthNames[date.getMonth()]} W${weekNum}`;

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = { week: weekKey, totalPhq9: 0, totalGad7: 0, count: 0, highCount: 0 };
      }

      weekMap[weekKey].totalPhq9 += data.phq9Score || 0;
      weekMap[weekKey].totalGad7 += data.gad7Score || 0;
      weekMap[weekKey].count += 1;
      if (data.riskLevel === 'high') {
        weekMap[weekKey].highCount += 1;
      }
    });

    // Calculate averages
    const trends = Object.values(weekMap).map(w => ({
      week: w.week,
      avgPhq9: w.count > 0 ? Number((w.totalPhq9 / w.count).toFixed(1)) : 0,
      avgGad7: w.count > 0 ? Number((w.totalGad7 / w.count).toFixed(1)) : 0,
      highCount: w.highCount
    }));

    return res.json(trends);
  } catch (error) {
    console.error('Error fetching weekly trends:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch weekly trends.' });
  }
};

/** Get active counsellor escalation alerts for this institute */
export const getAlerts = async (req, res) => {
  const instituteId = req.user.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const snapshot = await db.collection('alerts')
      .where('instituteId', '==', instituteId)
      .where('status', '==', 'active')
      .orderBy('flaggedAt', 'desc')
      .get();

    const alerts = [];
    snapshot.forEach(doc => {
      alerts.push({ id: doc.id, ...doc.data() });
    });

    return res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch alerts.' });
  }
};

/** Update alert status (counsellor resolves or marks in-progress) */
export const updateAlertStatus = async (req, res) => {
  const instituteId = req.user.instituteId || 'default-institute';
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!['active', 'in-progress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Status must be active, in-progress, or resolved.' });
  }

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const alertRef = db.collection('alerts').doc(id);
    const alertDoc = await alertRef.get();

    if (!alertDoc.exists) {
      return res.status(404).json({ error: 'Not Found', message: 'Alert not found.' });
    }

    // Verify alert belongs to the counsellor's institute
    if (alertDoc.data().instituteId && alertDoc.data().instituteId !== instituteId) {
      return res.status(403).json({ error: 'Forbidden', message: 'Alert belongs to a different institute.' });
    }

    const updates = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) updates.counsellorNotes = notes;
    if (status === 'resolved') updates.resolvedAt = new Date().toISOString();

    await alertRef.update(updates);

    const updated = await alertRef.get();
    return res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Error updating alert:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not update alert.' });
  }
};

/** Get overall summary stats for the counsellor's institute */
export const getSummary = async (req, res) => {
  const instituteId = req.user.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const [usersSnap, checkinsSnap, alertsSnap] = await Promise.all([
      db.collection('users').where('instituteId', '==', instituteId).get(),
      db.collection('checkins').where('instituteId', '==', instituteId).get(),
      db.collection('alerts').where('instituteId', '==', instituteId).where('status', '==', 'active').get()
    ]);

    const totalUsers = usersSnap.size;
    const totalCheckins = checkinsSnap.size;
    const activeAlerts = alertsSnap.size;

    // Count risk distribution from latest check-ins
    const latestPerUser = {};
    checkinsSnap.forEach(doc => {
      const data = doc.data();
      if (!latestPerUser[data.uid] || new Date(data.date) > new Date(latestPerUser[data.uid].date)) {
        latestPerUser[data.uid] = data;
      }
    });

    let lowCount = 0, mediumCount = 0, highCount = 0;
    Object.values(latestPerUser).forEach(c => {
      if (c.riskLevel === 'high') highCount++;
      else if (c.riskLevel === 'medium') mediumCount++;
      else lowCount++;
    });

    return res.json({
      instituteId,
      totalUsers,
      totalCheckins,
      activeAlerts,
      riskDistribution: { low: lowCount, medium: mediumCount, high: highCount }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch institution summary.' });
  }
};
