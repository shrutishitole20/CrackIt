import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
    const apps = getApps();

    if (!apps.length) {
        const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
        let privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
        
        console.log("--- ADMIN SDK INITIALIZING ---");
        console.log("Project ID from ENV:", projectId);
        console.log("Client Email from ENV:", clientEmail);

        if (privateKey) {
            // Strip exact wrapping quotes if DOTENV left them
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.slice(1, -1);
            }
            // Replace escaped newlines
            privateKey = privateKey.replace(/\\n/g, "\n");
        }

        try {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
                projectId, 
            });
            console.log("Admin SDK Initialized successfully for project:", projectId);
        } catch (error) {
            console.error("Admin SDK Initialization Failed:", error);
        }
    }

    return {
        auth: getAuth(),
        db: getFirestore(),
    };
}

export const { auth, db } = initFirebaseAdmin();
