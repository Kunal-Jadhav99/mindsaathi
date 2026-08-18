// ============================================================
// MindSaathi — Database Seed Script (2 Days of Data)
// Populates Firestore with students, 2 days of check-ins, & alerts
// ============================================================

import 'dotenv/config';
import { db } from '../config/firebase.js';

if (!db) {
  console.error('\n❌ Firebase Database connection failed.');
  console.error('Please ensure one of the following is present:');
  console.error(' 1. backend/config/firebase-service-account.json file');
  console.error(' 2. FIREBASE_SERVICE_ACCOUNT_JSON environment variable in backend/.env\n');
  process.exit(1);
}

const INSTITUTE_ID = process.env.INSTITUTE_ID || 'default-institute';

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

const AVATAR_COLORS = ['#7c6af7', '#4ade80', '#60a5fa', '#fbbf24', '#fb923c', '#a78bfa'];

async function seedDatabase() {
  console.log(`\n🌱 Starting MindSaathi database seeding (2 days of data) for institute: '${INSTITUTE_ID}'...`);

  try {
    const batch = db.batch();
    const now = new Date();

    let userCount = 0;
    let checkinCount = 0;
    let alertCount = 0;

    for (let i = 0; i < STUDENTS.length; i++) {
      const s = STUDENTS[i];
      const uid = `demo_std_${i + 1}`;

      // 1. Insert into 'users' collection
      const userRef = db.collection('users').doc(uid);
      batch.set(userRef, {
        uid,
        email: s.email,
        realName: s.name,
        pseudonym: s.pseudo,
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        streak: 2,
        joinedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        role: 'student',
        instituteId: INSTITUTE_ID,
        department: s.dept,
        onboarded: true
      });
      userCount++;

      // 2. Insert exactly 2 days of check-ins (Day 1: Yesterday, Day 2: Today)
      for (let dayOffset = 1; dayOffset >= 0; dayOffset--) {
        const checkinDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        
        let phq9Score = 4;
        let gad7Score = 3;
        let riskLevel = 'low';
        let phq9Q9Score = 0;

        if (s.risk === 'high') {
          // Day 1: Moderate -> Day 0 (Today): Escalated High
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
          instituteId: INSTITUTE_ID,
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
        checkinCount++;
      }

      // 3. Insert active escalations into 'alerts' collection for high-risk students
      if (s.risk === 'high') {
        const alertRef = db.collection('alerts').doc();
        batch.set(alertRef, {
          uid,
          instituteId: INSTITUTE_ID,
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
        alertCount++;
      }
    }

    // Commit batch to Firestore
    await batch.commit();

    console.log('✅ 2-Day Seeding completed successfully!');
    console.log(`   👥 Students created : ${userCount}`);
    console.log(`   📋 Check-ins logged : ${checkinCount} (2 per student)`);
    console.log(`   🚨 Alerts generated : ${alertCount}`);
    console.log(`\n🎉 Data is ready for analysis in the Admin Dashboard.\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
