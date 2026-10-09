import { Eye, Pencil } from "lucide-react";

import type { Course } from "../../../types/course";

import { StatusBadge } from "../../common/ui/StatusBadge";

interface CourseTableProps {
  courses: Course[];
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
}

export function CourseTable({ courses, onView, onEdit }: CourseTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Course
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Level
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Students
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.courseId}
                className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-16 overflow-hidden rounded-md bg-slate-800">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="max-w-xs truncate text-sm font-medium text-white">
                        {course.title}
                      </p>
                      <p className="max-w-xs truncate text-xs text-slate-500">
                        {course.subtitle}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-400">
                  {course.level}
                </td>
                <td className="px-5 py-4 text-sm text-slate-400">
                  {course.totalStudents ?? 0}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={course.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(course)}
                        className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(course)}
                        className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
