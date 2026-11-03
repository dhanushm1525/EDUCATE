import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-slate-900 p-10 text-center ${className}`}
      role="alert"
    >
      <AlertCircle size={30} className="text-red-400" />

      <p className="mt-3 text-sm text-red-400">{message}</p>

      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-5"
        >
          <RefreshCw size={14} />
          Try Again
        </Button>
      )}
    </div>
  );
}
