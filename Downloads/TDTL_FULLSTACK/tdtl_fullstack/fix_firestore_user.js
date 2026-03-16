const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

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

const db = getFirestore();

async function checkUserFirestore() {
    try {
        const email = "test@example.com";
        const user = await getAuth().getUserByEmail(email);
        console.log("Found user in Auth:", user.uid);
        
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
            console.log("Found user in Firestore:", doc.data());
        } else {
            console.log("User NOT found in Firestore. Creating it now...");
            await db.collection("users").doc(user.uid).set({
                name: "Test User",
                email: email,
                createdAt: new Date().toISOString()
            });
            console.log("User created in Firestore!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

checkUserFirestore();
