import { CheckCircle2, XCircle } from "lucide-react";
import type { AssignmentSubmissionResult } from "../../../types/studentAssignment";

interface Props {
  result: AssignmentSubmissionResult;
}

export default function AssignmentResult({ result }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        {result.isPassed ? (
          <CheckCircle2 size={28} className="text-emerald-600" />
        ) : (
          <XCircle size={28} className="text-red-500" />
        )}

        <div>
          <h3 className="font-bold text-slate-900">
            {result.isPassed ? "Assignment passed" : "Not passed"}
          </h3>

          <p className="text-xs text-slate-500">
            Attempt {result.attemptNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Score</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {result.score}/{result.totalMarks}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Percentage</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {result.percentage}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Passing marks</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {result.passingMarks}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 text-sm font-bold capitalize text-slate-900">
            {result.status}
          </p>
        </div>
      </div>

      {result.teacherFeedback && (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-900">
            Teacher feedback
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-indigo-800">
            {result.teacherFeedback}
          </p>
        </div>
      )}
    </section>
  );
}
