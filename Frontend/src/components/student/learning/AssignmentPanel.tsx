import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import {
  AlertCircle,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Play,
  Send,
} from "lucide-react";

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
  onAssignmentSubmitted?: () => void | Promise<void>;
}

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":");
};

export default function AssignmentPanel({
  lessonId,
  onAssignmentSubmitted,
}: Props) {
  const [assignment, setAssignment] = useState<StudentAssignment | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AssignmentSubmissionResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingAnswers, setSavingAnswers] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [notAvailable, setNotAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const expiredAttemptRef = useRef<string | null>(null);
  const answersRef = useRef<Record<string, string>>({});
  const activeAttemptRef = useRef<string | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Restore answers from the backend.
  const loadAssignment = useCallback(async (): Promise<StudentAssignment> => {
    const response = await assignmentService.getStudentAssignment(lessonId);
    const data = response.data;

    setAssignment(data);

    const attempt = data.activeAttempt;

    activeAttemptRef.current = attempt?.submissionId ?? null;

    const restoredAnswers: Record<string, string> = {};

    if (attempt) {
      attempt.answers?.forEach((answer) => {
        restoredAnswers[answer.questionId] = answer.selectedAnswer;
      });

      if (attempt.expiresAt) {
        const expiryTime = new Date(attempt.expiresAt).getTime();

        setRemainingSeconds(
          Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)),
        );
      } else {
        setRemainingSeconds(0);
      }
    } else {
      setRemainingSeconds(0);
    }

    answersRef.current = restoredAnswers;
    setAnswers(restoredAnswers);

    if (data.attemptsUsed > 0) {
      try {
        const resultResponse = await assignmentService.getResults(
          data.assignmentId,
        );

        setResults(resultResponse.data);
      } catch {
        // Keep the assignment usable if results cannot be loaded.
      }
    } else {
      setResults([]);
    }

    return data;
  }, [lessonId]);

  // Initial assignment loading.
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        await loadAssignment();

        if (isMounted) {
          setNotAvailable(false);
          setErrorMessage(null);
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

    expiredAttemptRef.current = null;
    void load();

    return () => {
      isMounted = false;
    };
  }, [loadAssignment]);

  const activeAttempt = assignment?.activeAttempt;

  const hasTimer = Boolean(activeAttempt?.expiresAt);

  const isTimeExpired = hasTimer && remainingSeconds <= 0;

  // Countdown only when the backend provides expiresAt.
  useEffect(() => {
    if (!activeAttempt?.expiresAt) return;

    const updateCountdown = () => {
      const expiryTime = new Date(activeAttempt.expiresAt!).getTime();

      const remaining = Math.max(
        0,
        Math.ceil((expiryTime - Date.now()) / 1000),
      );

      setRemainingSeconds(remaining);
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [activeAttempt?.submissionId, activeAttempt?.expiresAt]);

  // Refresh assignment when the timer expires.
  useEffect(() => {
    if (
      !activeAttempt?.expiresAt ||
      !isTimeExpired ||
      expiredAttemptRef.current === activeAttempt.submissionId
    ) {
      return;
    }

    expiredAttemptRef.current = activeAttempt.submissionId;

    const expireAttempt = async () => {
      try {
        const data = await loadAssignment();

        setErrorMessage("Your assignment time has expired.");

        if (!data.activeAttempt) {
          answersRef.current = {};
          setAnswers({});
        }
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      }
    };

    void expireAttempt();
  }, [
    isTimeExpired,
    activeAttempt?.submissionId,
    activeAttempt?.expiresAt,
    loadAssignment,
  ]);

  // Queue answer saves so older requests cannot overwrite newer answers.
  const queueAnswerSave = useCallback(
    (
      assignmentId: string,
      attemptId: string,
      answerSnapshot: Record<string, string>,
    ) => {
      const answerPayload = Object.entries(answerSnapshot).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        }),
      );

      setSavingAnswers(true);

      saveQueueRef.current = saveQueueRef.current
        .catch(() => {
          // Allow the queue to continue after an earlier failure.
        })
        .then(async () => {
          if (activeAttemptRef.current !== attemptId) {
            return;
          }

          await assignmentService.saveAnswers(
            assignmentId,
            attemptId,
            answerPayload,
          );
        })
        .catch((error: unknown) => {
          setErrorMessage(
            `Unable to save your answers: ${getApiErrorMessage(error)}`,
          );
        })
        .finally(() => {
          setSavingAnswers(false);
        });
    },
    [],
  );

  // Update local UI immediately and save to MongoDB.
  const handleAnswer = useCallback(
    (questionId: string, answer: string) => {
      if (!assignment || !activeAttempt || submitting || isTimeExpired) {
        return;
      }

      const updatedAnswers = {
        ...answersRef.current,
        [questionId]: answer,
      };

      answersRef.current = updatedAnswers;
      setAnswers(updatedAnswers);

      setErrorMessage(null);

      queueAnswerSave(
        assignment.assignmentId,
        activeAttempt.submissionId,
        updatedAnswers,
      );
    },
    [assignment, activeAttempt, submitting, isTimeExpired, queueAnswerSave],
  );

  // Start a new attempt through the backend.
  const handleStartAttempt = async () => {
    if (!assignment || starting) return;

    try {
      setStarting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await assignmentService.startAttempt(assignment.assignmentId);

      const data = await loadAssignment();

      if (data.activeAttempt) {
        expiredAttemptRef.current = null;
        setSuccessMessage("Your assignment attempt has started. Good luck!");
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setStarting(false);
    }
  };

  // Submit the existing active attempt.
  const handleSubmit = async () => {
    if (!assignment || submitting || !activeAttempt) {
      return;
    }

    if (isTimeExpired) {
      setErrorMessage("Your assignment time has expired.");
      return;
    }

    const currentAnswers = answersRef.current;

    const unanswered = assignment.questions.filter(
      (question) => !currentAnswers[question.questionId],
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

      await saveQueueRef.current;

      await assignmentService.saveAnswers(
        assignment.assignmentId,
        activeAttempt.submissionId,
        assignment.questions.map((question) => ({
          questionId: question.questionId,
          selectedAnswer: answersRef.current[question.questionId] ?? "",
        })),
      );

      const response = await assignmentService.submit(assignment.assignmentId, {
        answers: assignment.questions.map((question) => ({
          questionId: question.questionId,
          selectedAnswer: currentAnswers[question.questionId],
        })),
      });

      if (!response.success) {
        throw new Error(response.message || "Submission failed.");
      }

      activeAttemptRef.current = null;
      answersRef.current = {};

      setAnswers({});
      setSuccessMessage("Your assignment was submitted successfully.");

      await loadAssignment();

      // Refresh course progress after successful submission.
      try {
        await onAssignmentSubmitted?.();
      } catch (error) {
        console.error("Unable to refresh course progress:", error);
      }
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
      <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
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

  const answeredCount = assignment.questions.filter((question) =>
    Boolean(answers[question.questionId]),
  ).length;

  return (
    <section className="mt-12 space-y-6">
      {/* Assignment header */}
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

      {/* Feedback messages */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {latestResult && <AssignmentResult result={latestResult} />}

      {/* Before starting */}
      {!activeAttempt ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Assignment instructions
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Total questions: {assignment.questions.length}</li>
            <li>• Total marks: {assignment.totalMarks}</li>
            <li>• Passing marks: {assignment.passingMarks}</li>

            <li>
              • Time limit:{" "}
              {assignment.timeLimit !== undefined
                ? `${assignment.timeLimit} minutes`
                : "No time limit"}
            </li>

            <li>
              • Attempts remaining:{" "}
              {assignment.attemptsRemaining === null
                ? "Unlimited"
                : assignment.attemptsRemaining}
            </li>
          </ul>

          {assignment.canAttempt ? (
            <button
              type="button"
              onClick={() => void handleStartAttempt()}
              disabled={starting}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {starting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Play size={17} />
              )}

              {starting ? "Starting..." : "Start Attempt"}
            </button>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {assignment.isExpired
                ? "The deadline for this assignment has passed."
                : "You have used all available attempts."}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Active attempt status */}
          <div className="flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Attempt {activeAttempt.attemptNumber}
              </p>

              <p className="mt-1 text-sm text-indigo-900">
                Your answers are automatically saved to your account.
              </p>

              <p className="mt-1 text-xs text-indigo-700">
                {savingAnswers ? "Saving answers..." : "All changes saved"}
              </p>
            </div>

            {hasTimer && (
              <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-lg font-bold tabular-nums text-indigo-700">
                <Clock3 size={20} />
                {formatTime(remainingSeconds)}
              </div>
            )}
          </div>

          {/* Assignment questions */}
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
                  disabled={submitting || isTimeExpired}
                />
              ))}
            </div>
          </div>

          {/* Submit section */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Answered {answeredCount} of {assignment.questions.length}{" "}
              questions
            </p>

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!allAnswered || submitting || isTimeExpired}
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
        </>
      )}

      <AssignmentAttemptHistory results={results} />
    </section>
  );
}
