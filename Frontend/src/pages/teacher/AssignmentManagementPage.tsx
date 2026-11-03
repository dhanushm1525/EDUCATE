import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Eye, FileText } from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";
import { AssignmentForm } from "../../components/teacher/assingment/AssignmentForm";

import { Button } from "../../components/common/ui/Button";
import { LoadingState } from "../../components/common/ui/LoadingState";
import { ErrorState } from "../../components/common/ui/ErrorState";

import { assignmentService } from "../../services/assingment.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type {
  Assignment,
  CreateAssignmentRequest,
} from "../../types/assingment";

export default function AssignmentManagementPage() {
  const { courseId, chapterId, lessonId } = useParams<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>();

  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadAssignment = async () => {
      if (!lessonId) {
        setError("Lesson ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await assignmentService.getByLesson(lessonId);

        if (!cancelled) {
          setAssignment(response.data);
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

    void loadAssignment();

    return () => {
      cancelled = true;
    };
  }, [lessonId, reloadKey]);

  const handleSubmit = async (data: CreateAssignmentRequest) => {
    if (!lessonId) {
      setCreateError("Lesson ID is missing.");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      await assignmentService.create(lessonId, data);

      setReloadKey((previous) => previous + 1);
    } catch (err) {
      setCreateError(getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    if (!courseId || !chapterId) {
      navigate("/teacher/courses");
      return;
    }

    navigate(`/teacher/courses/${courseId}/chapters/${chapterId}/lessons`);
  };

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1);
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Page header */}
        <header>
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to lessons
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <ClipboardList size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Assignment Management</h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage the assignment associated with this lesson.
              </p>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && <LoadingState message="Loading assignment..." />}

        {/* Loading error */}
        {!loading && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {/* Existing assignment */}
        {!loading && !error && assignment && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <FileText size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">{assignment.title}</h2>

                <p className="mt-1 text-sm text-slate-400">
                  An assignment is already configured for this lesson.
                </p>
              </div>
            </div>

            {assignment.description && (
              <p className="mt-5 text-sm leading-6 text-slate-400">
                {assignment.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-slate-800 pt-5 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-1 text-lg font-semibold">
                  {assignment.questions.length}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Marks</p>
                <p className="mt-1 text-lg font-semibold">
                  {assignment.totalMarks}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Passing Marks</p>
                <p className="mt-1 text-lg font-semibold">
                  {assignment.passingMarks}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Attempts Allowed</p>
                <p className="mt-1 text-lg font-semibold">
                  {assignment.attemptsAllowed ?? "Unlimited"}
                </p>
              </div>
            </div>

            {assignment.dueDate && (
              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="text-xs text-slate-500">Due Date</p>

                <p className="mt-1 text-sm font-medium">
                  {new Date(assignment.dueDate).toLocaleString()}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() =>
                  navigate(
                    `/teacher/assignments/${assignment.assignmentId}/submissions`,
                  )
                }
              >
                <Eye size={16} />
                View Submissions
              </Button>

              <Button type="button" variant="secondary" onClick={handleBack}>
                Back to Lessons
              </Button>
            </div>
          </section>
        )}

        {/* Create assignment */}
        {!loading && !error && !assignment && (
          <section>
            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Create Lesson Assignment
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                No assignment exists for this lesson yet. Create one below.
              </p>
            </div>

            {createError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
              >
                {createError}
              </div>
            )}

            <AssignmentForm onSubmit={handleSubmit} loading={creating} />
          </section>
        )}
      </div>
    </TeacherLayout>
  );
}
