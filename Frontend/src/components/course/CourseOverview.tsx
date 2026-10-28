import type { Course } from "../../types/course";

interface CourseOverviewProps {
  course: Course;
}

export default function CourseOverview({ course }: CourseOverviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Course thumbnail */}
      <div className="h-56 bg-slate-100 sm:h-80">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
            <span className="text-sm font-medium text-slate-400">
              Course preview
            </span>
          </div>
        )}
      </div>

      {/* Course information */}
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            {course.level}
          </span>

          {course.language && (
            <span className="text-sm text-slate-500">
              Language: {course.language}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {course.title}
        </h1>

        {course.subtitle && (
          <p className="mt-3 text-base leading-7 text-slate-600">
            {course.subtitle}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
          {typeof course.averageRating === "number" &&
            course.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-amber-500">★</span>
                <span className="font-semibold text-slate-900">
                  {course.averageRating.toFixed(1)}
                </span>
                <span>Course rating</span>
              </div>
            )}

          <div>
            <span className="font-semibold text-slate-900">
              {course.totalStudents ?? 0}
            </span>{" "}
            students enrolled
          </div>
        </div>
      </div>
    </section>
  );
}
