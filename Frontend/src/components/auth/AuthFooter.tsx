function AuthFooter() {
    return (
        <footer className="
            border-t
            border-slate-800/80
            bg-[#0B1120]
            py-6
            px-6
            lg:px-12
        ">
            <div className="
                max-w-7xl
                mx-auto
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-4
                text-xs
                text-slate-400
            ">

                <span className="
                    font-extrabold
                    tracking-wider
                    text-slate-200
                    text-sm
                ">
                    EDUCATE
                </span>


                <nav className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-6
                    text-[11px]
                    sm:text-xs
                ">

                    <a
                        href="#privacy"
                        className="hover:text-slate-200 transition-colors"
                    >
                        Privacy Policy
                    </a>

                    <a
                        href="#terms"
                        className="hover:text-slate-200 transition-colors"
                    >
                        Terms of Service
                    </a>

                    <a
                        href="#cookies"
                        className="hover:text-slate-200 transition-colors"
                    >
                        Cookie Policy
                    </a>

                    <a
                        href="#accessibility"
                        className="hover:text-slate-200 transition-colors"
                    >
                        Accessibility
                    </a>

                    <a
                        href="#security"
                        className="hover:text-slate-200 transition-colors"
                    >
                        Security
                    </a>

                </nav>


                <span className="
                    text-[11px]
                    text-slate-500
                ">
                    © 2026 EDUCATE Academy. All rights reserved.
                </span>

            </div>
        </footer>
    );
}


export default AuthFooter;