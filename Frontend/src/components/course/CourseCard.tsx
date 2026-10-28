import { Link } from "react-router-dom";

import type { Course } from "../../types/course";

interface CourseCardProps {
  course: Course;
}

function formatCoursePrice(price: number): string {
  if (price <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <Link
        to={`/courses/${course.courseId}`}
        aria-label={`View ${course.title}`}
        className="relative block h-40 bg-slate-100"
      >
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
            <span className="text-sm font-medium text-slate-400">
              Course preview
            </span>
          </div>
        )}
      </Link>

      {/* Course information */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-3 w-fit rounded bg-indigo-100 px-2 py-1 text-[10px] font-extrabold uppercase text-indigo-700">
          {course.level}
        </span>

        <Link
          to={`/courses/${course.courseId}`}
          className="text-sm font-bold leading-5 text-slate-900 hover:text-indigo-600"
        >
          <h3 className="line-clamp-2">{course.title}</h3>
        </Link>

        {course.subtitle && (
          <p className="mt-2 line-clamp-2 text-xs text-slate-500">
            {course.subtitle}
          </p>
        )}

        {typeof course.averageRating === "number" &&
          course.averageRating > 0 && (
            <div className="mt-3 flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-900">
                {course.averageRating.toFixed(1)}
              </span>
              <span className="text-amber-500">★</span>
            </div>
          )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="text-sm font-extrabold text-slate-900">
            {formatCoursePrice(course.finalPrice)}
          </span>

          <span className="text-right text-xs text-slate-400">
            {course.totalStudents ?? 0} students
          </span>
        </div>
      </div>
    </article>
  );
}
