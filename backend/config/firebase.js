import admin from 'firebase-admin';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let app = null;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const require = createRequire(import.meta.url);
    const serviceAccount = require('./firebase-service-account.json');

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin SDK initialized with Service Account JSON.');
  } catch (error) {
    console.error('❌ Error initializing Firebase with service account file:', error.message);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin SDK initialized via environment JSON variable.');
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON env variable:', error.message);
  }
} else {
  console.warn(
    '⚠️ WARNING: firebase-service-account.json not found, and no FIREBASE_SERVICE_ACCOUNT_JSON environment variable set.\n' +
    'Firestore and Auth features will throw errors until credentials are provided.'
  );
}

export const db = app ? admin.firestore() : null;
export const auth = app ? admin.auth() : null;
export default admin;
