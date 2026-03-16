const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

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

async function checkCollision() {
    const email = "test@example.com";
    const pass = "password123";
    try {
        console.log("Trying to create user that Admin SDK says exists:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        console.log("SUCCESS: Client SDK created the user! This means Client SDK and Admin SDK are in DIFFERENT PROJECTS.");
        console.log("Client UID:", userCredential.user.uid);
    } catch (e) {
        if (e.code === "auth/email-already-in-use") {
            console.log("COLLISION: Client SDK says email is already in use. They are in the SAME PROJECT.");
        } else {
            console.error("Unexpected error:", e);
        }
    }
}
checkCollision();
