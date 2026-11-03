interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  published: "bg-emerald-500/10 text-emerald-400",
  graded: "bg-emerald-500/10 text-emerald-400",

  pending: "bg-amber-500/10 text-amber-400",
  submitted: "bg-amber-500/10 text-amber-400",

  blocked: "bg-red-500/10 text-red-400",
  rejected: "bg-red-500/10 text-red-400",
  cancelled: "bg-red-500/10 text-red-400",

  draft: "bg-slate-500/10 text-slate-400",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const styles = statusStyles[normalized] ?? "bg-slate-500/10 text-slate-400";

  const label = status.replace(/_/g, " ");

  return (
    <span
      className={`
                inline-flex items-center rounded-full
                px-3 py-1 text-xs font-medium capitalize
                ${styles}
                ${className}
            `}
    >
      {label}
    </span>
  );
}
