import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
  FileText,
  CheckCircle2,
  CalendarClock,
  Clock3,
  Award,
  FileQuestion,
} from "lucide-react";

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
      <div className="mx-auto w-full space-y-7 pb-10">
        {/* Page Header */}
        <header className="space-y-5">
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-400"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to lessons
          </button>

          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/50 p-6 shadow-lg sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-950/40">
                <ClipboardList size={27} />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
                  Teacher Workspace
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Assignment Management
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Create and manage assessments for your lessons.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <LoadingState message="Loading assignment..." />
          </div>
        )}

        {/* Loading Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <ErrorState message={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Existing Assignment */}
        {!loading && !error && assignment && (
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
            <div className="flex flex-col gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                  <FileText size={24} />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {assignment.title}
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 size={13} />
                      Created
                    </span>
                  </div>

                  <p className="text-sm text-slate-400">
                    An assignment is already configured for this lesson.
                  </p>
                </div>
              </div>
            </div>

            {assignment.description && (
              <div className="border-b border-slate-800 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Description
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {assignment.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <FileQuestion size={19} />
                </div>
                <p className="text-xs text-slate-500">Questions</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {assignment.questions.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Award size={19} />
                </div>
                <p className="text-xs text-slate-500">Total Marks</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {assignment.totalMarks}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>
                <p className="text-xs text-slate-500">Passing Marks</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {assignment.passingMarks}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Clock3 size={19} />
                </div>
                <p className="text-xs text-slate-500">Attempts Allowed</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {assignment.attemptsAllowed ?? "Unlimited"}
                </p>
              </div>
            </div>

            {assignment.dueDate && (
              <div className="mx-6 mb-5 flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <CalendarClock size={20} className="text-violet-400" />

                <div>
                  <p className="text-xs text-slate-500">Submission Deadline</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {new Date(assignment.dueDate).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 border-t border-slate-800 p-6">
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

        {/* Create Assignment */}
        {!loading && !error && !assignment && (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <ClipboardList size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Create Lesson Assignment
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  No assignment exists for this lesson yet. Configure one below.
                </p>
              </div>
            </div>

            {createError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400"
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
