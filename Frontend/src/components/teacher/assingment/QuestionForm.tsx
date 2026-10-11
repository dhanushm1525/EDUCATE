import type { AssignmentQuestion } from "../../../types/assingment";

interface QuestionFormProps {
  question: AssignmentQuestion;
  index: number;

  onChange: (index: number, question: AssignmentQuestion) => void;

  onRemove: (index: number) => void;

  canRemove: boolean;
}

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

    updatedOptions[optionIndex] = value;

    onChange(index, {
      ...question,
      options: updatedOptions,
    });
  };

  return (
    <div className="rounded-xl border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Question {index + 1}</h3>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-sm text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {/* Question */}

      <div>
        <label className="block text-sm font-medium mb-1">Question</label>

        <textarea
          value={question.question}
          onChange={(event) => updateQuestion("question", event.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Enter your question"
          rows={3}
        />
      </div>

      {/* Options */}

      <div className="space-y-3">
        <label className="block text-sm font-medium">Options</label>

        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center gap-3">
            <span className="w-6 text-sm font-medium">
              {String.fromCharCode(65 + optionIndex)}
            </span>

            <input
              type="text"
              value={option}
              onChange={(event) =>
                updateOption(optionIndex, event.target.value)
              }
              className="flex-1 rounded-lg border p-2"
              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
            />
          </div>
        ))}
      </div>

      {/* Correct Answer */}

      <div>
        <label className="block text-sm font-medium mb-1">Correct Answer</label>

        <select
          value={question.correctAnswer}
          onChange={(event) =>
            updateQuestion("correctAnswer", event.target.value)
          }
          className="w-full rounded-lg border p-2"
        >
          <option value="">Select correct answer</option>

          {question.options.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              Option {String.fromCharCode(65 + optionIndex)}
              {option ? ` — ${option}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Marks */}

      <div>
        <label className="block text-sm font-medium mb-1">Marks</label>

        <input
          type="number"
          min={1}
          value={question.marks}
          onChange={(event) =>
            updateQuestion("marks", Number(event.target.value))
          }
          className="w-full rounded-lg border p-2"
        />
      </div>
    </div>
  );
}
