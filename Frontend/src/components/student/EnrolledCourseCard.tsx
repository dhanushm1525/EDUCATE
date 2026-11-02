import { Link } from "react-router-dom";
import { BookOpen, Clock, Star, ArrowRight } from "lucide-react";

import type { EnrolledCourse } from "../../types/enrollment";

interface EnrolledCourseCardProps {
  enrollment: EnrolledCourse;
}

function formatDate(date?: string): string {
  if (!date) return "Recently enrolled";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDuration(duration: number): string {
  if (!duration || duration <= 0) return "Duration unavailable";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours}h ${minutes}m`;
}

export default function EnrolledCourseCard({
  enrollment,
}: EnrolledCourseCardProps) {
  const { course } = enrollment;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-48 overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
            <BookOpen size={40} className="text-indigo-300" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {course.level}
          </span>

          {typeof course.averageRating === "number" &&
            course.averageRating > 0 && (
              <span className="flex items-center gap-1 text-sm font-medium text-slate-600">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {course.averageRating.toFixed(1)}
              </span>
            )}
        </div>

        <h2 className="mt-4 line-clamp-2 text-lg font-bold text-slate-900">
          {course.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {course.subtitle || course.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatDuration(course.duration)}
          </span>

          <span>{course.language || "Language unavailable"}</span>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Enrolled on {formatDate(enrollment.enrolledAt)}
          </p>

          <Link
            to={`/student/courses/${course.courseId}/learn`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue Learning
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
