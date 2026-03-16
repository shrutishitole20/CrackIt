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

async function checkUser() {
    try {
        const user = await getAuth().getUserByEmail("test@example.com");
        console.log(user);
    } catch (e) {
        console.log(e);
    }
}
checkUser();
