const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

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

async function testSignIn() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", "password123");
        console.log("Signed in successfully!", userCredential.user.uid);
    } catch (error) {
        console.error("Sign in failed:", error.code, error.message);
    }
}

testSignIn();
