import { auth } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  // If in local development and Firebase is not initialized, we can fall back to mock data
  if (!auth) {
    console.warn('⚠️ Firebase Auth not initialized. Using Mock Auth bypass for testing.');
    req.user = {
      uid: 'mock-uid-123',
      email: 'student@college.edu',
      name: 'Mock Student'
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No bearer token provided.' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      ...decodedToken
    };
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Forbidden', message: 'Invalid or expired token.' });
  }
};
