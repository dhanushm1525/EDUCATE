import {
    GraduationCap,
    Users,
    TrendingUp,
} from "lucide-react";


const featureCards = [
    {
        title: "100+ Courses",
        description:
            "Deep-dive into comprehensive modules designed by industry veterans to ensure practical mastery.",
        icon: GraduationCap,
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-950/60 border border-indigo-800/40",
    },
    {
        title: "Expert Instructors",
        description:
            "Learn directly from senior professionals who bring real-world experience and case studies to your screen.",
        icon: Users,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-950/40 border border-amber-800/30",
    },
    {
        title: "Career Growth",
        description:
            "Earn industry-recognized certificates that validate your skills and accelerate your professional advancement.",
        icon: TrendingUp,
        iconColor: "text-teal-400",
        iconBg: "bg-teal-950/50 border border-teal-800/30",
    },
];


function RegisterFeatures() {
    return (
        <section className="lg:col-span-7 flex flex-col justify-center">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Transform Your Future with
                <br className="hidden sm:inline" />
                {" "}Premium Learning
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Join thousands of learners building practical skills through
                high-quality online education and expert-led courses.
            </p>


            <div className="mt-8 space-y-4 max-w-xl">

                {featureCards.map((item) => {
                    const IconComponent = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                bg-[#1E293B]/70
                                border
                                border-slate-700/60
                                rounded-xl
                                p-4
                                sm:p-5
                                flex
                                items-start
                                gap-4
                                transition-colors
                                hover:border-slate-600
                            "
                        >

                            <div
                                className={`
                                    w-10
                                    h-10
                                    rounded-lg
                                    ${item.iconBg}
                                    ${item.iconColor}
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                    mt-0.5
                                `}
                            >
                                <IconComponent className="w-5 h-5" />
                            </div>


                            <div>

                                <h3 className="text-sm font-bold text-slate-100">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    {item.description}
                                </p>

                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}


export default RegisterFeatures;