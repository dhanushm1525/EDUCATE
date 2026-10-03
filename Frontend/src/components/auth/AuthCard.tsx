import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

const defaultClassName =
  "w-full max-w-md rounded-2xl border border-slate-800/90 bg-[#162032]/80 p-7 shadow-2xl backdrop-blur-md sm:p-9";

export default function AuthCard({
  children,
  className = defaultClassName,
}: AuthCardProps) {
  return (
    <div className={className}>{children}</div>
  );
}
