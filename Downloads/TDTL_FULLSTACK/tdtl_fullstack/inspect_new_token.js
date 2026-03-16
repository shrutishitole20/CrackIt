const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyBCCqW-0O_KvQWlgZv5ntK985UhuJX03II",
    authDomain: "my-interview-platform-53fbe.firebaseapp.com",
    projectId: "my-interview-platform-53fbe",
    storageBucket: "my-interview-platform-53fbe.firebasestorage.app",
    messagingSenderId: "524020449866",
    appId: "1:524020449866:web:c98814cf072cbc9aa65cb3",
    measurementId: "G-E0H99L3DQJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function inspectToken() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", "password123");
        const idToken = await userCredential.user.getIdToken();
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        console.log("Token Payload AUD:", payload.aud);
        console.log("Token Payload ISS:", payload.iss);
    } catch (e) {
        console.error("Error:", e);
    }
}
inspectToken();
