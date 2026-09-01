import type { TrendingCourse } from "../../types/landing";


const trendingCourses: TrendingCourse[] = [
    {
        id: 1,
        badge: "DEVELOPMENT",
        badgeBg: "bg-purple-100",
        badgeColor: "text-purple-700",
        title: "The Complete Fullstack Web Development Bootcamp",
        instructor: "Dr. Angela Yu",
        rating: "4.8",
        reviews: "24,500",
        price: "$89.99",
        students: "125k students",

        // Temporary image
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    },

    {
        id: 2,
        badge: "DATA SCIENCE",
        badgeBg: "bg-indigo-100",
        badgeColor: "text-indigo-700",
        title: "Python for Data Science and Machine Learning Mastery",
        instructor: "Jose Portilla",
        rating: "4.9",
        reviews: "18,200",
        price: "$94.99",
        students: "96k students",

        // Temporary image
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    },

    {
        id: 3,
        badge: "DESIGN",
        badgeBg: "bg-amber-100",
        badgeColor: "text-amber-700",
        title: "Mastering Figma: From Beginner to Advanced UI Designer",
        instructor: "Sarah Jenkins",
        rating: "4.7",
        reviews: "12,150",
        price: "$79.99",
        students: "45k students",

        // Temporary image
        image:
            "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
    },

    {
        id: 4,
        badge: "MARKETING",
        badgeBg: "bg-rose-100",
        badgeColor: "text-rose-700",
        title: "Digital Marketing Strategy: The Ultimate Guide",
        instructor: "Mark Thompson",
        rating: "4.6",
        reviews: "9,430",
        price: "$69.99",
        students: "32k students",

        // Temporary image
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    },
];


export function TrendingCoursesSection() {
    return (
        <section
            id="courses"
            className="mx-auto max-w-7xl px-6 pb-16"
        >
            {/* Section Header */}

            <div className="mb-6 flex items-end justify-between">

                <div>

                    <h2 className="text-2xl font-extrabold text-slate-900">
                        Trending Courses
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Check out our most popular courses this week.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    View All →
                </button>

            </div>


            {/* Course Grid */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {trendingCourses.map((course) => (

                    <article
                        key={course.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >

                        {/* Course Image */}

                        <div className="relative h-40 w-full">

                            <img
                                src={course.image}
                                alt={course.title}
                                className="h-full w-full object-cover"
                            />


                            {/* Wishlist Button */}

                            <button
                                type="button"
                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm text-slate-600 transition hover:bg-white"
                            >
                                ♡
                            </button>

                        </div>


                        {/* Course Content */}

                        <div className="flex min-h-64 flex-col p-4">

                            {/* Badge */}

                            <span
                                className={`mb-3 w-fit rounded px-2 py-1 text-[10px] font-extrabold ${course.badgeBg} ${course.badgeColor}`}
                            >
                                {course.badge}
                            </span>


                            {/* Course Title */}

                            <h3 className="text-sm font-bold leading-5 text-slate-900">
                                {course.title}
                            </h3>


                            {/* Instructor */}

                            <p className="mt-2 text-xs text-slate-500">
                                {course.instructor}
                            </p>


                            {/* Rating */}

                            <div className="mt-3 flex items-center gap-1 text-xs">

                                <span className="font-bold text-slate-900">
                                    {course.rating}
                                </span>

                                <span className="text-amber-500">
                                    ★
                                </span>

                                <span className="text-slate-400">
                                    ({course.reviews})
                                </span>

                            </div>


                            {/* Course Footer */}

                            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">

                                <span className="text-sm font-extrabold text-slate-900">
                                    {course.price}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {course.students}
                                </span>

                            </div>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}