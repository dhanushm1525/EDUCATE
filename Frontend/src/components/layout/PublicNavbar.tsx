import { Link } from "react-router-dom";


export function PublicNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Left Section */}
                <div className="flex items-center gap-8">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-black tracking-tight text-indigo-600"
                    >
                        EDUCATE
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6 text-sm font-medium">

                        <a
                            href="#home"
                            className="border-b-2 border-indigo-600 pb-1 text-indigo-600"
                        >
                            Home
                        </a>

                        <a
                            href="#courses"
                            className="text-slate-500 transition hover:text-slate-900"
                        >
                            Courses
                        </a>

                        <a
                            href="#qa"
                            className="text-slate-500 transition hover:text-slate-900"
                        >
                            Q&A Community
                        </a>

                        <a
                            href="#live"
                            className="text-slate-500 transition hover:text-slate-900"
                        >
                            Live Classes
                        </a>

                    </nav>

                </div>


                {/* Authentication Buttons */}
                <div className="flex items-center gap-3">

                    <Link
                        to="/login"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Log In
                    </Link>


                    <Link
                        to="/register"
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Sign Up
                    </Link>

                </div>

            </div>
        </header>
    );
}