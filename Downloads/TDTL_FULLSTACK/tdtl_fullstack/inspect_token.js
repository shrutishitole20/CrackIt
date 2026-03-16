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

async function inspectToken() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", "password123");
        const idToken = await userCredential.user.getIdToken();
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        console.log("Token Payload:", payload);
    } catch (e) {
        console.error("Error:", e);
    }
}
inspectToken();
