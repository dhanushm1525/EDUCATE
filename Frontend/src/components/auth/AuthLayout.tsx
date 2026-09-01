import type { ReactNode } from "react";

import AuthLogo from "./AuthLogo";
import AuthFooter from "./AuthFooter";

interface AuthLayoutProps {
    children: ReactNode;
}

function AuthLayout({
    children,
}: AuthLayoutProps) {

    return (

        <div className="
            min-h-screen
            bg-[#0B1120]
            text-slate-100
            flex
            flex-col
        ">

            <main className="
                flex-1
                max-w-7xl
                w-full
                mx-auto
                px-6
                lg:px-12
                py-10
                lg:py-16
                flex
                flex-col
            ">

                {/* Logo */}

                <div className="
                    flex
                    items-center
                    mb-10
                    lg:mb-12
                ">

                    <AuthLogo />

                </div>


                {/* Page Content */}

                <div className="
                    flex-1
                    flex
                    items-center
                ">

                    {children}

                </div>

            </main>


            <AuthFooter />

        </div>

    );
}

export default AuthLayout;