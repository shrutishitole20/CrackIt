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

async function testSignIn() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", "password123");
        console.log("SUCCESS: Client SDK signed in to the core project! UID:", userCredential.user.uid);
    } catch (error) {
        console.error("FAILED: Client SDK sign-in error:", error.code, error.message);
    }
}

testSignIn();
