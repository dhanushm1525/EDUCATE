import type { Category } from "../../types/landing";


const categories: Category[] = [
    {
        title: "Web Development",
        courses: "1,240 Courses",
        icon: "</>",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        title: "Data Science",
        courses: "850 Courses",
        icon: "📊",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        title: "UI/UX Design",
        courses: "620 Courses",
        icon: "🎨",
        bgColor: "bg-pink-50",
        iconColor: "text-pink-600",
    },
    {
        title: "Business",
        courses: "940 Courses",
        icon: "📈",
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        title: "Digital Marketing",
        courses: "710 Courses",
        icon: "📢",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        title: "Photography",
        courses: "430 Courses",
        icon: "📷",
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
    },
];


export function CategorySection() {
    return (
        <section
            id="categories"
            className="mx-auto max-w-7xl px-6 py-16"
        >
            <h2 className="mb-6 text-2xl font-extrabold text-slate-900">
                Explore Categories
            </h2>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {categories.map((category) => (

                    <button
                        key={category.title}
                        type="button"
                        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:shadow-sm"
                    >

                        {/* Category Icon */}

                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.bgColor} ${category.iconColor}`}
                        >
                            <span className="text-lg font-bold">
                                {category.icon}
                            </span>
                        </div>


                        {/* Category Information */}

                        <div>

                            <h3 className="text-sm font-bold text-slate-900">
                                {category.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                {category.courses}
                            </p>

                        </div>

                    </button>

                ))}

            </div>

        </section>
    );
}