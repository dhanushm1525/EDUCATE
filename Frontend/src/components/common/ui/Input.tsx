import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="
                        block
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-300
                    "
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={id}
        className={`
                    w-full
                    rounded-md
                    border
                    border-slate-700
                    bg-slate-800
                    px-3
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-blue-500
                    ${className}
                `}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
