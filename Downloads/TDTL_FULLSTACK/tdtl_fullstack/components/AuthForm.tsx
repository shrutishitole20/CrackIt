"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
// unused import removed
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";
//new verison of toast from shadcn



type FormType = 'sign-in' | 'sign-up';

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

const authFormSchema=(type:FormType)=>{
    return z.object({
        name: type ==='sign-up' ? z.string().min(3):z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
    })
}

const AuthForm = ({ type }:{ type:FormType }) => {

    const router = useRouter()
    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:"",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;

                // Step 1: Create user in Firebase Auth (client SDK)
                let userCredentials;
                try {
                    userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                } catch (firebaseError: any) {
                    // Use warn instead of error so it doesn't look like an unhandled exception in the browser console
                    console.warn("Firebase sign-up error:", firebaseError.code, firebaseError.message);
                    
                    if (firebaseError.code === "auth/email-already-in-use") {
                        toast.error("This email is already registered. Redirecting to sign in...");
                        router.push("/sign-in");
                    } else if (firebaseError.code === "auth/weak-password") {
                        toast.error("Password is too weak. Use at least 6 characters.");
                    } else if (firebaseError.code === "auth/invalid-email") {
                        toast.error("Invalid email address.");
                    } else {
                        toast.error(`Sign up failed: ${firebaseError.message}`);
                    }
                    return;
                }

                // Step 2: Save user profile to Firestore via server action
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                });

                console.log("signUp server action result:", result);

                if (!result?.success) {
                    // Firebase Auth user was created, but Firestore save failed.
                    // This often means Firebase Admin SDK env vars are missing/wrong.
                    // Try to sign the user in anyway so they are not stuck.
                    console.warn("Firestore save failed, attempting direct sign-in:", result?.message);

                    try {
                        const idToken = await userCredentials.user.getIdToken();
                        const signInResult = await signIn({ email, idToken });
                        if (signInResult?.success) {
                            toast.success("Account created! Signing you in...");
                            window.location.href = "/";
                            return;
                        }
                    } catch (fallbackError) {
                        console.error("Fallback sign-in also failed:", fallbackError);
                    }

                    toast.error(result?.message || "Account setup failed. Please try signing in.");
                    return;
                }

                toast.success("Account created! Please sign in.");
                router.push("/sign-in");

            } else {
                const { email, password } = values;

                // Step 1: Sign in with Firebase client SDK
                let userCredential;
                try {
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                } catch (firebaseError: any) {
                    console.error("Firebase sign-in error:", firebaseError.code, firebaseError.message);
                    if (
                        firebaseError.code === "auth/invalid-credential" ||
                        firebaseError.code === "auth/wrong-password" ||
                        firebaseError.code === "auth/user-not-found"
                    ) {
                        toast.error("Invalid email or password. Please try again.");
                    } else if (firebaseError.code === "auth/too-many-requests") {
                        toast.error("Too many failed attempts. Please try again later.");
                    } else {
                        toast.error(`Sign in failed: ${firebaseError.message}`);
                    }
                    return;
                }

                // Step 2: Get ID token
                const idToken = await userCredential.user.getIdToken();
                if (!idToken) {
                    toast.error("Could not get authentication token. Please try again.");
                    return;
                }

                // Step 3: Create server-side session cookie
                const result = await signIn({ email, idToken });
                console.log("signIn server action result:", result);

                if (!result?.success) {
                    toast.error(result?.message || "Session creation failed. Please try again.");
                    return;
                }

                toast.success("Signed in successfully!");
                // Full page navigation so server layout re-reads the session cookie
                window.location.href = "/";
            }
        } catch (error: any) {
            console.error("Unexpected auth error:", error);
            toast.error(error?.message || "Something went wrong. Please try again.");
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className={"text-primary-100"}>CrackIT AI</h2>
                </div>

                <h3>Practice Your Job Interviews With AI</h3>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">

                    {!isSignIn && (
                        <FormField control={form.control} name="name" label="Name" placeholder="Your Name" />
                    ) }

                    <FormField control={form.control} name="email" label="Email" placeholder="Your Email Address" type="email" />
                    <FormField control={form.control} name="password" label="Password" placeholder="Enter Your Password" type="password" />

                    <Button className="btn" type="submit" suppressHydrationWarning>{isSignIn ? 'Sign In' : 'Create an Account'}</Button>
                </form>
            </Form>

                <p className="text-center">
                    {isSignIn ? "No account yet?" :"Have an account already?"}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1" >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
        </div>
    </div>

    )
}
export default AuthForm
