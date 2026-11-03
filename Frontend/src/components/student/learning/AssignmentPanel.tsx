import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, ClipboardList, LoaderCircle, Send } from "lucide-react";

import { assignmentService } from "../../../services/assingment.service";
import { getApiErrorMessage } from "../../../utils/apiError";

import AssignmentQuestionCard from "./AssignmentQuestionCard";
import AssignmentResult from "./AssignmentResult";
import AssignmentAttemptHistory from "./AssignmentAttemptHistory";

import type {
  StudentAssignment,
  AssignmentSubmissionResult,
} from "../../../types/studentAssignment";

interface Props {
  lessonId: string;
}

export default function AssignmentPanel({ lessonId }: Props) {
  const [assignment, setAssignment] = useState<StudentAssignment | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AssignmentSubmissionResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAssignment = async () => {
      setLoading(true);
      setAssignment(null);
      setAnswers({});
      setResults([]);
      setNotAvailable(false);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await assignmentService.getStudentAssignment(lessonId);

        if (!isMounted) return;

        setAssignment(response.data);

        if (response.data.attemptsUsed > 0) {
          try {
            const resultResponse = await assignmentService.getResults(
              response.data.assignmentId,
            );

            if (isMounted) {
              setResults(resultResponse.data);
            }
          } catch {
            // Assignment remains usable if result history
            // cannot be loaded.
          }
        }
      } catch (error) {
        if (!isMounted) return;

        if (isAxiosError(error) && error.response?.status === 404) {
          setNotAvailable(true);
        } else {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadAssignment();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!assignment || submitting) return;

    const unanswered = assignment.questions.filter(
      (question) => !answers[question.questionId],
    );

    if (unanswered.length > 0) {
      setErrorMessage(
        `Please answer all ${assignment.questions.length} questions before submitting.`,
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to submit your assignment? You cannot change your answers after submission.",
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await assignmentService.submit(assignment.assignmentId, {
        answers: assignment.questions.map((question) => ({
          questionId: question.questionId,
          selectedAnswer: answers[question.questionId],
        })),
      });

      if (!response.success) {
        throw new Error(response.message || "Submission failed.");
      }

      setSuccessMessage("Your assignment was submitted successfully.");

      // Refresh the attempt count and result history.
      const [assignmentResponse, resultResponse] = await Promise.all([
        assignmentService.getStudentAssignment(lessonId),
        assignmentService.getResults(assignment.assignmentId),
      ]);

      setAssignment(assignmentResponse.data);
      setResults(resultResponse.data);
      setAnswers({});
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10">
        <LoaderCircle className="animate-spin text-indigo-600" />
        <span className="ml-3 text-sm text-slate-500">
          Loading assignment...
        </span>
      </div>
    );
  }

  if (notAvailable) {
    return (
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-slate-400" size={23} />
          <div>
            <h3 className="font-semibold text-slate-800">
              No assignment for this lesson
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your instructor hasn't added an assignment here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && !assignment) {
    return (
      <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">
          Unable to load assignment
        </p>
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      </div>
    );
  }

  if (!assignment) return null;

  const latestResult = [...results].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )[0];

  const allAnswered = assignment.questions.every((question) =>
    Boolean(answers[question.questionId]),
  );

  return (
    <section className="mt-12 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Lesson assignment
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {assignment.title}
            </h2>
          </div>
        </div>

        {assignment.description && (
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {assignment.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            {assignment.totalMarks} total marks
          </span>

          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            {assignment.passingMarks} passing marks
          </span>

          {assignment.timeLimit !== undefined && (
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
              {assignment.timeLimit} minutes
            </span>
          )}

          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            {assignment.attemptsAllowed === undefined
              ? "Unlimited attempts"
              : `${assignment.attemptsRemaining ?? 0} attempts remaining`}
          </span>
        </div>

        {assignment.dueDate && (
          <p className="mt-4 text-xs text-slate-500">
            Deadline: {new Date(assignment.dueDate).toLocaleString()}
          </p>
        )}
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {errorMessage && assignment && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {latestResult && <AssignmentResult result={latestResult} />}

      <div>
        <div className="mb-5">
          <h3 className="font-bold text-slate-900">Questions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Select one answer for each question.
          </p>
        </div>

        <div className="space-y-5">
          {assignment.questions.map((question, index) => (
            <AssignmentQuestionCard
              key={question.questionId}
              question={question}
              index={index}
              selectedAnswer={answers[question.questionId] ?? ""}
              onSelect={handleAnswer}
              disabled={!assignment.canAttempt || submitting}
            />
          ))}
        </div>
      </div>

      {assignment.canAttempt ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Answered{" "}
            {
              Object.keys(answers).filter((id) =>
                assignment.questions.some(
                  (question) =>
                    question.questionId === id && Boolean(answers[id]),
                ),
              ).length
            }{" "}
            of {assignment.questions.length} questions
          </p>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!allAnswered || submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}

            {submitting ? "Submitting..." : "Submit assignment"}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {assignment.isExpired
            ? "The deadline for this assignment has passed."
            : "You have used all available attempts for this assignment."}
        </div>
      )}

      <AssignmentAttemptHistory results={results} />
    </section>
  );
}
