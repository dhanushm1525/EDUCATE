import type { QaPost } from "../../types/landing";


const qaPosts: QaPost[] = [
    {
        title:
            "How to efficiently manage state in a large-scale React application?",

        content:
            "I'm building a massive e-commerce platform and Redux seems a bit boilerplate-heavy. Are there better approaches for managing complex application state?",

        author: "Alex Morgan",

        initials: "AM",

        comments: 24,

        likes: 128,

        avatarBg: "bg-purple-600",
    },

    {
        title:
            "What are the best practices for securing a Node.js REST API?",

        content:
            "I’m concerned about common vulnerabilities. Should I use Passport.js or implement JWT from scratch? Any recommended security practices?",

        author: "Kevin Lee",

        initials: "KL",

        comments: 18,

        likes: 84,

        avatarBg: "bg-blue-600",
    },

    {
        title:
            "How do I start a career in UX research without a prior portfolio?",

        content:
            "I’m switching from marketing. Are there specific certifications or side projects I can do to show recruiters my skills?",

        author: "Sarah Chen",

        initials: "SC",

        comments: 32,

        likes: 210,

        avatarBg: "bg-violet-600",
    },
];


export function QaCommunitySection() {
    return (
        <section
            id="qa"
            className="mx-auto max-w-7xl px-6 pb-16"
        >
            {/* Section Header */}

            <div className="mb-6 flex items-end justify-between">

                <div>

                    <h2 className="text-2xl font-extrabold text-slate-900">
                        Latest from Q&A Community
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Get answers to your questions from our global
                        expert community.
                    </p>

                </div>


                <button
                    type="button"
                    className="rounded-full border border-indigo-600 px-4 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50"
                >
                    Ask Question
                </button>

            </div>


            {/* Q&A Posts */}

            <div className="grid gap-5 md:grid-cols-3">

                {qaPosts.map((post) => (

                    <article
                        key={post.title}
                        className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5"
                    >

                        {/* Question Content */}

                        <div>

                            <h3 className="text-sm font-bold leading-5 text-slate-900">
                                {post.title}
                            </h3>


                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                {post.content}
                            </p>

                        </div>


                        {/* Post Footer */}

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">

                            {/* Author */}

                            <div className="flex items-center gap-2">

                                <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${post.avatarBg}`}
                                >
                                    {post.initials}
                                </div>


                                <span className="text-xs font-semibold text-slate-700">
                                    {post.author}
                                </span>

                            </div>


                            {/* Statistics */}

                            <div className="flex items-center gap-3 text-xs text-slate-400">

                                <span>
                                    💬 {post.comments}
                                </span>

                                <span>
                                    👍 {post.likes}
                                </span>

                            </div>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}