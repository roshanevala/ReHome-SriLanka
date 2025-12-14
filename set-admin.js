// Run this script with: node set-admin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = '3WorweSMBMX2Jla1NogBHGmEffI3';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin claim set successfully for user:', uid);
    console.log('The user needs to sign out and sign in again for the claims to take effect.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  });
