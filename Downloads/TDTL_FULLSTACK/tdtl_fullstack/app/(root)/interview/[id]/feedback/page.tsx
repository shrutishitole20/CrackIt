// import dayjs from "dayjs";
// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
//
// import {
//     getFeedbackByInterviewId,
//     getInterviewById,
// } from "@/lib/actions/general.action";
// import { Button } from "@/components/ui/button";
// import { getCurrentUser } from "@/lib/actions/auth.action";
//
// const Feedback = async ({ params }: RouteParams) => {
//     const { id } = await params;
//     const user = await getCurrentUser();
//
//     const interview = await getInterviewById(id);
//     if (!interview) redirect("/");
//
//     const feedback = await getFeedbackByInterviewId({
//         interviewId: id,
//         userId: user?.id!,
//     });
//
//     return (
//         <section className="section-feedback">
//             <div className="flex flex-row justify-center">
//                 <h1 className="text-4xl font-semibold">
//                     Feedback on the Interview -{" "}
//                     <span className="capitalize">{interview.role}</span> Interview
//                 </h1>
//             </div>
//
//             <div className="flex flex-row justify-center ">
//                 <div className="flex flex-row gap-5">
//                     {/* Overall Impression */}
//                     <div className="flex flex-row gap-2 items-center">
//                         <Image src="/star.svg" width={22} height={22} alt="star" />
//                         <p>
//                             Overall Impression:{" "}
//                             <span className="text-primary-200 font-bold">
//                 {feedback?.totalScore}
//               </span>
//                             /100
//                         </p>
//                     </div>
//
//                     {/* Date */}
//                     <div className="flex flex-row gap-2">
//                         <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
//                         <p>
//                             {feedback?.createdAt
//                                 ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
//                                 : "N/A"}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             <hr />
//
//             <p>{feedback?.finalAssessment}</p>
//
//             {/* Interview Breakdown */}
//             <div className="flex flex-col gap-4">
//                 <h2>Breakdown of the Interview:</h2>
//                 {feedback?.categoryScores?.map((category, index) => (
//                     <div key={index}>
//                         <p className="font-bold">
//                             {index + 1}. {category.name} ({category.score}/100)
//                         </p>
//                         <p>{category.comment}</p>
//                     </div>
//                 ))}
//             </div>
//
//             <div className="flex flex-col gap-3">
//                 <h3>Strengths</h3>
//                 <ul>
//                     {feedback?.strengths?.map((strength, index) => (
//                         <li key={index}>{strength}</li>
//                     ))}
//                 </ul>
//             </div>
//
//             <div className="flex flex-col gap-3">
//                 <h3>Areas for Improvement</h3>
//                 <ul>
//                     {feedback?.areasForImprovement?.map((area, index) => (
//                         <li key={index}>{area}</li>
//                     ))}
//                 </ul>
//             </div>
//
//             <div className="buttons">
//                 <Button className="btn-secondary flex-1">
//                     <Link href="/" className="flex w-full justify-center">
//                         <p className="text-sm font-semibold text-primary-200 text-center">
//                             Back to dashboard
//                         </p>
//                     </Link>
//                 </Button>
//
//                 <Button className="btn-primary flex-1">
//                     <Link
//                         href={`/interview/${id}`}
//                         className="flex w-full justify-center"
//                     >
//                         <p className="text-sm font-semibold text-black text-center">
//                             Retake Interview
//                         </p>
//                     </Link>
//                 </Button>
//             </div>
//         </section>
//     );
// };
//
// export default Feedback;


//chatgpt
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface FeedbackPageProps {
    params: {
        id: string;
    };
}

const Feedback = async ({ params }: FeedbackPageProps) => {
    const { id } = params;

    const user = await getCurrentUser();
    if (!user?.id) {
        redirect("/sign-in");
    }

    const interview = await getInterviewById(id);
    if (!interview) {
        redirect("/");
    }

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user.id,
    });

    return (
        <section className="section-feedback flex flex-col gap-6 p-4">
            {/* Header */}
            <div className="flex justify-center">
                <h1 className="text-4xl font-semibold text-white text-center">
                    Feedback on the Interview -{" "}
                    <span className="capitalize text-yellow-400">{interview.role}</span> Interview
                </h1>
            </div>

            {/* Overview */}
            <div className="flex justify-center">
                <div className="flex flex-row gap-8 mt-4">
                    {/* Overall Score */}
                    <div className="flex items-center gap-2">
                        <Image src="/star.svg" width={22} height={22} alt="star" />
                        <p>
                            Overall Impression:{" "}
                            <span className="text-yellow-400 font-bold">{feedback?.totalScore}</span>/100
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                        <p>
                            {feedback?.createdAt
                                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="my-4 border-gray-600" />

            {/* Final Assessment */}
            <p className="text-white">{feedback?.finalAssessment}</p>

            {/* Breakdown */}
            {feedback?.categoryScores?.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-white">Breakdown of the Interview:</h2>
                    {feedback.categoryScores.map((category, index) => (
                        <div key={index}>
                            <p className="font-bold text-white">
                                {index + 1}. {category.name} ({category.score}/100)
                            </p>
                            <p className="text-gray-300">{category.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Strengths */}
            {feedback?.strengths?.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">Strengths</h3>
                    <ul className="list-disc list-inside text-gray-200">
                        {feedback.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Areas for Improvement */}
            {feedback?.areasForImprovement?.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
                    <ul className="list-disc list-inside text-gray-200">
                        {feedback.areasForImprovement.map((area, index) => (
                            <li key={index}>{area}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row gap-4 mt-6">
                <Button className="btn-secondary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-yellow-400 text-center">
                            Back to Dashboard
                        </p>
                    </Link>
                </Button>

                <Button className="btn-primary flex-1">
                    <Link href={`/interview/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-black text-center">
                            Retake Interview
                        </p>
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default Feedback;

