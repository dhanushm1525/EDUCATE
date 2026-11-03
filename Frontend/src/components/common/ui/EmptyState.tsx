import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-12 text-center ${className}`}
    >
      {icon && <div className="mb-4 text-slate-500">{icon}</div>}

      <h3 className="font-semibold text-white">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
