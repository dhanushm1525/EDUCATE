import { CheckCircle2, Circle } from "lucide-react";
import type { StudentAssignmentQuestion } from "../../../types/studentAssignment";

interface Props {
  question: StudentAssignmentQuestion;
  index: number;
  selectedAnswer: string;
  onSelect: (questionId: string, answer: string) => void;
  disabled?: boolean;
}

export default function AssignmentQuestionCard({
  question,
  index,
  selectedAnswer,
  onSelect,
  disabled = false,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Question {index + 1}
          </p>

          <h3 className="mt-2 font-semibold leading-7 text-slate-900">
            {question.question}
          </h3>
        </div>

        <span className="shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          {question.marks} marks
        </span>
      </div>

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const selected = selectedAnswer === option;

          return (
            <button
              key={`${question.questionId}-${optionIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(question.questionId, option)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {selected ? (
                <CheckCircle2 size={19} className="shrink-0 text-indigo-600" />
              ) : (
                <Circle size={19} className="shrink-0 text-slate-300" />
              )}

              <span className="text-sm text-slate-700">{option}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
