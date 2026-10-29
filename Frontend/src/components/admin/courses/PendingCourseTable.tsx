import { Eye, CheckCircle, XCircle } from "lucide-react";

import type { Course } from "../../../types/course";
import { Button } from "../../common/ui/Button";
import { StatusBadge } from "../../common/ui/StatusBadge";

interface PendingCourseTableProps {
  courses: Course[];
  onReview: (course: Course) => void;
  onApprove: (course: Course) => void;
  onReject: (course: Course) => void;
  processingCourseId: string | null;
}

export default function PendingCourseTable({
  courses,
  onReview,
  onApprove,
  onReject,
  processingCourseId,
}: PendingCourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          No pending courses
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Courses submitted by teachers will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Course</th>
            <th className="px-5 py-4">Level</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Submitted</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {courses.map((course) => {
            const isProcessing = processingCourseId !== null;

            return (
              <tr key={course.courseId}>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{course.title}</p>

                  <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                    {course.subtitle}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {course.level}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                  }).format(course.finalPrice)}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Date(course.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={course.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onReview(course)}
                      disabled={isProcessing}
                    >
                      <Eye size={15} />
                      Review
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onApprove(course)}
                      disabled={isProcessing}
                    >
                      <CheckCircle size={15} />
                      Approve
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onReject(course)}
                      disabled={isProcessing}
                    >
                      <XCircle size={15} />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
