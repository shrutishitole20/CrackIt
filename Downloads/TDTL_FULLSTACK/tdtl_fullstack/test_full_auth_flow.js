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

const app = initializeApp({
    credential: cert({
        projectId,
        clientEmail,
        privateKey,
    }),
    projectId,
});

async function verifyToken() {
    // We already know this config works to get a token
    const { initializeApp: initClient } = require("firebase/app");
    const { getAuth: getClientAuth, signInWithEmailAndPassword } = require("firebase/auth");

    const firebaseConfig = {
        apiKey: "AIzaSyBCCqW-0O_KvQWlgZv5ntK985UhuJX03II",
        authDomain: "my-interview-platform-53fbe.firebaseapp.com",
        projectId: "my-interview-platform-53fbe",
        storageBucket: "my-interview-platform-53fbe.firebasestorage.app",
        messagingSenderId: "524020449866",
        appId: "1:524020449866:web:c98814cf072cbc9aa65cb3",
        measurementId: "G-E0H99L3DQJ"
    };

    const clientApp = initClient(firebaseConfig);
    const clientAuth = getClientAuth(clientApp);

    try {
        console.log("Signing in on client...");
        const userCredential = await signInWithEmailAndPassword(clientAuth, "test@example.com", "password123");
        const idToken = await userCredential.user.getIdToken();
        console.log("Token acquired. Length:", idToken.length);

        console.log("Verifying token on admin SDK...");
        try {
            const decodedToken = await getAuth(app).verifyIdToken(idToken);
            console.log("SUCCESS: Token verified! UID:", decodedToken.uid);
            
            console.log("Trying to create session cookie...");
            const sessionCookie = await getAuth(app).createSessionCookie(idToken, { expiresIn: 60 * 60 * 1000 });
            console.log("SUCCESS: Session cookie created!");
        } catch (adminError) {
            console.error("ADMIN ERROR:", adminError.code, adminError.message);
            if (adminError.errorInfo) console.error("Error Info:", JSON.stringify(adminError.errorInfo, null, 2));
        }
    } catch (clientError) {
        console.error("CLIENT ERROR:", clientError.code, clientError.message);
    }
}

verifyToken();
