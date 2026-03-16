const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyCk-gTiLDOwJFRwCBZARG16hgxD84riglk",
    authDomain: "my-interview-platform-53fbe.firebaseapp.com",
    projectId: "my-interview-platform-53fbe",
    storageBucket: "my-interview-platform-53fbe.firebasestorage.app",
    messagingSenderId: "782765122293",
    appId: "1:782765122293:web:49df9bbe4c343f618a1bbc",
    measurementId: "G-51NLHYYFD6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function syncUser() {
    const email = "test@example.com";
    const pass = "password123";
    try {
        console.log("Ensuring user exists in CLIENT project...");
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            console.log("Created user in CLIENT project.");
        } catch (e) {
            if (e.code === "auth/email-already-in-use") {
                console.log("User already exists in CLIENT project. Signing in to verify...");
                await signInWithEmailAndPassword(auth, email, pass);
                console.log("Success: Password matches in CLIENT project.");
            } else {
                throw e;
            }
        }
    } catch (e) {
        console.error("Sync failed:", e.code, e.message);
    }
}
syncUser();
