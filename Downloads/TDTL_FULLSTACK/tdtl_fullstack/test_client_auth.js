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

async function testFirebaseClient() {
    const testEmail = "test_client_" + Date.now() + "@example.com";
    const testPass = "password123";
    try {
        console.log("Testing client signup with", testEmail);
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPass);
        console.log("Created successfully! UID:", userCredential.user.uid);
        
        await auth.signOut();
        
        console.log("Testing client signin...");
        const signinCredential = await signInWithEmailAndPassword(auth, testEmail, testPass);
        console.log("Signed in successfully! UID:", signinCredential.user.uid);
    } catch (e) {
        console.error("Firebase error details:", e);
    }
}
testFirebaseClient();
