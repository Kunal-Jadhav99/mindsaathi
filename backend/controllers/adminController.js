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

/** Seed 2 days of realistic student check-ins and alerts into Firestore */
export const seedMockData = async (req, res) => {
  const instituteId = req.user?.instituteId || 'default-institute';

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected. Please configure Firebase credentials.' });
  }

  try {
    const batch = db.batch();

    const STUDENTS = [
      { name: 'Arjun Mehta', email: 'arjun.mehta@college.edu', pseudo: 'BrokenCompass88', dept: 'Computer Science', risk: 'high', q9: true },
      { name: 'Priya Singh', email: 'priya.singh@college.edu', pseudo: 'TiredWalker12', dept: 'Electronics', risk: 'high', q9: false },
      { name: 'Rohan Verma', email: 'rohan.verma@college.edu', pseudo: 'GraySkies44', dept: 'Mechanical Engg', risk: 'high', q9: true },
      { name: 'Ananya Pillai', email: 'ananya.pillai@college.edu', pseudo: 'StillWater07', dept: 'Computer Science', risk: 'medium', q9: false },
      { name: 'Kavya Sharma', email: 'kavya.sharma@college.edu', pseudo: 'QuietOwl42', dept: 'Business Mgmt', risk: 'medium', q9: false },
      { name: 'Aditya Kulkarni', email: 'aditya.k@college.edu', pseudo: 'SilentMountain7', dept: 'Computer Science', risk: 'low', q9: false },
      { name: 'Sneha Patel', email: 'sneha.p@college.edu', pseudo: 'DriftingCloud11', dept: 'Civil Engg', risk: 'low', q9: false },
      { name: 'Rahul Joshi', email: 'rahul.j@college.edu', pseudo: 'WanderingReed23', dept: 'Mechanical Engg', risk: 'medium', q9: false },
      { name: 'Divya Nair', email: 'divya.n@college.edu', pseudo: 'CalmRiver55', dept: 'Electronics', risk: 'low', q9: false },
      { name: 'Vikram Deshmukh', email: 'vikram.d@college.edu', pseudo: 'BraveEcho90', dept: 'Civil Engg', risk: 'medium', q9: false },
      { name: 'Ishita Roy', email: 'ishita.r@college.edu', pseudo: 'GentleFox18', dept: 'Business Mgmt', risk: 'high', q9: false },
      { name: 'Tanmay Bhatt', email: 'tanmay.b@college.edu', pseudo: 'SwiftSprout66', dept: 'Computer Science', risk: 'low', q9: false },
      { name: 'Pooja Hegde', email: 'pooja.h@college.edu', pseudo: 'StormyOwl33', dept: 'Electronics', risk: 'low', q9: false },
      { name: 'Manish Gupta', email: 'manish.g@college.edu', pseudo: 'PonderingReed77', dept: 'Mechanical Engg', risk: 'low', q9: false },
      { name: 'Neha Rao', email: 'neha.r@college.edu', pseudo: 'CalmPebble12', dept: 'Business Mgmt', risk: 'low', q9: false }
    ];

    const now = new Date();
    let seededUsersCount = 0;
    let seededCheckinsCount = 0;
    let seededAlertsCount = 0;

    for (let i = 0; i < STUDENTS.length; i++) {
      const s = STUDENTS[i];
      const uid = `demo_std_${i + 1}`;

      // 1. Users collection
      const userRef = db.collection('users').doc(uid);
      batch.set(userRef, {
        uid,
        email: s.email,
        realName: s.name,
        pseudonym: s.pseudo,
        avatarColor: ['#7c6af7', '#4ade80', '#60a5fa', '#fbbf24', '#fb923c', '#a78bfa'][i % 6],
        streak: 2,
        joinedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        role: 'student',
        instituteId,
        department: s.dept,
        onboarded: true
      });
      seededUsersCount++;

      // 2. 2 Days of check-ins (Day 1: Yesterday, Day 0: Today)
      for (let dayOffset = 1; dayOffset >= 0; dayOffset--) {
        const checkinDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        
        let phq9Score = 4;
        let gad7Score = 3;
        let riskLevel = 'low';
        let phq9Q9Score = 0;

        if (s.risk === 'high') {
          phq9Score = dayOffset === 0 ? 18 : 12;
          gad7Score = dayOffset === 0 ? 16 : 10;
          riskLevel = dayOffset === 0 ? 'high' : 'medium';
          if (dayOffset === 0 && s.q9) phq9Q9Score = 2;
        } else if (s.risk === 'medium') {
          phq9Score = dayOffset === 0 ? 11 : 10;
          gad7Score = dayOffset === 0 ? 10 : 9;
          riskLevel = 'medium';
        } else {
          phq9Score = dayOffset === 0 ? 3 : 2;
          gad7Score = dayOffset === 0 ? 2 : 1;
          riskLevel = 'low';
        }

        const checkinRef = db.collection('checkins').doc();
        batch.set(checkinRef, {
          uid,
          instituteId,
          department: s.dept,
          date: checkinDate.toISOString(),
          phq9Score,
          gad7Score,
          phq9Q9Score,
          riskLevel,
          mood: riskLevel === 'high' ? 'bad' : (riskLevel === 'medium' ? 'okay' : 'good'),
          journalSnippet: riskLevel === 'high' 
            ? 'Feeling overwhelmed with coursework and submissions.' 
            : 'Making steady progress on assignments.'
        });
        seededCheckinsCount++;
      }

      // 3. Alerts for high risk
      if (s.risk === 'high') {
        const alertRef = db.collection('alerts').doc();
        batch.set(alertRef, {
          uid,
          instituteId,
          department: s.dept,
          pseudonym: s.pseudo,
          realName: s.name,
          riskLevel: 'high',
          latestScore: s.q9 ? 22 : 18,
          trend: s.q9 ? 'q9-override' : 'rising',
          flaggedAt: now.toISOString(),
          q9Override: s.q9,
          explanation: s.q9 
            ? 'Immediate escalation: self-harm ideation detected (Q9 override).' 
            : 'Worsening trend detected across the last 2 check-ins.',
          status: 'active'
        });
        seededAlertsCount++;
      }
    }

    await batch.commit();

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${seededUsersCount} students, ${seededCheckinsCount} check-ins, and ${seededAlertsCount} active alerts.`,
      seeded: {
        users: seededUsersCount,
        checkins: seededCheckinsCount,
        alerts: seededAlertsCount
      }
    });
  } catch (error) {
    console.error('Error seeding mock data:', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
};



