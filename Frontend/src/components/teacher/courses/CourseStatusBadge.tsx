
import type { CourseStatus } from "../../../types/course";

interface CourseStatusBadgeProps {
    status: CourseStatus;
}

const statusStyles: Record<CourseStatus, string> = {
    draft: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CourseStatusBadge({
    status,
}: CourseStatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
}
