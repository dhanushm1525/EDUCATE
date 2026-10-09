interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const isActive = normalized === "active";

  return (
    <span
      className={`
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-medium
                ${isActive ? "text-emerald-400" : "text-slate-400"}
            `}
    >
      <span
        className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${isActive ? "bg-emerald-400" : "bg-slate-500"}
                `}
      />

      {status}
    </span>
  );
}
