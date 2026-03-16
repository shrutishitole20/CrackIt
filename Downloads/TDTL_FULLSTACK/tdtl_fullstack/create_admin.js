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

async function createFreshUser() {
    const email = "admin@test.com";
    const password = "Admin123!";
    try {
        let user;
        try {
            user = await getAuth().getUserByEmail(email);
            console.log("User exists, updating password...");
            await getAuth().updateUser(user.uid, { password });
        } catch (e) {
            console.log("Creating new user...");
            user = await getAuth().createUser({
                email,
                password,
                displayName: "Admin User"
            });
        }
        console.log("SUCCESS! Login with:");
        console.log("Email:", email);
        console.log("Password:", password);
    } catch (error) {
        console.error("FATAL ERROR:", error);
    }
}

createFreshUser();
