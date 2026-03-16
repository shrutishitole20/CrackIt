// // 'use server'
// //
// // import {db, auth} from "@/firebase/admin";
// // import {cookies} from "next/headers";
// // import type { User } from '@/types';
// // const ONE_WEEK = 60 * 60 * 24 * 7;
// // type SignUpParams = {
// //     uid: string;
// //     name: string;
// //     email: string;
// // };
// //
// // type SignInParams = {
// //     email: string;
// //     idToken: string;
// // };
// //
// // export async function signUp(params: SignUpParams){
// //     const{ uid,name,email }=params;
// //
// //     try{
// //         const userRecord = await db.collection('users').doc(uid).get();
// //
// //         if(userRecord.exists){
// //             return {
// //                 success: false,
// //                 message: `User already exists!Please sign in instead.`
// //             }
// //         }
// //
// //         await db.collection('users').doc(uid).set({
// //             name, email
// //         })
// //         return {
// //             success: true,
// //             message: `Account created Successfully! Please Sign In!`
// //         }
// //     }catch(e: any){
// //         console.error('Error creating an user',e);
// //
// //         if(e.code === 'auth/email-already-exists'){
// //             return {
// //                 success: false,
// //                 message:"Email already exists."
// //             }
// //         }
// //
// //         return{
// //             success: false,
// //             message:"Failed to create an Account."
// //         }
// //     }
// // }
// //
// // export async function signIn(params: SignInParams){
// //     const{ email, idToken }=params;
// //
// //     try{
// //         const userRecord =await auth.getUserByEmail(email);
// //
// //         if(!userRecord){
// //             return {
// //                 success: false,
// //                 message:"User does not exists. Create an account instead."
// //             }
// //         }
// //         await setSessionCookie(idToken);
// //
// //     }catch(e){
// //         console.log(e);
// //         return {
// //             success: false,
// //             message:"Failed to login an Account."
// //         }
// //     }
// // }
// //
// // export async function setSessionCookie(idToken:string){
// //     const cookieStore=await cookies();
// //
// //     const sessionCookie=await auth.createSessionCookie(idToken,{
// //         expiresIn: ONE_WEEK* 1000,
// //     })
// //
// //     cookieStore.set('session',sessionCookie,{
// //         maxAge: ONE_WEEK,
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === 'production',
// //         path:'/',
// //         sameSite:'lax'
// //
// //     })
// // }
// //
// // export async function getCurrentUser(): Promise<User | null> {
// //     const cookieStore = cookies();
// //     const sessionCookie = cookieStore.get('session')?.value;
// //
// //     if (!sessionCookie) return null;
// //
// //     try {
// //         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
// //
// //         const userRecord = await db
// //             .collection('users')
// //             .doc(decodedClaims.uid)
// //             .get();
// //
// //         if (!userRecord.exists) {
// //             return null;
// //         }
// //
// //         return {
// //             ...userRecord.data(),
// //             id: userRecord.id,
// //         } as User;
// //     } catch (e) {
// //         console.log("Failed to get current user:", e);
// //         return null;
// //     }
// // }
// //
// // export async function isAuthenticated(){
// //     const user=await getCurrentUser();
// //     return !!user;
// // }
//
// 'use server';
//
// import { db, auth } from "@/firebase/admin";
// import { cookies } from "next/headers";
// import type { User } from "@/types";
//
// const ONE_WEEK = 60 * 60 * 24 * 7;
//
// type SignUpParams = {
//     uid: string;
//     name: string;
//     email: string;
// };
//
// type SignInParams = {
//     email: string;
//     idToken: string;
// };
//
// // Sign Up Function
// export async function signUp(params: SignUpParams) {
//     const { uid, name, email } = params;
//
//     try {
//         const userRecord = await db.collection("users").doc(uid).get();
//
//         if (userRecord.exists) {
//             return {
//                 success: false,
//                 message: "User already exists! Please sign in instead.",
//             };
//         }
//
//         await db.collection("users").doc(uid).set({
//             name,
//             email,
//         });
//
//         return {
//             success: true,
//             message: "Account created successfully! Please sign in.",
//         };
//     } catch (e: any) {
//         console.error("Error creating user:", e);
//
//         if (e.code === "auth/email-already-exists") {
//             return {
//                 success: false,
//                 message: "Email already exists.",
//             };
//         }
//
//         return {
//             success: false,
//             message: "Failed to create an account.",
//         };
//     }
// }
//
// // Sign In Function
// export async function signIn(params: SignInParams) {
//     const { email, idToken } = params;
//
//     try {
//         const userRecord = await auth.getUserByEmail(email);
//
//         if (!userRecord) {
//             return {
//                 success: false,
//                 message: "User does not exist. Please sign up first.",
//             };
//         }
//
//         await setSessionCookie(idToken);
//
//         return {
//             success: true,
//             message: "Successfully signed in!",
//         };
//     } catch (e) {
//         console.error("Sign-in error:", e);
//         return {
//             success: false,
//             message: "Failed to sign in.",
//         };
//     }
// }
//
// // Set Session Cookie
// export async function setSessionCookie(idToken: string) {
//     const cookieStore = cookies();
//
//     const sessionCookie = await auth.createSessionCookie(idToken, {
//         expiresIn: ONE_WEEK * 1000,
//     });
//
//     cookieStore.set("session", sessionCookie, {
//         maxAge: ONE_WEEK,
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//         sameSite: "lax",
//     });
// }
//
// // Get Current User from Session
// export async function getCurrentUser(): Promise<User | null> {
//     const cookieStore = cookies();
//     const sessionCookie = cookieStore.get("session")?.value;
//
//     if (!sessionCookie) return null;
//
//     try {
//         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
//
//         const userRecord = await db
//             .collection("users")
//             .doc(decodedClaims.uid)
//             .get();
//
//         if (!userRecord.exists) {
//             return null;
//         }
//
//         return {
//             ...userRecord.data(),
//             id: userRecord.id,
//         } as User;
//     } catch (e) {
//         console.error("Failed to get current user:", e);
//         return null;
//     }
// }
// // ✅ Updated getCurrentUser
// // export async function getCurrentUser(): Promise<User | null> {
// //     const session = cookies().get("session"); // call inside the function
// //     const sessionCookie = session?.value;
// //
// //     if (!sessionCookie) return null;
// //
// //     try {
// //         const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
// //
// //         const userRecord = await db
// //             .collection("users")
// //             .doc(decodedClaims.uid)
// //             .get();
// //
// //         if (!userRecord.exists) return null;
// //
// //         return {
// //             ...userRecord.data(),
// //             id: userRecord.id,
// //         } as User;
// //     } catch (e) {
// //         console.error("Failed to get current user:", e);
// //         return null;
// //     }
// // }
//
// // import { cookies } from "next/headers";
// // import { decryptSession } from "./utils"; // your session utility if applicable
// // import type { User } from "@/types";
//
// // export async function getCurrentUser(): Promise<User | null> {
// //     const cookieStore = await cookies();
// //     const session = cookieStore.get("session");
// //
// //     const sessionCookie = session?.value;
// //
// //     if (!sessionCookie) return null;
// //
// //     // Decrypt or parse your session as needed
// //     const user = await decryptSession(sessionCookie);
// //     return user;
// // }
//
//
// // Check if User is Authenticated
// export async function isAuthenticated() {
//     const user = await getCurrentUser();
//     return !!user;
// }
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import {GetLatestInterviewsParams, Interview, SignInParams, SignUpParams, User} from "@/types";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    try {
        // Create session cookie
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: SESSION_DURATION * 1000, // milliseconds
        });

        // Set cookie in the browser
        cookieStore.set("session", sessionCookie, {
            maxAge: SESSION_DURATION,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });
    } catch (e: any) {
        console.error("--- SESSION COOKIE CREATION FAILED ---");
        console.error("Error Code:", e.code);
        console.error("Error Info:", JSON.stringify(e.errorInfo, null, 2));
        console.error("Full Error:", e);
        throw e;
    }
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
            // profileURL,
            // resumeURL,
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (e: any) {
        console.error("=== signUp ERROR ===");
        console.error("Code:", e.code);
        console.error("Message:", e.message);
        console.error("Full error:", e);
        console.error("===================");

        if (e.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use.",
            };
        }

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { idToken } = params;

    console.log("=== signIn Action Execution ===");
    console.log("Environment FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
    console.log("Admin SDK Internal Project ID:", (auth.app as any).options.projectId);
    console.log("ID Token typeof:", typeof idToken);
    console.log("ID Token preview:", idToken ? `${idToken.substring(0, 20)}...` : "UNDEFINED");
    
    try {
        if (!idToken || typeof idToken !== 'string') {
            throw new Error(`Invalid idToken passed to server: ${typeof idToken}`);
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (e: any) {
        console.error("=== signIn server action ERROR ===");
        console.error("Code:", e.code);
        console.error("Message:", e.message);
        console.error("Full error:", e);
        console.error("==================================");

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Sign out user by clearing the session cookie
export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log("Session verified for UID:", decodedClaims.uid);

        // get user info from db
        const userRef = db.collection("users").doc(decodedClaims.uid);
        const userRecord = await userRef.get();
        
        if (!userRecord.exists) {
            console.log("User record not found in Firestore for UID:", decodedClaims.uid, ". Auto-creating basic profile...");
            // If missing, create a basic profile from the token claims
            const newUser = {
                name: decodedClaims.name || decodedClaims.email?.split('@')[0] || "User",
                email: decodedClaims.email || "",
                createdAt: new Date().toISOString()
            };
            await userRef.set(newUser);
            return {
                ...newUser,
                id: decodedClaims.uid
            } as User;
        }

        console.log("User record found in Firestore!");
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error: any) {
        console.log("Failed to verify session or fetch user:", error.message);
        // Invalid or expired session
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function getInterviewsByUserId(userId:string):Promise<Interview[] | null>{
    const interviews=await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterview(params: GetLatestInterviewsParams): Promise<Interview[] | null>{
    const { userId, limit=20 } =params;
    const interviews=await db
        .collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized' , '==', 'true')
        .where('userId', "!=" , userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];

}