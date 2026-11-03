import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";

import { Button } from "../../components/common/ui/Button";
import { EmptyState } from "../../components/common/ui/EmptyState";
import { LoadingState } from "../../components/common/ui/LoadingState";
import { ErrorState } from "../../components/common/ui/ErrorState";
import { StatusBadge } from "../../components/common/ui/StatusBadge";

import { assignmentService } from "../../services/assingment.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { TeacherAssignment } from "../../types/teacherAssignment";

interface AssignmentStats {
  totalAssignments: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  gradedSubmissions: number;
}

export default function TeacherAssignmentOverviewPage() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await assignmentService.getTeacherAssignments();

        if (!cancelled) {
          setAssignments(response.data);
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

    void loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const stats = useMemo<AssignmentStats>(() => {
    return assignments.reduce(
      (result, assignment) => ({
        totalAssignments: result.totalAssignments + 1,
        totalSubmissions: result.totalSubmissions + assignment.totalSubmissions,
        pendingSubmissions:
          result.pendingSubmissions + assignment.pendingSubmissions,
        gradedSubmissions:
          result.gradedSubmissions + assignment.gradedSubmissions,
      }),
      {
        totalAssignments: 0,
        totalSubmissions: 0,
        pendingSubmissions: 0,
        gradedSubmissions: 0,
      },
    );
  }, [assignments]);

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1);
  };

  const handleViewSubmissions = (assignmentId: string) => {
    navigate(`/teacher/assignments/${assignmentId}/submissions`);
  };

  const formatDate = (date?: string | null) => {
    if (!date) {
      return "No due date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const summaryCards = [
    {
      title: "Total Assignments",
      value: stats.totalAssignments,
      icon: ClipboardList,
      color: "text-indigo-400",
      background: "bg-indigo-500/10",
    },
    {
      title: "Total Submissions",
      value: stats.totalSubmissions,
      icon: Users,
      color: "text-blue-400",
      background: "bg-blue-500/10",
    },
    {
      title: "Pending Grading",
      value: stats.pendingSubmissions,
      icon: Clock3,
      color: "text-amber-400",
      background: "bg-amber-500/10",
    },
    {
      title: "Graded Submissions",
      value: stats.gradedSubmissions,
      icon: CheckCircle2,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
  ];

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-indigo-400">
              <FileText size={20} />
              <span className="text-sm font-medium">Teacher Workspace</span>
            </div>

            <h1 className="text-2xl font-bold text-white">Assignments</h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage your course assignments and review student submissions.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/teacher/courses")}
          >
            <BookOpen size={16} />
            My Courses
          </Button>
        </header>

        {/* Loading */}
        {loading && <LoadingState message="Loading your assignments..." />}

        {/* Error */}
        {!loading && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {!loading && !error && (
          <>
            {/* Statistics */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Overview</h2>

                <p className="mt-1 text-sm text-slate-400">
                  A summary of your assignments and student submissions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{card.title}</p>

                          <p className="mt-3 text-3xl font-bold text-white">
                            {card.value}
                          </p>
                        </div>

                        <div
                          className={`rounded-xl p-3 ${card.background} ${card.color}`}
                        >
                          <Icon size={22} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Assignment List */}
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Your Assignments
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Assignments created across your courses.
                  </p>
                </div>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {assignments.length} assignments
                </span>
              </div>

              {assignments.length === 0 ? (
                <EmptyState
                  title="No assignments yet"
                  description="You haven't created any assignments. Open a course lesson and create your first assignment."
                  icon={<ClipboardList size={36} />}
                  action={
                    <Button
                      type="button"
                      onClick={() => navigate("/teacher/courses")}
                    >
                      Go to My Courses
                      <ArrowRight size={16} />
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <article
                      key={assignment.assignmentId}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        {/* Assignment Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                              <FileText size={21} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-white">
                                {assignment.title}
                              </h3>

                              <p className="mt-1 text-sm text-slate-400">
                                {assignment.description ||
                                  "No description provided."}
                              </p>
                            </div>
                          </div>

                          {/* Course Hierarchy */}
                          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                              <BookOpen size={15} className="text-indigo-400" />
                              <span>{assignment.courseTitle}</span>
                            </div>

                            <div>
                              Chapter:{" "}
                              <span className="text-slate-300">
                                {assignment.chapterTitle}
                              </span>
                            </div>

                            <div>
                              Lesson:{" "}
                              <span className="text-slate-300">
                                {assignment.lessonTitle}
                              </span>
                            </div>
                          </div>

                          {/* Assignment Metadata */}
                          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs text-slate-500">
                                Questions
                              </p>
                              <p className="mt-1 font-semibold text-white">
                                {assignment.totalQuestions}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Total Marks
                              </p>
                              <p className="mt-1 font-semibold text-white">
                                {assignment.totalMarks}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Passing Marks
                              </p>
                              <p className="mt-1 font-semibold text-white">
                                {assignment.passingMarks}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Attempts Allowed
                              </p>
                              <p className="mt-1 font-semibold text-white">
                                {assignment.attemptsAllowed ?? "Unlimited"}
                              </p>
                            </div>
                          </div>

                          {/* Due Date */}
                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                            <CalendarDays size={15} />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                        </div>

                        {/* Submission Summary */}
                        <div className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-4 lg:w-56">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Submission Summary
                          </p>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Total</span>
                              <span className="font-semibold text-white">
                                {assignment.totalSubmissions}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Graded</span>
                              <span className="font-semibold text-emerald-400">
                                {assignment.gradedSubmissions}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Pending</span>
                              <span className="font-semibold text-amber-400">
                                {assignment.pendingSubmissions}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-slate-800 pt-4">
                            <StatusBadge
                              status={
                                assignment.pendingSubmissions > 0
                                  ? "pending"
                                  : "graded"
                              }
                            />
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            className="mt-4 w-full"
                            onClick={() =>
                              handleViewSubmissions(assignment.assignmentId)
                            }
                          >
                            View Submissions
                            <ArrowRight size={15} />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </TeacherLayout>
  );
}
