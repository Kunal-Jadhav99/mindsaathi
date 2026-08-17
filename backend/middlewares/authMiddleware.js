import { auth } from '../config/firebase.js';
import { db } from '../config/firebase.js';

/** Verify Firebase ID token and attach user data to req.user */
export const verifyToken = async (req, res, next) => {
  if (!auth) {
    return res.status(503).json({ error: 'Service Unavailable', message: 'Firebase Auth not initialized. Please configure credentials.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No bearer token provided.' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);

    // Fetch full user profile from Firestore to get role and instituteId
    let userProfile = {};
    if (db) {
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        userProfile = userDoc.data();
      }
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      role: userProfile.role || 'student',
      instituteId: userProfile.instituteId || null,
      ...decodedToken
    };
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Forbidden', message: 'Invalid or expired token.' });
  }
};

/** Middleware: restrict access to admin or counsellor roles only */
export const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin' && role !== 'counsellor') {
    return res.status(403).json({ error: 'Forbidden', message: 'This endpoint is restricted to counsellors and admins.' });
  }
  next();
};

/** Middleware: ensure user has an instituteId attached */
export const requireInstitute = (req, res, next) => {
  if (!req.user.instituteId) {
    return res.status(403).json({ error: 'Forbidden', message: 'User is not associated with any institute.' });
  }
  next();
};
