import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  icon?: LucideIcon;
  labelAction?: ReactNode;
  inputClassName?: string;
}

const defaultInputClassName =
  "w-full rounded-lg border border-slate-700/80 bg-[#0B1120]/80 py-2.5 text-xs text-white placeholder:text-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function AuthField({
  label,
  type = "text",
  icon: Icon,
  labelAction,
  inputClassName = defaultInputClassName,
  className,
  ...inputProps
}: AuthFieldProps) {
  const generatedId = useId();
  const id = inputProps.name || generatedId;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const hasTrailingAction = isPassword;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-medium text-slate-300"
        >
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />
        )}
        <input
          {...inputProps}
          id={id}
          type={isPassword && isPasswordVisible ? "text" : type}
          className={`${inputClassName} ${Icon ? "pl-10" : "pl-3.5"} ${hasTrailingAction ? "pr-10" : "pr-3.5"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            className="absolute right-3.5 text-slate-500 transition-colors hover:text-slate-300 focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}