import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;

  options: SelectOption[];

  error?: string;
}

export function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
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

      <select
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
                    focus:border-blue-500
                    ${className}
                `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
