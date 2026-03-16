require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

if (privateKey) {
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");
}

initializeApp({
    credential: cert({
        projectId,
        clientEmail,
        privateKey,
    }),
    projectId,
});

async function listAllUsers(nextPageToken) {
  try {
    const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
    listUsersResult.users.forEach((userRecord) => {
      console.log('user', userRecord.toJSON());
    });
    if (listUsersResult.pageToken) {
      listAllUsers(listUsersResult.pageToken);
    }
  } catch (error) {
    console.log('Error listing users:', error);
  }
}

listAllUsers();
