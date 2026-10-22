import { useNavigate } from "react-router-dom";

import { BookOpen, Clock3, Users } from "lucide-react";

import { Button } from "../../common/ui/Button";

import CourseStatusBadge from "./CourseStatusBadge";

import type { Course } from "../../../types/course";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleOpenCourse = () => {
    navigate(`/teacher/courses/${course.courseId}`);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700">
      {/* Course thumbnail */}
      <div className="relative h-44 bg-slate-800">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen size={36} className="text-slate-600" />
          </div>
        )}
      </div>

      {/* Course information */}
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold text-white">
              {course.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {course.subtitle}
            </p>
          </div>

          <CourseStatusBadge status={course.status} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} />
            {course.level}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {course.duration} min
          </span>

          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {course.totalStudents ?? 0} students
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="font-semibold text-white">
            {course.finalPrice === 0 ? "Free" : `₹${course.finalPrice}`}
          </span>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleOpenCourse}
          >
            Open Course
          </Button>
        </div>
      </div>
    </article>
  );
}
