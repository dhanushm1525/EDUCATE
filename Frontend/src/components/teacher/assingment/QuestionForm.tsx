
import type { AssignmentQuestion } from "../../../types/assingment";

interface QuestionFormProps {
  question: AssignmentQuestion;
  index: number;
  onChange: (index: number, question: AssignmentQuestion) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export function QuestionForm({
  question,
  index,
  onChange,
  onRemove,
  canRemove,
}: QuestionFormProps) {
  const updateQuestion = (
    field: keyof AssignmentQuestion,
    value: string | number,
  ) => {
    onChange(index, {
      ...question,
      [field]: value,
    });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const updatedOptions = [...question.options];
    const previousValue = updatedOptions[optionIndex];

    updatedOptions[optionIndex] = value;

    onChange(index, {
      ...question,
      options: updatedOptions,
      correctAnswer:
        question.correctAnswer === previousValue
          ? value
          : question.correctAnswer,
    });
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Question header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
            {index + 1}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              Question {index + 1}
            </h3>
            <p className="text-xs text-slate-500">
              Multiple choice question
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700">
            {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
          </span>

          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove question ${index + 1}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 hover:text-red-700"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Question content */}
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Question <span className="text-red-500">*</span>
          </label>

          <textarea
            value={question.question}
            onChange={(event) =>
              updateQuestion("question", event.target.value)
            }
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="Type your question here..."
            rows={3}
            required
          />
        </div>

        {/* Options */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Answer Options <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                  {letters[optionIndex] ?? optionIndex + 1}
                </span>

                <input
                  type="text"
                  value={option}
                  onChange={(event) =>
                    updateOption(optionIndex, event.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder={`Enter option ${letters[optionIndex] ?? optionIndex + 1}`}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Correct answer and marks */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Correct Answer <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={question.correctAnswer}
                onChange={(event) =>
                  updateQuestion("correctAnswer", event.target.value)
                }
                className={`${inputClass} appearance-none pr-10`}
                required
              >
                <option value="">Select correct option</option>

                {question.options.map((option, optionIndex) => (
                  <option
                    key={optionIndex}
                    value={option}
                    disabled={!option.trim()}
                  >
                    Option {letters[optionIndex] ?? optionIndex + 1}
                    {option ? ` — ${option}` : ""}
                  </option>
                ))}
              </select>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Marks <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min={1}
              value={question.marks}
              onChange={(event) =>
                updateQuestion("marks", Number(event.target.value))
              }
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
