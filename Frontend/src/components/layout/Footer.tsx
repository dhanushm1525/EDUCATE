export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white px-6 pt-12 pb-6">

            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">

                {/* Brand */}

                <div>

                    <h2 className="text-xl font-black tracking-tight text-indigo-600">
                        EDUCATE
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Empowering learners worldwide through world-class
                        courses and a vibrant community of experts and peers.
                    </p>

                </div>


                {/* Platform */}

                <div>

                    <h3 className="text-sm font-bold uppercase text-slate-900">
                        Platform
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-slate-500">

                        <li>
                            <a href="#courses" className="hover:text-indigo-600">
                                Courses
                            </a>
                        </li>

                        <li>
                            <a href="#qa" className="hover:text-indigo-600">
                                Q&A Community
                            </a>
                        </li>

                        <li>
                            <a href="#live" className="hover:text-indigo-600">
                                Live Classes
                            </a>
                        </li>

                        <li>
                            <a href="#support" className="hover:text-indigo-600">
                                Support
                            </a>
                        </li>

                    </ul>

                </div>


                {/* Company */}

                <div>

                    <h3 className="text-sm font-bold uppercase text-slate-900">
                        Company
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-slate-500">

                        <li>About Us</li>

                        <li>Careers</li>

                        <li>Contact Us</li>

                        <li>Help Center</li>

                    </ul>

                </div>


                {/* Legal */}

                <div>

                    <h3 className="text-sm font-bold uppercase text-slate-900">
                        Legal
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-slate-500">

                        <li>Privacy Policy</li>

                        <li>Terms of Service</li>

                        <li>FAQ</li>

                    </ul>

                </div>

            </div>


            {/* Copyright */}

            <div className="mx-auto mt-10 max-w-7xl border-t border-slate-100 pt-6 text-center text-xs text-slate-400">

                © 2026 EDUCATE Learning Platform. All rights reserved.

            </div>

        </footer>
    );
}