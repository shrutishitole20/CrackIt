'use client';

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface AgentProps {
    userName: string;
    userId: string;
    type?: string;
    interviewId?: string;
    questions?: string[];
    feedbackId?: string;
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {
                    role: message.role as "user" | "system" | "assistant",
                    content: message.transcript
                };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: any) => {
            console.error("--- VAPI ERROR DETECTED ---");
            console.log("Detailed Error Payload:", error);
            
            let message = "Unknown Voice AI Error";
            let code = error?.code || "N/A";

            // Vapi often nests the root cause in error.error or error.message
            if (error?.error?.message) {
                message = error.error.message;
            } else if (error?.message) {
                message = error.message;
            }

            console.error(`Root Cause: ${message} (Code: ${code})`);

            if (message.includes("OpenAI") || message.includes("401")) {
                alert(`Vapi Error: ${message}. \n\nHINT: Check if your OpenAI API Key is added to the Vapi Dashboard Keys section.`);
            } else if (message.includes("balance") || message.includes("credit")) {
                alert(`Vapi Error: ${message}. \n\nHINT: You might need to add credits to your Vapi or OpenAI account.`);
            } else {
                alert(`Vapi Error: ${message}`);
            }
            
            setCallStatus(CallStatus.INACTIVE);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.stop();
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        if (!messages || messages.length === 0) {
            router.push('/');
            return;
        }

        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        });

        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`);
        } else {
            router.push("/");
        }
    };

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [callStatus, messages, type, interviewId, router, userId]);

    const handleCall = async () => {
        // 1. Check if the browser supports mediaDevices (requires HTTPS or localhost)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("MediaDevices API not found. This feature requires a secure context (HTTPS or localhost).");
            alert("Error: Microphone access is not supported by your browser in this context. Please ensure you are using 'http://localhost:3000' and not an IP address.");
            return;
        }

        // 2. Check for microphone permission
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Just checking, then stop
        } catch (err) {
            console.error("Microphone access denied:", err);
            alert("Please allow microphone access to start the interview.");
            setCallStatus(CallStatus.INACTIVE);
            return;
        }

        setCallStatus(CallStatus.CONNECTING);

        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        const publicToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

        if (!publicToken) {
            console.error("ERROR: NEXT_PUBLIC_VAPI_WEB_TOKEN is missing!");
            setCallStatus(CallStatus.INACTIVE);
            return;
        }

        try {
            console.log("--- STARTING VAPI CALL ---");
            console.log("Mode:", type);
            console.log("Public Token (Masked):", publicToken.substring(0, 8) + "...");
            
            if (!publicToken.includes("public") && publicToken.length < 50) {
                console.warn("WARNING: Your NEXT_PUBLIC_VAPI_WEB_TOKEN looks like an Assistant ID, not a Public Key.");
                console.warn("Go to Vapi Dashboard > Settings to find your 'Public Key'.");
            }
            
            if (type === "generate") {
                if (!workflowId) {
                    throw new Error("Missing NEXT_PUBLIC_VAPI_WORKFLOW_ID for 'generate' mode");
                }
                console.log("Using Workflow/Assistant ID:", workflowId);
                
                await vapi.start(workflowId, {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                });
            } else {
                console.log("Using Custom Assistant Object from Constants");

                let formattedQuestions = "";
                if (questions) {
                    formattedQuestions = questions
                        .map((question) => `- ${question}`)
                        .join("\n");
                }
                
                if (!interviewer) {
                    throw new Error("Interviewer configuration is missing in @/constants");
                }

                // Prepare a clean copy of the assistant to avoid mutation issues
                const assistantConfig = {
                    ...interviewer,
                    variableValues: {
                        questions: formattedQuestions || "No specific questions provided.",
                        username: userName
                    }
                };

                console.log("Assistant Payload Preview:", assistantConfig.name);

                await vapi.start(assistantConfig as any);
            }
        } catch (error: any) {
            console.error("--- VAPI START REJECTED BY SDK ---");
            console.error("Error Object:", error);
            // Try to extract a message if it's hidden in the prototype or nested
            const errorMessage = error.message || (error.error ? error.error.message : "Unknown Vapi Rejection");
            console.error("Interpreted Error:", errorMessage);
            
            alert(`Voice AI Error: ${errorMessage}. Please check your Vapi Dashboard for missing API keys (like OpenAI or 11Labs).`);
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished =
        callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="AI Interviewer"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="User avatar"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p
                            key={latestMessage}
                            className={cn(
                                "transition-opacity duration-500 opacity-0",
                                "animate-fadeIn opacity-100"
                            )}
                        >
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                        className="relative btn-call"
                        onClick={handleCall}
                        disabled={callStatus === CallStatus.CONNECTING}
                    >
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== CallStatus.CONNECTING && "hidden"
                            )}
                        />
                        <span>{isCallInactiveOrFinished ? "Start Interview" : "Connecting..."}</span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End Session
                    </button>
                )}
            </div>
        </div>
    );
};

export default Agent;