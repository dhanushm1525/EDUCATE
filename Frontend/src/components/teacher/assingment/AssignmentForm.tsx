import { useState } from "react";
import {
  ClipboardList,
  Info,
  Layers3,
  Settings2,
  Award,
  Clock3,
  Repeat2,
  CalendarClock,
  Plus,
  ArrowLeft,
  Check,
  LoaderCircle,
} from "lucide-react";

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
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const sectionClass =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md";

const sectionHeaderClass =
  "flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-7";

const iconWrapperClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700";

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
    <div className="w-full space-y-6">
      {/* Assignment Header */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-white via-white to-violet-50 p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-violet-100/70 blur-2xl" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <ClipboardList size={27} />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-600">
              Lesson Assessment
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Assignment
            </h2>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Create an MCQ assignment for this lesson.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assignment Details */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className={iconWrapperClass}>
              <Info size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Assignment Details</h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Provide the basic information about your assignment.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            <div>
              <label
                htmlFor="assignment-title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Assignment Title <span className="text-red-500">*</span>
              </label>

              <input
                id="assignment-title"
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
                <label
                  htmlFor="assignment-description"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <span className="text-xs tabular-nums text-slate-400">
                  {description.length}/500
                </span>
              </div>

              <textarea
                id="assignment-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value.slice(0, 500))
                }
                className={`${inputClass} min-h-32 resize-y`}
                rows={4}
                placeholder="Describe this assignment (optional)"
              />
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className={sectionClass}>
          <div className={`${sectionHeaderClass} flex-wrap justify-between`}>
            <div className="flex items-center gap-3">
              <div className={iconWrapperClass}>
                <Layers3 size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Questions</h3>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Add MCQ questions with options and set marks for each.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-2.5">
              <Award size={18} className="text-violet-600" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-violet-500">
                  Total Marks
                </p>

                <p className="text-lg font-bold leading-tight text-violet-700">
                  {totalMarks}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
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

            <button
              type="button"
              onClick={addQuestion}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 px-4 py-4 text-sm font-semibold text-violet-700 transition hover:border-violet-500 hover:bg-violet-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 transition group-hover:bg-violet-200">
                <Plus size={17} />
              </span>
              Add Another Question
            </button>
          </div>
        </section>

        {/* Assignment Settings */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className={iconWrapperClass}>
              <Settings2 size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Assignment Settings</h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Configure passing criteria, time limit, attempts and deadline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-4">
            {/* Passing Marks */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Award size={19} />
                </span>

                <label
                  htmlFor="passing-marks"
                  className="text-sm font-semibold text-slate-800"
                >
                  Passing Marks *
                </label>
              </div>

              <input
                id="passing-marks"
                type="number"
                min={1}
                max={totalMarks}
                value={passingMarks}
                onChange={(event) =>
                  setPassingMarks(Number(event.target.value))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Out of {totalMarks} marks
              </p>
            </div>

            {/* Time Limit */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Clock3 size={19} />
                </span>

                <label
                  htmlFor="time-limit"
                  className="text-sm font-semibold text-slate-800"
                >
                  Time Limit
                </label>
              </div>

              <input
                id="time-limit"
                type="number"
                min={1}
                value={timeLimit ?? ""}
                onChange={(event) =>
                  setTimeLimit(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Minutes"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional, in minutes
              </p>
            </div>

            {/* Attempts */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <Repeat2 size={19} />
                </span>

                <label
                  htmlFor="attempts-allowed"
                  className="text-sm font-semibold text-slate-800"
                >
                  Attempts Allowed
                </label>
              </div>

              <input
                id="attempts-allowed"
                type="number"
                min={1}
                value={attemptsAllowed ?? ""}
                onChange={(event) =>
                  setAttemptsAllowed(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                placeholder="Attempts"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional number of attempts
              </p>
            </div>

            {/* Submission Deadline */}
            <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <CalendarClock size={19} />
                </span>

                <label
                  htmlFor="submission-deadline"
                  className="text-sm font-semibold text-violet-900"
                >
                  Submission Deadline
                </label>
              </div>

              <input
                id="submission-deadline"
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
        <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:p-5">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >
            <ArrowLeft size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || passingMarks < 1 || passingMarks > totalMarks}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={17} />
                Create Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
