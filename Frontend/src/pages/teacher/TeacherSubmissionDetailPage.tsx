import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CircleX,
  FileText,
  UserRound,
} from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";

import { Button } from "../../components/common/ui/Button";
import { StatusBadge } from "../../components/common/ui/StatusBadge";
import { LoadingState } from "../../components/common/ui/LoadingState";
import { ErrorState } from "../../components/common/ui/ErrorState";

import { assignmentService } from "../../services/assingment.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { TeacherSubmissionDetail } from "../../types/teacherAssignment";

export default function TeacherSubmissionDetailPage() {
  const { assignmentId, submissionId } = useParams<{
    assignmentId: string;
    submissionId: string;
  }>();

  const navigate = useNavigate();

  const [submission, setSubmission] = useState<TeacherSubmissionDetail | null>(
    null,
  );

  const [teacherFeedback, setTeacherFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadSubmission = async () => {
      if (!assignmentId || !submissionId) {
        setError("Assignment ID or submission ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await assignmentService.getTeacherSubmissionDetail(
          assignmentId,
          submissionId,
        );

        if (!cancelled) {
          setSubmission(response.data);
          setTeacherFeedback(response.data.teacherFeedback ?? "");
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

    void loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [assignmentId, submissionId, reloadKey]);

  const handleGrade = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assignmentId || !submissionId || !submission) {
      return;
    }

    if (teacherFeedback.trim().length > 2000) {
      setGradeError("Feedback cannot exceed 2000 characters.");
      return;
    }

    try {
      setGrading(true);
      setGradeError(null);

      await assignmentService.gradeSubmission(assignmentId, submissionId, {
        teacherFeedback: teacherFeedback.trim() || undefined,
      });

      navigate(`/teacher/assignments/${assignmentId}/submissions`);
    } catch (err) {
      setGradeError(getApiErrorMessage(err));
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1);
  };

  const handleBack = () => {
    navigate(
      assignmentId
        ? `/teacher/assignments/${assignmentId}/submissions`
        : "/teacher/courses",
    );
  };

  return (
    <TeacherLayout
      contentClassName="mx-auto w-full max-w-5xl"
      mainClassName="min-h-screen p-6"
    >
      <div className="space-y-8">
        {/* Header */}
        <header>
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to submissions
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <FileText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Submission Review</h1>

              <p className="mt-1 text-sm text-slate-400">
                Review the student's answers and provide feedback.
              </p>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && <LoadingState message="Loading submission details..." />}

        {/* Error */}
        {!loading && error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {/* Main Content */}
        {!loading && !error && submission && (
          <div className="space-y-6">
            {/* Student and Assignment Information */}
            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-400">
                  <UserRound size={18} />
                  <h2 className="text-sm font-semibold">Student Information</h2>
                </div>

                <h3 className="text-lg font-semibold">
                  {submission.student.firstName} {submission.student.lastName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {submission.student.email}
                </p>

                <div className="mt-4">
                  <StatusBadge status={submission.status} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-400">
                  <FileText size={18} />
                  <h2 className="text-sm font-semibold">
                    Assignment Information
                  </h2>
                </div>

                <h3 className="text-lg font-semibold">
                  {submission.assignment.title}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Attempt</p>
                    <p className="mt-1 font-medium">
                      #{submission.attemptNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Submitted</p>
                    <p className="mt-1 text-sm font-medium">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Automatically Calculated Result */}
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="mb-4 font-semibold">
                Automatically Calculated Result
              </h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">Score</p>
                  <p className="mt-1 text-xl font-bold">
                    {submission.score}/{submission.totalMarks}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Percentage</p>
                  <p className="mt-1 text-xl font-bold">
                    {submission.percentage.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Passing Marks</p>
                  <p className="mt-1 text-xl font-bold">
                    {submission.passingMarks}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Result</p>

                  <div className="mt-2 flex items-center gap-2">
                    {submission.isPassed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <CircleX size={18} className="text-red-400" />
                    )}

                    <span
                      className={
                        submission.isPassed
                          ? "font-medium text-emerald-400"
                          : "font-medium text-red-400"
                      }
                    >
                      {submission.isPassed ? "Passed" : "Not Passed"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                The score and result are calculated automatically by the system
                and cannot be modified by the teacher.
              </p>
            </section>

            {/* Answer Review */}
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Answer Review</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review the selected answers against the correct answers.
                </p>
              </div>

              {submission.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        QUESTION {index + 1}
                      </p>

                      <h3 className="mt-2 font-medium text-white">
                        {answer.question}
                      </h3>
                    </div>

                    <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {answer.marks} marks
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {answer.options.map((option, optionIndex) => {
                      const isSelected = option === answer.selectedAnswer;
                      const isCorrect = option === answer.correctAnswer;

                      let optionStyle =
                        "border-slate-800 bg-slate-950 text-slate-300";

                      if (isCorrect) {
                        optionStyle =
                          "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                      } else if (isSelected) {
                        optionStyle =
                          "border-red-500/40 bg-red-500/10 text-red-300";
                      }

                      return (
                        <div
                          key={`${answer.questionId}-${optionIndex}`}
                          className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm ${optionStyle}`}
                        >
                          <span>
                            {option}

                            {isSelected && (
                              <span className="ml-2 text-xs opacity-70">
                                (Selected)
                              </span>
                            )}
                          </span>

                          {isCorrect && (
                            <CheckCircle2
                              size={16}
                              className="shrink-0 text-emerald-400"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-slate-500">Student answer:</span>

                    <span className="text-slate-300">
                      {answer.selectedAnswer}
                    </span>

                    <span
                      className={
                        answer.isCorrect
                          ? "font-medium text-emerald-400"
                          : "font-medium text-red-400"
                      }
                    >
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            {/* Teacher Evaluation */}
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Teacher Evaluation</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review the automatically calculated result and provide
                  feedback to the student.
                </p>
              </div>

              {submission.status === "graded" ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={18} />
                      <p className="font-medium">
                        This submission has already been reviewed.
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      The feedback submission cannot be repeated.
                    </p>
                  </div>

                  {submission.teacherFeedback && (
                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                      <p className="mb-2 text-sm font-medium text-slate-300">
                        Submitted Teacher Feedback
                      </p>

                      <p className="whitespace-pre-wrap text-sm text-slate-400">
                        {submission.teacherFeedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleGrade} className="space-y-5">
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <p className="text-sm font-medium text-slate-300">
                      Automatically Calculated Score
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {submission.score}/{submission.totalMarks}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Passing marks: {submission.passingMarks}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      This score is calculated automatically and cannot be
                      modified.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="teacherFeedback"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Teacher Feedback{" "}
                      <span className="ml-2 font-normal text-slate-500">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="teacherFeedback"
                      rows={4}
                      maxLength={2000}
                      value={teacherFeedback}
                      onChange={(event) =>
                        setTeacherFeedback(event.target.value)
                      }
                      placeholder="Provide feedback to the student..."
                      className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                    />

                    <p className="mt-1 text-right text-xs text-slate-500">
                      {teacherFeedback.length}/2000
                    </p>
                  </div>

                  {gradeError && (
                    <p className="text-sm text-red-400" role="alert">
                      {gradeError}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={grading}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" loading={grading}>
                      <CheckCircle2 size={16} />
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
