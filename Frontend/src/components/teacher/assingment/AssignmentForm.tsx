import { useState } from "react";

import type {
  AssignmentQuestion,
  CreateAssignmentRequest,
} from "../../../types/assingment";

import { QuestionForm } from "./QuestionForm";

interface AssignmentFormProps {
  onSubmit: (data: CreateAssignmentRequest) => Promise<void>;
  loading?: boolean;
}

const createEmptyQuestion = (): AssignmentQuestion => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
});

const getLocalDateTime = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  return now.toISOString().slice(0, 16);
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export function AssignmentForm({
  onSubmit,
  loading = false,
}: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState<AssignmentQuestion[]>([
    createEmptyQuestion(),
  ]);

  const [passingMarks, setPassingMarks] = useState(1);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [attemptsAllowed, setAttemptsAllowed] = useState<number | undefined>();
  const [dueDate, setDueDate] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  const totalMarks = questions.reduce(
    (total, question) => total + Number(question.marks || 0),
    0,
  );

  const updateQuestion = (
    index: number,
    updatedQuestion: AssignmentQuestion,
  ) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? updatedQuestion : question,
      ),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((previous) =>
      previous.filter((_, questionIndex) => questionIndex !== index),
    );
  };

  const addQuestion = () => {
    setQuestions((previous) => [...previous, createEmptyQuestion()]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setDeadlineError("");

    if (passingMarks < 1 || passingMarks > totalMarks) {
      return;
    }

    let deadlineISO: string | undefined;

    if (dueDate) {
      const selectedDate = new Date(dueDate);

      if (
        Number.isNaN(selectedDate.getTime()) ||
        selectedDate.getTime() <= Date.now()
      ) {
        setDeadlineError("Please select a deadline in the future.");
        return;
      }

      deadlineISO = selectedDate.toISOString();
    }

    const data: CreateAssignmentRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      questions,
      passingMarks,
      timeLimit,
      attemptsAllowed,
      dueDate: deadlineISO,
    };

    await onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <span className="text-violet-600">Home</span>
          <span>/</span>
          <span>My Courses</span>
          <span>/</span>
          <span>Course Content</span>
          <span>/</span>
          <span className="text-violet-700">Create Assignment</span>
        </div>

        {/* Page header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-white via-white to-violet-50 p-6 shadow-sm sm:p-8">
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 3.5V2h6v1.5M9 9h6M9 13h6M9 17h3" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create Assignment
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Create an MCQ assignment for this lesson.
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-violet-100/70 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-purple-100/70 blur-2xl" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Details */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5m0-8h.01" />
                </svg>
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Assignment Details</h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Provide the basic information about the assignment.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={inputClass}
                  placeholder="e.g., JavaScript Basics Assignment"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <span className="text-xs text-slate-400">
                    {description.length}/500
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value.slice(0, 500))
                  }
                  className={`${inputClass} min-h-28 resize-y`}
                  rows={4}
                  placeholder="Describe this assignment (optional)"
                />
              </div>
            </div>
          </section>

          {/* Questions */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
                  </svg>
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Questions</h2>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Add MCQ questions with options and set marks for each.
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
                Total Marks: {totalMarks}
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((question, index) => (
                <QuestionForm
                  key={index}
                  question={question}
                  index={index}
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                  canRemove={questions.length > 1}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50/40 px-4 py-4 text-sm font-semibold text-violet-700 transition hover:border-violet-500 hover:bg-violet-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Another Question
            </button>
          </section>

          {/* Assignment Settings */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.9h-3l-.3-1.9a8 8 0 0 1-1.8-1l-1.7.7-1.5-2.6 1.5-1.1a8 8 0 0 1 0-2l-1.5-1.1 1.5-2.6 1.7.7a8 8 0 0 1 1.8-1L12.6 6h3l.3 1.9a8 8 0 0 1 1.8 1l1.7-.7 1.5 2.6-1.5 1.1a8 8 0 0 1 0 2Z"
                    transform="translate(-1 -1) scale(1.05)"
                  />
                </svg>
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Assignment Settings
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Configure passing criteria, time limit, attempts and deadline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Passing Marks */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M3 8h18l-2 8H5L3 8Z" />
                      <path d="M7 8V5h10v3M9 12h6M12 10v4" />
                    </svg>
                  </span>
                  <label className="text-sm font-semibold text-slate-800">
                    Passing Marks *
                  </label>
                </div>

                <input
                  type="number"
                  min={1}
                  max={totalMarks}
                  value={passingMarks}
                  onChange={(event) =>
                    setPassingMarks(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  required
                />

                <p className="mt-2 text-xs text-slate-500">
                  Out of {totalMarks} marks
                </p>
              </div>

              {/* Time Limit */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2M9 2h6" />
                    </svg>
                  </span>
                  <label className="text-sm font-semibold text-slate-800">
                    Time Limit
                  </label>
                </div>

                <input
                  type="number"
                  min={1}
                  value={timeLimit ?? ""}
                  onChange={(event) =>
                    setTimeLimit(
                      event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    )
                  }
                  className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Minutes"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Optional, in minutes
                </p>
              </div>

              {/* Attempts */}
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M20 7v5h-5M4 17v-5h5" />
                      <path d="M5.5 9a7 7 0 0 1 12-2L20 12M4 12l2.5 5a7 7 0 0 0 12-2" />
                    </svg>
                  </span>
                  <label className="text-sm font-semibold text-slate-800">
                    Attempts Allowed
                  </label>
                </div>

                <input
                  type="number"
                  min={1}
                  value={attemptsAllowed ?? ""}
                  onChange={(event) =>
                    setAttemptsAllowed(
                      event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    )
                  }
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  placeholder="Attempts"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Optional number of attempts
                </p>
              </div>

              {/* Submission Deadline */}
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h2" />
                    </svg>
                  </span>
                  <label className="text-sm font-semibold text-violet-900">
                    Submission Deadline
                  </label>
                </div>

                <input
                  type="datetime-local"
                  value={dueDate}
                  min={getLocalDateTime()}
                  onChange={(event) => {
                    setDueDate(event.target.value);
                    setDeadlineError("");
                  }}
                  className="w-full min-w-0 rounded-xl border border-violet-200 bg-white px-2 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Optional submission deadline
                </p>

                {deadlineError && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {deadlineError}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse justify-between gap-3 pb-8 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6M9 12h12" />
              </svg>
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading || passingMarks < 1 || passingMarks > totalMarks
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity=".25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
