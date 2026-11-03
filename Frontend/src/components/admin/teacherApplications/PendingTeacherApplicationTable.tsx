import { Eye, GraduationCap } from "lucide-react";

import type { TeacherApplication } from "../../../types/teacherApplication";

import { Button } from "../../common/ui/Button";
import { StatusBadge } from "../../common/ui/StatusBadge";

interface PendingTeacherApplicationTableProps {
  applications: TeacherApplication[];
  onReview: (application: TeacherApplication) => void;
  processingApplicationId: string | null;
}

export default function PendingTeacherApplicationTable({
  applications,
  onReview,
  processingApplicationId,
}: PendingTeacherApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <GraduationCap size={40} className="mx-auto text-slate-400" />

        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          No pending teacher applications
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Student applications requesting teacher access will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Applicant</th>
            <th className="px-5 py-4">Qualification</th>
            <th className="px-5 py-4">Experience</th>
            <th className="px-5 py-4">Applied On</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {applications.map((application) => {
            const applicantName = [
              application.applicant.firstName,
              application.applicant.lastName,
            ]
              .filter(Boolean)
              .join(" ");

            const isProcessing =
              processingApplicationId === application.applicationId;

            return (
              <tr key={application.applicationId}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {application.applicant.avatar ? (
                      <img
                        src={application.applicant.avatar}
                        alt={applicantName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {application.applicant.firstName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-slate-800">
                        {applicantName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.applicant.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {application.qualification}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {application.experience} years
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Date(application.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={application.status} />
                </td>

                <td className="px-5 py-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={Boolean(processingApplicationId)}
                    loading={isProcessing}
                    onClick={() => onReview(application)}
                  >
                    <Eye size={15} />
                    Review
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
