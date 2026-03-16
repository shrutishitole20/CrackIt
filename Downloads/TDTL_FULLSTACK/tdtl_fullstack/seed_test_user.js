
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

async function createTestUser() {
    try {
        const email = "test@example.com";
        const password = "password123";

        try {
            const userRecord = await getAuth().getUserByEmail(email);
            console.log("User already exists:", userRecord.email);
            await getAuth().updateUser(userRecord.uid, { password });
            console.log("Updated password to password123");
            return;
        } catch (e) {
            if (e.code === "auth/user-not-found") {
                const userRecord = await getAuth().createUser({
                    email,
                    password,
                    displayName: "Test User",
                });
                console.log("Created user:", userRecord.email, "with password:", password);
            } else {
                console.error("Error creating user:", e);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

createTestUser();
