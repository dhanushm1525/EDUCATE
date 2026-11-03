import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle size={28} className="animate-spin text-indigo-400" />

      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  );
}
