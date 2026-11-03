import type { AssignmentSubmissionResult } from "../../../types/studentAssignment";

interface Props {
  results: AssignmentSubmissionResult[];
}

export default function AssignmentAttemptHistory({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h3 className="font-bold text-slate-900">Previous attempts</h3>

      <div className="mt-4 space-y-3">
        {results.map((result) => (
          <div
            key={result.submissionId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Attempt {result.attemptNumber}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {new Date(result.submittedAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                {result.score}/{result.totalMarks}
              </p>

              <p
                className={`mt-1 text-xs font-semibold ${
                  result.isPassed ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {result.isPassed ? "Passed" : "Not passed"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
