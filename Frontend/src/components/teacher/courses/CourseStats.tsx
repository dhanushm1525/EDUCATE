import { BookOpen, CheckCircle2, Clock3, FileEdit } from "lucide-react";

import type { Course } from "../../../types/course";

interface CourseStatsProps {
  courses: Course[];
}

export default function CourseStats({ courses }: CourseStatsProps) {
  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: BookOpen,
      iconStyle: "bg-indigo-500/10 text-indigo-400",
    },
    {
      label: "Published",
      value: courses.filter((course) => course.status === "published").length,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Drafts",
      value: courses.filter((course) => course.status === "draft").length,
      icon: FileEdit,
      iconStyle: "bg-slate-500/10 text-slate-300",
    },
    {
      label: "Pending Review",
      value: courses.filter((course) => course.status === "pending").length,
      icon: Clock3,
      iconStyle: "bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconStyle }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{label}</p>

            <div className={`rounded-lg p-2 ${iconStyle}`}>
              <Icon size={18} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
