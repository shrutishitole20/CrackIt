// // import React from 'react'
// // import {Button} from "@/components/ui/button";
// // import Link from "next/link";
// // import Image from "next/image";
// // import {dummyInterviews} from "@/constants";
// // import InterviewCard from "@/components/InterviewCard";
// //
// // const Page = () => {
// //     return (
// //         <>
// //         <section className="card-cta">
// //             <div className="flex flex-col gap-6 max-w-lg">
// //                 <h2>Get Interview Ready with AI-powered Practice & Feedback</h2>
// //                 <p className="text-lg">Practice on real Interview Questions & get instant Feedback.</p>
// //                 <Button asChild className="btn-primary max-sm:w-full">
// //                     <Link href="/interview">Start an Interview</Link>
// //                 </Button>
// //             </div>
// //
// //             <Image
// //                 src="/img_1.png"
// //                 alt="robo-dude"
// //                 width={0}
// //                 height={0}
// //                 sizes="(max-width: 720px) 100vw, 400px"
// //                 className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
// //             />
// //         </section>
// //
// //             <section className="flex flex-col gap-6 mt-8 ">
// //                 <h2>Your Interviews</h2>
// //                 <div className="interviews-section">
// //
// //                     {dummyInterviews.map((interview) => (
// //                         <InterviewCard {...interview} key={interview.id}
// //                         />
// //                     ))}
// //                 </div>
// //             </section>
// //
// //             <section className="flex flex-col gap-6 mt-8 ">
// //                 <h2>Take an Interview </h2>
// //                 <div className="interviews-section">
// //                     {dummyInterviews.map((interview) => (
// //                         <InterviewCard {...interview} key={interview.id}
// //                                         />
// //                     ))}
// //                     {/*<p>You haven&apos;t taken any interviews yet!</p>*/}
// //                 </div>
// //             </section>
// //         </>
// //     )
// // }
// // export default Page
//
// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
//
// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
//
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import {
//     getInterviewsByUserId,
//     getLatestInterviews,
// } from "@/lib/actions/general.action";
//
// async function Home() {
//     const user = await getCurrentUser();
//
//     // 🔁 Redirect to /signup if no user is logged in
//     if (!user) {
//         redirect("/signup");
//     }
//
//     const [userInterviews, allInterview] = await Promise.all([
//         getInterviewsByUserId(user.id),
//         getLatestInterviews({ userId: user.id }),
//     ]);
//
//     const hasPastInterviews = Array.isArray(userInterviews) && userInterviews.length > 0;
//     const hasUpcomingInterviews = Array.isArray(allInterview) && allInterview.length > 0;
//
//
//     return (
//         <>
//             <section className="card-cta">
//                 <div className="flex flex-col gap-6 max-w-lg">
//                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//                     <p className="text-lg">
//                         Practice real interview questions & get instant feedback
//                     </p>
//
//                     <Button asChild className="btn-primary max-sm:w-full">
//                         <Link href="/interview">Start an Interview</Link>
//                     </Button>
//                 </div>
//
//                 <Image
//                                 src="/img_1.png"
//                                 alt="robo-dude"
//                                 width={0}
//                                 height={0}
//                                 sizes="(max-width: 720px) 100vw, 400px"
//                                 className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
//                             />
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Your Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasPastInterviews ? (
//                         userInterviews?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>You haven&apos;t taken any interviews yet</p>
//                     )}
//                 </div>
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Take Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasUpcomingInterviews ? (
//                         allInterview?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>There are no interviews available</p>
//                     )}
//                 </div>
//             </section>
//         </>
//     );
// }
//
// export default Home;
// //
// import Link from "next/link";
// import Image from "next/image";
//
// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
//
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import {
//     getInterviewsByUserId,
//     getLatestInterviews,
// } from "@/lib/actions/general.action";
//
// async function Home() {
//     const user = await getCurrentUser();
//
//     const [userInterviews, allInterview] = await Promise.all([
//         getInterviewsByUserId(user?.id!),
//         getLatestInterviews({ userId: user?.id! }),
//     ]);
//
//     const hasPastInterviews = userInterviews?.length! > 0;
//     const hasUpcomingInterviews = allInterview?.length! > 0;
//
//     return (
//         <>
//             <section className="card-cta">
//                 <div className="flex flex-col gap-6 max-w-lg">
//                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//                     <p className="text-lg">
//                         Practice real interview questions & get instant feedback
//                     </p>
//
//                     <Button asChild className="btn-primary max-sm:w-full">
//                         <Link href="/interview">Start an Interview</Link>
//                     </Button>
//                 </div>
//
//                 <Image
//                                                 src="/img_1.png"
//                                                 alt="robo-dude"
//                                                 width={0}
//                                                 height={0}
//                                                 sizes="(max-width: 720px) 100vw, 400px"
//                                                 className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
//                                             />
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Your Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasPastInterviews ? (
//                         userInterviews?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user?.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>You haven&apos;t taken any interviews yet</p>
//                     )}
//                 </div>
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Take Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasUpcomingInterviews ? (
//                         allInterview?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user?.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>There are no interviews available</p>
//                     )}
//                 </div>
//             </section>
//         </>
//     );
// }
//
// export default Home;

//
// import Link from "next/link";
// import Image from "next/image";
//
// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
//
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import {
//     getInterviewsByUserId,
//     getLatestInterviews,
// } from "@/lib/actions/general.action";
//
// export default async function Home() {
//     const user = await getCurrentUser();
//
//     //  Redirect or fallback if no user is found
//     if (!user?.id) {
//         return (
//             <div className="text-center mt-10">
//                 <h2 className="text-xl font-semibold">You must be logged in.</h2>
//                 <Link href="/sign-in" className="text-blue-600 underline mt-2 inline-block">
//                     Go to Sign In
//                 </Link>
//             </div>
//         );
//     }
//
//     const [userInterviews, allInterview] = await Promise.all([
//         getInterviewsByUserId(user.id),
//         getLatestInterviews({ userId: user.id }),
//     ]);
//
//     const hasPastInterviews = userInterviews?.length > 0;
//     const hasUpcomingInterviews = allInterview?.length > 0;
//
//     return (
//         <>
//             <section className="card-cta">
//                 <div className="flex flex-col gap-6 max-w-lg">
//                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//                     <p className="text-lg">
//                         Practice real interview questions & get instant feedback
//                     </p>
//
//                     <Button asChild className="btn-primary max-sm:w-full">
//                         <Link href="/interview">Start an Interview</Link>
//                     </Button>
//                 </div>
//
//                 <Image
//                     src="/img_1.png"
//                     alt="robo-dude"
//                     width={0}
//                     height={0}
//                     sizes="(max-width: 720px) 100vw, 400px"
//                     className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
//                 />
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Your Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasPastInterviews ? (
//                         userInterviews.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>You haven&apos;t taken any interviews yet.</p>
//                     )}
//                 </div>
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Take Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasUpcomingInterviews ? (
//                         allInterview.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>There are no interviews available.</p>
//                     )}
//                 </div>
//             </section>
//         </>
//     );
// }
//

//initial
// import Link from "next/link";
// import Image from "next/image";
//
// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
//
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import {
//     getInterviewsByUserId,
//     getLatestInterviews,
// } from "@/lib/actions/general.action";
//
// async function Home() {
//     const user = await getCurrentUser();
//
//     const [userInterviews, latestInterviews] = await Promise.all([
//         getInterviewsByUserId(user?.id),
//         getLatestInterviews({ userId: user?.id }),
//     ]);
//
//
//
//     const hasPastInterviews = userInterviews?.length > 0;
//     const hasUpcomingInterviews = latestInterviews?.length > 0;
//
//     return (
//         <>
//             <section className="card-cta">
//                 <div className="flex flex-col gap-6 max-w-lg">
//                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//                     <p className="text-lg">
//                         Practice real interview questions & get instant feedback
//                     </p>
//
//                     <Button asChild className="btn-primary max-sm:w-full">
//                         <Link href="/interview">Start an Interview</Link>
//                     </Button>
//                 </div>
//
//                 <Image
//                                     src="/img_1.png"
//                                     alt="robo-dude"
//                                     width={0}
//                                     height={0}
//                                     sizes="(max-width: 720px) 100vw, 400px"
//                                     className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
//                                 />
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Your Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasUpcomingInterviews ? (
//                         userInterviews?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user?.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>You haven&apos;t taken any interviews yet</p>
//                     )}
//                 </div>
//             </section>
//
//             <section className="flex flex-col gap-6 mt-8">
//                 <h2>Take Interviews</h2>
//
//                 <div className="interviews-section">
//                     {hasUpcomingInterviews ? (
//                         latestInterviews?.map((interview) => (
//                             <InterviewCard
//                                 key={interview.id}
//                                 userId={user?.id}
//                                 interviewId={interview.id}
//                                 role={interview.role}
//                                 type={interview.type}
//                                 techstack={interview.techstack}
//                                 createdAt={interview.createdAt}
//                             />
//                         ))
//                     ) : (
//                         <p>There are no interviews available</p>
//                     )}
//                 </div>
//             </section>
//         </>
//     );
// }
//
// export default Home;

//chatgpt code1
// import Link from "next/link";
// import Image from "next/image";
//
// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
//
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
//
// interface SectionProps {
//     title: string;
//     items: any[];
//     userId: string;
//     emptyMessage: string;
// }
//
// const InterviewSection = ({ title, items, userId, emptyMessage }: SectionProps) => (
//     <section className="flex flex-col gap-6 mt-8">
//         <h2>{title}</h2>
//         <div className="interviews-section">
//             {items.length > 0 ? (
//                 items.map((interview) => (
//                     <InterviewCard
//                         key={interview.id}
//                         userId={userId}
//                         interviewId={interview.id}
//                         role={interview.role}
//                         type={interview.type}
//                         techstack={interview.techstack}
//                         createdAt={interview.createdAt}
//                     />
//                 ))
//             ) : (
//                 <p>{emptyMessage}</p>
//             )}
//         </div>
//     </section>
// );
//
// export default async function Home() {
//     const user = await getCurrentUser();
//
//     // Early return if no user
//     if (!user?.id) {
//         return (
//             <div className="text-center mt-10">
//                 <h2 className="text-xl font-semibold">You must be logged in.</h2>
//                 <Link href="/sign-in" className="text-blue-600 underline mt-2 inline-block">
//                     Go to Sign In
//                 </Link>
//             </div>
//         );
//     }
//
//     const [userInterviews, latestInterviews] = await Promise.all([
//         getInterviewsByUserId(user.id),
//         getLatestInterviews({ userId: user.id }),
//     ]);
//
//     return (
//         <>
//             {/* Hero Section */}
//             <section className="card-cta">
//                 <div className="flex flex-col gap-6 max-w-lg">
//                     <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//                     <p className="text-lg">Practice real interview questions & get instant feedback</p>
//                     <Button asChild className="btn-primary max-sm:w-full">
//                         <Link href="/interview">Start an Interview</Link>
//                     </Button>
//                 </div>
//
//                 <Image
//                     src="/img_1.png"
//                     alt="robo-dude"
//                     width={0}
//                     height={0}
//                     sizes="(max-width: 720px) 100vw, 400px"
//                     className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
//                 />
//             </section>
//
//             {/* Your Interviews Section */}
//             <InterviewSection
//                 title="Your Interviews"
//                 items={userInterviews || []}
//                 userId={user.id}
//                 emptyMessage="You haven't taken any interviews yet."
//             />
//
//             {/* Take Interviews Section */}
//             <InterviewSection
//                 title="Take Interviews"
//                 items={latestInterviews || []}
//                 userId={user.id}
//                 emptyMessage="There are no interviews available."
//             />
//         </>
//     );
// }


//chatgpt code 2
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import { dummyInterviews } from "@/constants";

interface Interview {
    id: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string;
    userId?: string;
}

interface SectionProps {
    title: string;
    items: Interview[];
    userId: string;
    emptyMessage: string;
}

const InterviewSection = ({ title, items, userId, emptyMessage }: SectionProps) => (
    <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="interviews-section">
            {items.length > 0 ? (
                items.map((interview) => (
                    <InterviewCard
                        key={interview.id}
                        userId={userId}
                        interviewId={interview.id}
                        role={interview.role}
                        type={interview.type}
                        techstack={interview.techstack}
                        createdAt={interview.createdAt}
                    />
                ))
            ) : (
                <p className="text-gray-500">{emptyMessage}</p>
            )}
        </div>
    </section>
);

export default async function Home() {
    const user = await getCurrentUser();

    if (!user?.id) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold">You must be logged in.</h2>
                <Link href="/sign-in" className="text-blue-600 underline mt-2 inline-block">
                    Go to Sign In
                </Link>
            </div>
        );
    }

    const [userInterviews, latestInterviews] = await Promise.all([
        getInterviewsByUserId(user.id),
        getLatestInterviews({ userId: user.id }),
    ]);

    const filteredUserInterviews = userInterviews || [];
    const allInterviews = [...(latestInterviews || []), ...dummyInterviews];

    return (
        <>
            {/* Header with Welcome Message */}
            <header className="w-full flex justify-center items-center p-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    🎉 Welcome, <span className="text-yellow-400">{user.name || "User"}</span>!
                </h2>
            </header>



            {/* Hero Section */}
            <section className="card-cta mt-6">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2 className="text-3xl font-semibold">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">Practice real interview questions & get instant feedback</p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/img_1.png"
                    alt="robo-dude"
                    width={0}
                    height={0}
                    sizes="(max-width: 720px) 100vw, 400px"
                    className="w-full max-w-[400px] h-auto rounded-2xl border-[6px] border-white outline outline-[3px] outline-white/70 shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300 ease-in-out"
                />
            </section>

            {/* Your Interviews Section */}
            <InterviewSection
                title="Your Interviews"
                items={filteredUserInterviews}
                userId={user.id}
                emptyMessage="You haven't taken any interviews yet."
            />

            {/* Take Interviews Section */}
            <InterviewSection
                title="Take Interviews"
                items={allInterviews}
                userId={user.id}
                emptyMessage="There are no interviews available."
            />
        </>
    );
}


