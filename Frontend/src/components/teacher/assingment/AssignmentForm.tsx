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

  const totalMarks = questions.reduce(
    (total, question) => total + Number(question.marks || 0),
    0,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data: CreateAssignmentRequest = {
      title,
      description: description || undefined,
      questions,
      passingMarks,
      timeLimit,
      attemptsAllowed,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}

      <div className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Assignment Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assignment Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="JavaScript Basics Assignment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border p-3"
            rows={3}
            placeholder="Describe this assignment"
          />
        </div>
      </div>

      {/* Questions */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>

          <span className="text-sm text-gray-500">
            Total Marks: {totalMarks}
          </span>
        </div>

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
          className="rounded-lg border px-4 py-2"
        >
          + Add Question
        </button>
      </div>

      {/* Assignment Settings */}

      <div className="rounded-xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Assignment Settings</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Passing Marks
          </label>

          <input
            type="number"
            min={1}
            max={totalMarks}
            value={passingMarks}
            onChange={(event) => setPassingMarks(Number(event.target.value))}
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Time Limit (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={timeLimit ?? ""}
            onChange={(event) =>
              setTimeLimit(
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className="w-full rounded-lg border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Attempts Allowed
          </label>

          <input
            type="number"
            min={1}
            value={attemptsAllowed ?? ""}
            onChange={(event) =>
              setAttemptsAllowed(
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg px-6 py-3 bg-black text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Assignment"}
      </button>
    </form>
  );
}
