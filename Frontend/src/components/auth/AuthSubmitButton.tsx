import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface AuthSubmitButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  children: ReactNode;
  isLoading: boolean;
  loadingText: string;
  showArrow?: boolean;
}

export default function AuthSubmitButton({
  children,
  isLoading,
  loadingText,
  showArrow = true,
  className,
  ...buttonProps
}: AuthSubmitButtonProps) {
  return (
    <button
      {...buttonProps}
      type="submit"
      disabled={isLoading || buttonProps.disabled}
      className={`mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:from-blue-500 hover:to-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
      {isLoading ? (
        loadingText
      ) : (
        <>
          <span>{children}</span>
          {showArrow && <ArrowRight className="h-3.5 w-3.5" />}
        </>
      )}
    </button>
  );
}
