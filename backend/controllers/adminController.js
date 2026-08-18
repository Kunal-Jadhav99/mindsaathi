import { db } from '../config/firebase.js';

// ============================================================
// Admin Controller — Institute-specific analytics & counsellor alerts
// ============================================================

/** Get risk distribution by department within the counsellor's institute */
export const getDeptStats = async (req, res) => {
  const instituteId = req.user?.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    // 1. Fetch all users for this institute
    const usersSnapshot = await db.collection('users')
      .where('instituteId', '==', instituteId)
      .get();

    const deptMap = {};
    const userDeptMap = {};

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const dept = data.department || 'General';
      userDeptMap[data.uid] = dept;

      if (!deptMap[dept]) {
        deptMap[dept] = { dept, low: 0, medium: 0, high: 0, total: 0 };
      }
      deptMap[dept].total += 1;
    });

    // 2. Fetch check-ins for this institute (in-memory sort to avoid requiring composite indexes)
    const checkinsSnapshot = await db.collection('checkins')
      .where('instituteId', '==', instituteId)
      .get();

    const latestPerUser = {};
    checkinsSnapshot.forEach(doc => {
      const data = doc.data();
      const prev = latestPerUser[data.uid];
      if (!prev || new Date(data.date) > new Date(prev.date)) {
        latestPerUser[data.uid] = data;
      }
    });

    // 3. Map latest risk level to each department
    Object.keys(userDeptMap).forEach(uid => {
      const dept = userDeptMap[uid];
      const checkin = latestPerUser[uid];
      const risk = checkin?.riskLevel || 'low';

      if (deptMap[dept]) {
        deptMap[dept][risk] = (deptMap[dept][risk] || 0) + 1;
      }
    });

    // If check-ins exist with department tags directly, ensure they count
    checkinsSnapshot.forEach(doc => {
      const data = doc.data();
      const dept = data.department;
      if (dept && !deptMap[dept]) {
        deptMap[dept] = { dept, low: 0, medium: 0, high: 0, total: 0 };
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
  const instituteId = req.user?.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    // Fetch all check-ins for this institute (filter & sort in JS to prevent index errors)
    const snapshot = await db.collection('checkins')
      .where('instituteId', '==', instituteId)
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const checkins = [];
    snapshot.forEach(doc => {
      checkins.push(doc.data());
    });

    // Sort ascending by date
    checkins.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group check-ins by date / day-bucket
    const dayMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    checkins.forEach(data => {
      const date = new Date(data.date);
      const label = `${monthNames[date.getMonth()]} ${date.getDate()}`;

      if (!dayMap[label]) {
        dayMap[label] = { label, totalPhq9: 0, totalGad7: 0, count: 0, highCount: 0, dateKey: date.getTime() };
      }

      dayMap[label].totalPhq9 += Number(data.phq9Score || 0);
      dayMap[label].totalGad7 += Number(data.gad7Score || 0);
      dayMap[label].count += 1;
      if (data.riskLevel === 'high') {
        dayMap[label].highCount += 1;
      }
    });

    const trends = Object.values(dayMap)
      .sort((a, b) => a.dateKey - b.dateKey)
      .map(w => ({
        week: w.label,
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
  const instituteId = req.user?.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const snapshot = await db.collection('alerts')
      .where('instituteId', '==', instituteId)
      .get();

    const alerts = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'active' || !data.status) {
        alerts.push({ id: doc.id, ...data });
      }
    });

    // In-memory sort by flagged timestamp descending
    alerts.sort((a, b) => new Date(b.flaggedAt || 0) - new Date(a.flaggedAt || 0));

    return res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch alerts.' });
  }
};

/** Update alert status (counsellor resolves or marks in-progress) */
export const updateAlertStatus = async (req, res) => {
  const instituteId = req.user?.instituteId || 'default-institute';
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
  const instituteId = req.user?.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const [usersSnap, checkinsSnap, alertsSnap] = await Promise.all([
      db.collection('users').where('instituteId', '==', instituteId).get(),
      db.collection('checkins').where('instituteId', '==', instituteId).get(),
      db.collection('alerts').where('instituteId', '==', instituteId).get()
    ]);

    const totalUsers = usersSnap.size;
    const totalCheckins = checkinsSnap.size;
    
    let activeAlerts = 0;
    alertsSnap.forEach(doc => {
      const data = doc.data();
      if (data.status === 'active' || !data.status) activeAlerts++;
    });

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
