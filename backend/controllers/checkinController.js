import { db } from '../config/firebase.js';

// Re-implementing the core risk engine on the backend for independent triage
const getSingleCheckInRisk = (phq9, gad7, phq9Q9) => {
  if (phq9Q9 >= 1) return 'high'; // Q9 override — instant escalation
  if (phq9 >= 15 || gad7 >= 15) return 'high';
  if (phq9 >= 10 || gad7 >= 10) return 'medium';
  return 'low';
};

const getTrendRisk = (history) => {
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

  // Worsening Trend: Rise of 5+ points between latest and previous check-in
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
};

/** Get check-in history for logged-in user */
export const getCheckins = async (req, res) => {
  const { uid } = req.user;

  if (!db) {
    // Return dummy history if database not initialized
    return res.json([
      { id: 'ci2', uid, date: '2026-08-16', phq9Score: 12, gad7Score: 11, phq9Q9Score: 0, riskLevel: 'medium', mood: 'bad', journalSnippet: 'Feeling stressed out.' },
      { id: 'ci1', uid, date: '2026-08-09', phq9Score: 6, gad7Score: 5, phq9Q9Score: 0, riskLevel: 'low', mood: 'okay', journalSnippet: 'Getting by okay.' }
    ]);
  }

  try {
    const snapshot = await db.collection('checkins')
      .where('uid', '==', uid)
      .orderBy('date', 'desc')
      .get();

    const checkins = [];
    snapshot.forEach(doc => {
      checkins.push({ id: doc.id, ...doc.data() });
    });

    return res.json(checkins);
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch check-in history.' });
  }
};

/** Submit check-in, evaluate risk level, trigger alerts on escalation, and update streak */
export const createCheckin = async (req, res) => {
  const { uid, email } = req.user;
  const { phq9Answers, gad7Answers, mood, journalSnippet } = req.body;

  if (!phq9Answers || !gad7Answers || !Array.isArray(phq9Answers) || !Array.isArray(gad7Answers)) {
    return res.status(400).json({ error: 'Bad Request', message: 'phq9Answers and gad7Answers must be arrays of numbers.' });
  }

  const phq9Score = phq9Answers.reduce((sum, val) => sum + Number(val), 0);
  const gad7Score = gad7Answers.reduce((sum, val) => sum + Number(val), 0);
  const phq9Q9Score = Number(phq9Answers[8] || 0);

  const riskLevel = getSingleCheckInRisk(phq9Score, gad7Score, phq9Q9Score);

  if (!db) {
    // Mock Response
    return res.json({
      message: 'DB not connected. Mock evaluation successful.',
      checkin: {
        uid,
        date: new Date().toISOString(),
        phq9Score,
        gad7Score,
        phq9Q9Score,
        riskLevel,
        mood,
        journalSnippet
      },
      evaluation: {
        finalRisk: riskLevel,
        trendFlag: phq9Q9Score >= 1 ? 'q9-override' : null,
        explanation: 'Mock evaluation.'
      }
    });
  }

  try {
    // 1. Fetch user profile for streak updates and pseudonym
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    const userData = userDoc.exists ? userDoc.data() : { pseudonym: 'UnknownUser', streak: 0 };

    // 2. Fetch recent check-ins history
    const historySnapshot = await db.collection('checkins')
      .where('uid', '==', uid)
      .orderBy('date', 'desc')
      .limit(5)
      .get();

    const history = [];
    historySnapshot.forEach(doc => {
      history.push(doc.data());
    });

    // 3. Assemble current check-in data
    const newCheckin = {
      uid,
      date: new Date().toISOString(),
      phq9Score,
      gad7Score,
      phq9Q9Score,
      riskLevel,
      mood: mood || 'okay',
      journalSnippet: journalSnippet || ''
    };

    // Evaluate trends (history + current check-in)
    const allHistory = [newCheckin, ...history];
    const trendResult = getTrendRisk(allHistory);

    // 4. Save check-in to Firestore
    const checkinRef = await db.collection('checkins').add(newCheckin);

    // 5. Update user streak logic
    let newStreak = (userData.streak || 0);
    const now = new Date();
    if (history.length > 0) {
      const lastCheckinDate = new Date(history[0].date);
      const diffTime = Math.abs(now - lastCheckinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) {
        // Checked in today or yesterday, increment streak
        newStreak += 1;
      } else if (diffDays > 2) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First check-in
      newStreak = 1;
    }
    await userDocRef.update({ streak: newStreak });

    // 6. Escalation Triage Alert Generation
    // If the trend analysis flags high risk, we create a counselor alert linking the student's real identity.
    if (trendResult.finalRisk === 'high') {
      const alertDoc = {
        uid,
        pseudonym: userData.pseudonym || 'QuietOwl42',
        realName: userData.realName || email.split('@')[0],
        riskLevel: 'high',
        latestScore: phq9Score + gad7Score,
        trend: trendResult.trendFlag || 'worsening-trend',
        flaggedAt: new Date().toISOString(),
        q9Override: phq9Q9Score >= 1,
        explanation: trendResult.explanation,
        status: 'active' // active, resolved, in-progress
      };

      await db.collection('alerts').add(alertDoc);
      console.log(`🚨 Escalation Triggered for user ${uid}. Alert created.`);
    }

    return res.status(201).json({
      id: checkinRef.id,
      ...newCheckin,
      streak: newStreak,
      evaluation: trendResult
    });
  } catch (error) {
    console.error('Error creating check-in:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not submit check-in.' });
  }
};
