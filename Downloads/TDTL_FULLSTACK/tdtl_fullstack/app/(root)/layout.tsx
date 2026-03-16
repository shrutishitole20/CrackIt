// import { ReactNode } from 'react'
// import Link from "next/link";
// import Image from "next/image";
// import { isAuthenticated} from "@/lib/actions/auth.action";
// import {redirect} from "next/navigation";
//
// const RootLayout = ({ children } : { children: ReactNode}) => {
//
//     const isUserAuthenticated = await isAuthenticated();
//
//     if(!isUserAuthenticated) redirect('/sign-in');
//
//     return (
//         <div className="root-layout">
//             <nav>
//                 <Link href="/" className="flex items-center gap-2" >
//                     <Image src="/logo.svg" alt="logo" width={38} height={32} />
//                     <h2 className="text-primary-100">CrackIT AI</h2>
//                 </Link>
//             </nav>
//             {children}
//         </div>
//     )
// }
// export default RootLayout
// app/layout.tsx or app/your-path/layout.tsx (ensure this is a server component)


//
// import { ReactNode } from 'react'
// import Link from "next/link"
// import Image from "next/image"
// import { isAuthenticated } from "@/lib/actions/auth.action"
// import { redirect } from "next/navigation"
//
// export default async function RootLayout({ children }: { children: ReactNode }) {
//     const isUserAuthenticated = await isAuthenticated()
//
//     if (!isUserAuthenticated) {
//         redirect('/sign-in')
//     }
//
//     return (
//         <div className="root-layout">
//             <nav>
//                 <Link href="/" className="flex items-center gap-2">
//                     <Image src="/logo.svg" alt="logo" width={38} height={32} />
//                     <h2 className="text-primary-100">CrackIT AI</h2>
//                 </Link>
//             </nav>
//             {children}
//         </div>
//     )
// }


import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) redirect("/sign-in");

    return (
        <div className="root-layout">
            <nav>
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
                    <h2 className="text-primary-100">CrackIT AI</h2>
                </Link>
            </nav>

            {children}
        </div>
    );
};

export default Layout;
