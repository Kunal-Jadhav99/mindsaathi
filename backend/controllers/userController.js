import { db } from '../config/firebase.js';

// Random animal and adjective lists to auto-generate pseudonyms
const ADJECTIVES = ['Silent', 'Quiet', 'Drifting', 'Wandering', 'Calm', 'Stormy', 'Brave', 'Gentle', 'Pondering', 'Swift'];
const NOUNS = ['Mountain', 'Owl', 'Cloud', 'Reed', 'River', 'Pebble', 'Forest', 'Fox', 'Sprout', 'Echo'];

const generateRandomPseudonym = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
};

const RANDOM_COLORS = ['#7c6af7', '#4ade80', '#60a5fa', '#fbbf24', '#fb923c', '#a78bfa', '#ec4899', '#14b8a6'];

/** Get user profile or create with defaults if it doesn't exist */
export const getProfile = async (req, res) => {
  const { uid, email } = req.user;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected. Please configure Firebase credentials.' });
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // First login — create new user profile with default fields including instituteId
      const newProfile = {
        uid,
        email,
        pseudonym: generateRandomPseudonym(),
        avatarColor: RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)],
        streak: 1,
        joinedAt: new Date().toISOString(),
        role: 'student', // 'student' | 'admin' | 'counsellor'
        instituteId: req.body.instituteId || 'default-institute', // Scoped to college
        department: req.body.department || 'Computer Science',
        onboarded: false
      };

      await userDocRef.set(newProfile);
      return res.status(201).json(newProfile);
    }

    return res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not fetch user profile.' });
  }
};

/** Update user profile (pseudonym, avatar color, instituteId, department, onboarding completion, etc.) */
export const updateProfile = async (req, res) => {
  const { uid } = req.user;
  const { pseudonym, avatarColor, onboarded, role, instituteId, department } = req.body;

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Not Found', message: 'User profile does not exist.' });
    }

    const updates = {};
    if (pseudonym !== undefined) updates.pseudonym = pseudonym;
    if (avatarColor !== undefined) updates.avatarColor = avatarColor;
    if (onboarded !== undefined) updates.onboarded = onboarded;
    if (role !== undefined) updates.role = role;
    if (instituteId !== undefined) updates.instituteId = instituteId;
    if (department !== undefined) updates.department = department;

    await userDocRef.update(updates);

    // Fetch and return the updated document
    const updatedDoc = await userDocRef.get();
    return res.status(200).json(updatedDoc.data());
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Server Error', message: 'Could not update user profile.' });
  }
};

/** Set user role & institute details directly */
export const setRole = async (req, res) => {
  const { uid } = req.user;
  const { role, instituteId } = req.body;

  if (!['student', 'admin', 'counsellor'].includes(role)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid role value.' });
  }

  if (!db) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Database not connected.' });
  }

  try {
    const userDocRef = db.collection('users').doc(uid);
    const updates = { role };
    if (instituteId) updates.instituteId = instituteId;

    await userDocRef.update(updates);
    return res.json({ success: true, role, instituteId: updates.instituteId });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
};
