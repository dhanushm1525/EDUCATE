import { useState } from "react";

const quickPills = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Business",
    "AI & ML"
];


export function HeroSection() {

    const [searchQuery, setSearchQuery] = useState("");


    const handleSearch = () => {
        console.log("Search query:", searchQuery);
    };


    return (
        <section
            id="home"
            className="bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-20 text-center text-white"
        >
            <div className="mx-auto max-w-4xl">

                {/* Heading */}

                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">

                    Bridge the Gap Between{" "}

                    <span className="text-amber-400">
                        Learning
                    </span>

                    <br />

                    <span className="text-amber-400">
                        & Mastery
                    </span>

                </h1>


                {/* Description */}

                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-100">

                    Join thousands of learners mastering in-demand skills
                    through expert-led courses, live classes, and a
                    collaborative learning community.

                </p>


                {/* Search Bar */}

                <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-full bg-white p-2 pl-4 shadow-xl">

                    <span className="mr-2 text-base text-slate-400">
                        🔍
                    </span>


                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                        placeholder="Search courses, instructors, or skills"
                        className="w-full border-none bg-transparent text-sm text-slate-800 outline-none"
                    />


                    <button
                        type="button"
                        onClick={handleSearch}
                        className="shrink-0 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Search
                    </button>

                </div>


                {/* Quick Categories */}

                <div className="mt-5 flex flex-wrap justify-center gap-2">

                    {quickPills.map((pill) => (

                        <button
                            key={pill}
                            type="button"
                            onClick={() =>
                                setSearchQuery(pill)
                            }
                            className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs text-white transition hover:bg-white/25"
                        >
                            {pill}
                        </button>

                    ))}

                </div>

            </div>
        </section>
    );
}