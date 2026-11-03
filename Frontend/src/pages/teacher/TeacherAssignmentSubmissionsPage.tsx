import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, FileText } from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";

import { Button } from "../../components/common/ui/Button";
import { StatusBadge } from "../../components/common/ui/StatusBadge";
import { LoadingState } from "../../components/common/ui/LoadingState";
import { EmptyState } from "../../components/common/ui/EmptyState";
import { ErrorState } from "../../components/common/ui/ErrorState";

import { assignmentService } from "../../services/assingment.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { TeacherAssignmentSubmission } from "../../types/teacherAssignment";

export default function TeacherAssignmentSubmissionsPage() {
  const { assignmentId } = useParams<{
    assignmentId: string;
  }>();

  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<TeacherAssignmentSubmission[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadSubmissions = async () => {
      if (!assignmentId) {
        setError("Assignment ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await assignmentService.getTeacherSubmissions(assignmentId);

        if (!cancelled) {
          setSubmissions(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, [assignmentId, reloadKey]);

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1);
  };

  return (
    <TeacherLayout
      contentClassName="mx-auto w-full max-w-6xl"
      mainClassName="min-h-screen p-6"
    >
      <div className="space-y-8">
        {/* Header */}
        <header>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <FileText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Assignment Submissions</h1>

              <p className="mt-1 text-sm text-slate-400">
                Review student attempts and grades.
              </p>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && <LoadingState message="Loading submissions..." />}

        {/* Error */}
        {!loading && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {/* Empty */}
        {!loading && !error && submissions.length === 0 && (
          <EmptyState
            title="No submissions yet"
            description="Student submissions will appear here once they complete this assignment."
            icon={<FileText size={36} />}
          />
        )}

        {/* Submissions table */}
        {!loading && !error && submissions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 p-5">
              <h2 className="font-semibold">Student Submissions</h2>

              <p className="mt-1 text-sm text-slate-400">
                {submissions.length} submission(s)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/60 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Attempt</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Percentage</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {submissions.map((submission) => (
                    <tr
                      key={submission.submissionId}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {submission.student.firstName}{" "}
                          {submission.student.lastName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {submission.student.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">{submission.attemptNumber}</td>

                      <td className="px-5 py-4">
                        {submission.score}/{submission.totalMarks}
                      </td>

                      <td className="px-5 py-4">
                        {submission.percentage.toFixed(1)}%
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={submission.status} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              `/teacher/assignments/${assignmentId}/submissions/${submission.submissionId}`,
                            )
                          }
                        >
                          <Eye size={14} />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
