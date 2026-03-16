// import Image from "next/image";
// import { redirect } from "next/navigation";
//
// import Agent from "@/components/Agent";
// import DisplayTechIcons from "@/components/DisplayTechIcons";
// import { getRandomInterviewCover } from "@/lib/utils";
// import {
//     getFeedbackByInterviewId,
//     getInterviewById,
// } from "@/lib/actions/general.action";
// import { getCurrentUser } from "@/lib/actions/auth.action";
//
// const InterviewDetails = async ({ params }: { params: { id: string } }) => {
//
// // const InterviewDetails = async ({ params }: RouteParams) => {
// //     const { id } = await params;
//     const { id } = params;
//
//     const user = await getCurrentUser();
//     const interview = await getInterviewById(id);
//     if (!interview) redirect("/");
//
//     const feedback = await getFeedbackByInterviewId({
//         interviewId: id,
//         userId: user?.id!,
//     });
//
//     return (
//         <>
//             <div className="flex flex-row gap-4 justify-between">
//                 <div className="flex flex-row gap-4 items-center max-sm:flex-col">
//                     <div className="flex flex-row gap-4 items-center">
//                         <Image
//                             src={getRandomInterviewCover()}
//                             alt="cover-image"
//                             width={40}
//                             height={40}
//                             className="rounded-full object-cover size-[40px]"
//                         />
//                         <h3 className="capitalize">{interview.role} Interview</h3>
//                     </div>
//
//                     <DisplayTechIcons techStack={interview.techstack} />
//                 </div>
//
//                 <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
//                     {interview.type}
//                 </p>
//             </div>
//
//             <Agent
//                 userName={user?.name!}
//                 userId={user?.id}
//                 interviewId={id}
//                 type="interview"
//                 questions={interview.questions}
//                 feedbackId={feedback?.id}
//             />
//         </>
//     );
// };
//
// export default InterviewDetails;
//
//Working module below
// import Image from "next/image";
// import { redirect } from "next/navigation";
//
// import Agent from "@/components/Agent";
// import DisplayTechIcons from "@/components/DisplayTechIcons";
// import { getRandomInterviewCover } from "@/lib/utils";
// import {
//     getFeedbackByInterviewId,
//     getInterviewById,
// } from "@/lib/actions/general.action";
// import { getCurrentUser } from "@/lib/actions/auth.action";
//
// interface InterviewDetailsProps {
//     params: {
//         id: string;
//     };
// }
//
// const InterviewDetails = async ({ params }: InterviewDetailsProps) => {
//     const { id } = params; // ✅ FIXED: No await here
//
//     // Guard clause: check for a valid ID
//     if (!id || typeof id !== "string" || id.trim() === "") {
//         console.error("Invalid interview ID:", id);
//         redirect("/");
//     }
//
//     const user = await getCurrentUser();
//     const interview = await getInterviewById(id);
//
//     if (!interview) {
//         console.error("Interview not found for ID:", id);
//         redirect("/");
//     }
//
//     const feedback = await getFeedbackByInterviewId({
//         interviewId: id,
//         userId: user?.id!,
//     });
//
//     return (
//         <>
//             <div className="flex flex-row gap-4 justify-between">
//                 <div className="flex flex-row gap-4 items-center max-sm:flex-col">
//                     <div className="flex flex-row gap-4 items-center">
//                         <Image
//                             src={getRandomInterviewCover()}
//                             alt="cover-image"
//                             width={40}
//                             height={40}
//                             className="rounded-full object-cover size-[40px]"
//                         />
//                         <h3 className="capitalize">{interview.role} Interview</h3>
//                     </div>
//                     <DisplayTechIcons techStack={interview.techstack} />
//                 </div>
//                 <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
//                     {interview.type}
//                 </p>
//             </div>
//
//             <Agent
//                 userName={user?.name!}
//                 userId={user?.id}
//                 interviewId={id}
//                 type="interview"
//                 questions={interview.questions}
//                 feedbackId={feedback?.id}
//             />
//         </>
//     );
// };
//
// export default InterviewDetails;

//initial
// import React from 'react'
// import Agent from "@/components/Agent";
// import {getCurrentUser} from "@/lib/actions/auth.action";
// const Page = async () => {
//     const user = await getCurrentUser();
//     return (
//         <>
//             <h3>Interview Generation</h3>
//             <Agent userName={user?.name} userId={user?.id} type="generate" />
//         </>
//     )
// }
// export default Page

//chatgpt code
import React from "react";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    if (!user?.id) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold text-white">
                    You must be logged in.
                </h2>
                <a
                    href="/sign-in"
                    className="text-yellow-400 underline mt-2 inline-block"
                >
                    Go to Sign In
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <h3 className="text-2xl font-bold text-white">
                🎯 Interview Generation
            </h3>
            <Agent userName={user.name} userId={user.id} type="generate" />
        </div>
    );
};

export default Page;
