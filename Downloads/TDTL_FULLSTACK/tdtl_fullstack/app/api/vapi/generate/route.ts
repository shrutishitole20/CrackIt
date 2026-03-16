// import { NextResponse } from 'next/server';
// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";
// import {getRandomInterviewCover} from "@/lib/utils";
// import {db} from "@/firebase/admin";
//
// export async function GET() {
//     return NextResponse.json({ success: true, data: 'THANK YOU!' }, { status: 200 });
// }
//
// export async function POST(request: Request) {
//     const { type, role, level, techstack, amount, userid } = await request.json();
//
//     try {
//         const { text:questions } = await generateText({
//             // model: google('gemini-2.0-flash-001'),
//             model: google('gemini-2.0-flash'),
//             prompt: `Prepare questions for a job interview.
// The job role is ${role}.
// The job experience level is ${level}.
// The tech stack used in the job is: ${techstack}.
// The focus between behavioural and technical questions should lean towards: ${type}.
// The amount of questions required is: ${amount}.
// Please return only the questions, without any additional text.
// The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
// Return the questions formatted like this:
// ["Question 1", "Question 2", "Question 3"]
//
// Thank you! <3`,
//         });
//         const interview={
//             role, type, level, techstack:techstack.split(','),
//             questions:JSON.parse(questions),
//             userId:userid,
//             finalized:true,
//             coverImage: getRandomInterviewCover(),
//             createdAt: new Date().toISOString()
//         }
//
//         await db.collection("interviews").add(interview);
//
//         return Response.json({ success: true }, { status: 200 });
//     } catch (error) {
//         console.error("Error generating questions:", error);
//         return Response.json({ success: false, error }, { status: 500 });
//     }
// }

//updated code below
//
// import { NextResponse } from "next/server";
// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";
// import { getRandomInterviewCover } from "@/lib/utils";
// import { db } from "@/firebase/admin";
//
// // ✅ CORS Headers
// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };
//
// // ✅ Handle OPTIONS preflight (important for browser-based requests)
// export async function OPTIONS() {
//     return new Response(null, {
//         status: 204,
//         headers: corsHeaders,
//     });
// }
//
// // ✅ GET method (for simple test)
// export async function GET() {
//     return NextResponse.json(
//         { success: true, data: "THANK YOU!" },
//         { status: 200, headers: corsHeaders }
//     );
// }
//
// // ✅ POST method
// export async function POST(request: Request) {
//     try {
//         const { type, role, level, techstack, amount, userid } = await request.json();
//
//         if (!role || !level || !techstack || !amount || !userid) {
//             return NextResponse.json(
//                 { success: false, error: "Missing required fields" },
//                 { status: 400, headers: corsHeaders }
//             );
//         }
//
//         // Generate interview questions using Google Gemini
//         const { text: questions } = await generateText({
//             model: google("gemini-2.0-flash"),
//             prompt: `Prepare questions for a job interview.
// The job role is ${role}.
// The experience level is ${level}.
// The tech stack is: ${techstack}.
// The focus between behavioural and technical questions should lean towards: ${type}.
// The number of questions required is: ${amount}.
// Return ONLY an array like ["Question 1", "Question 2", "Question 3"].`,
//         });
//
//         // Prepare interview data
//         const interview = {
//             role,
//             type,
//             level,
//             techstack: techstack.split(","),
//             questions: JSON.parse(questions),
//             userId: userid,
//             finalized: true,
//             coverImage: getRandomInterviewCover(),
//             createdAt: new Date().toISOString(),
//         };
//
//         // Store in Firestore
//         await db.collection("interviews").add(interview);
//
//         return NextResponse.json(
//             { success: true, message: "Interview created successfully" },
//             { status: 200, headers: corsHeaders }
//         );
//     } catch (error) {
//         console.error("Error generating interview:", error);
//         return NextResponse.json(
//             { success: false, error: (error as Error).message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }

//Github

import { NextResponse } from 'next/server';
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";

export async function GET() {
    return NextResponse.json({ success: true, data: 'THANK YOU!' }, { status: 200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();

    try {
        const { text:questions } = await generateText({
            // model: google('gemini-2.0-flash-001'),
            model: google('gemini-2.0-flash'),
            prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]

Thank you! <3`,
        });
        const interview={
            role, type, level, techstack:techstack.split(','),
            questions:JSON.parse(questions),
            userId:userid,
            finalized:true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }

        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error generating questions:", error);
        return Response.json({ success: false, error }, { status: 500 });
    }
}
